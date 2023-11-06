import {
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import { Asset } from "../../generated/schema";
import {getOrCreateAccount} from "../helpers/account"

import {getAssetId, getOrCreateAsset, getOrCreateBorrow, getOrCreateRepay} from "../helpers/action"
import {log, Bytes, ethereum, store} from "@graphprotocol/graph-ts";

export function handleBorrow(event: BorrowEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrow = getOrCreateBorrow(event.params.loanId.toHexString())

    borrow.user = account.id
    borrow.amount = borrow.amount.plus(event.params.amount)
    
    borrow.totalAssets = event.params.totalAssets
    borrow.uToken = event.params.token
    borrow.transactionInput = event.transaction.input

    const dataToDecode = getTxnInputDataToDecode(event)
    const decoded = ethereum.decode('(address,uint256,(address,uint256)[],SignAction,EIP712Signature)', dataToDecode);
    const assets = decoded!.toTuple()[2].toArray()
    for (let index = 0; index < assets.length; index++) {
        const _asset = assets[index]
        const id = _asset.toTuple()[0].toAddress().toHexString() + "-" + _asset.toTuple()[1].toBigInt().toString()
        const asset = getOrCreateAsset(id)
        asset.collection = _asset.toTuple()[0].toAddress()
        asset.tokenId = _asset.toTuple()[1].toBigInt()
        asset.borrow = borrow.id
        asset.assetId = getAssetId(_asset.toTuple()[0].toAddress(), _asset.toTuple()[1].toBigInt())

        asset.save()
    }

    borrow.blockNumber = event.block.number
    borrow.blockTimestamp = event.block.timestamp
    borrow.transactionHash = event.transaction.hash

    borrow.save()

    const borrowed = account.amountBorrowed.plus(event.params.amount)
    const totalAssets = account.totalAssets.plus(borrow.totalAssets)

    account.amountBorrowed = borrowed
    account.user = event.params.user
    account.totalAssets = totalAssets

    account.save()
}

function getTxnInputDataToDecode(event: ethereum.Event): Bytes {
    const inputDataHexString = event.transaction.input.toHexString().slice(10); //take away function signature: 0x????????
    const hexStringToDecode = '0x0000000000000000000000000000000000000000000000000000000000000020' + inputDataHexString; // prepend tuple offset
    return Bytes.fromByteArray(Bytes.fromHexString(hexStringToDecode));
}

function findAssetByAssetId(assets: Asset[], assetId: Bytes): Asset | null {
    for (let index = 0; index < assets.length; index++) {
        const asset = assets[index]
        if(asset.assetId == assetId) {
            return asset
        }
    }
    return null
}

export function handleRepay(event: RepayEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())
    const borrow = getOrCreateBorrow(event.params.loanId.toHexString())

    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.unlockedAssets = event.params.unlockedAssets

    const dataToDecode = getTxnInputDataToDecode(event)
    const repayABI = "uint256,((bytes32,uint256,uint256,uint256,uint256,uint256,uint256),bytes32[],uint256,uint256),(uint8,bytes32,bytes32,uint256)";
    let decoded = ethereum.decode(repayABI, dataToDecode)
    log.info("Decoded: {}", ["Decoded"])

    if(decoded != null) {
        decoded = decoded.toTuple()[1]
        const decodedAssets = decoded.toTuple()[1]
        const assets = decodedAssets.toArray()
        const borrowAssets = borrow.assets.load()
        
        for (let index = 0; index < assets.length; index++) {
            const _asset = assets[index]
            const existAsset = findAssetByAssetId(borrowAssets, _asset.toBytes())
            if(existAsset != null) {
                store.remove('Asset', existAsset.id)
            }
        }
    }

    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash

    repay.save()

    const borrowedAmount = account.amountBorrowed.minus(repay.amount)
    const newTotalAssets = account.totalAssets.minus(event.params.unlockedAssets)

    account.amountBorrowed = borrowedAmount
    account.user = event.params.user
    account.totalAssets = newTotalAssets
    account.save()
}
