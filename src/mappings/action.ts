import {
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"

import {getAssetId, getOrCreateAsset, getOrCreateBorrow, getOrCreateRepay} from "../helpers/action"
import {ethereum, store, BigInt} from "@graphprotocol/graph-ts";
import {getTxnInputDataToDecode} from "../utils/dataToDecode";

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
        const id = getAssetId(_asset.toTuple()[0].toAddress(), _asset.toTuple()[1].toBigInt())
        const asset = getOrCreateAsset(id.toHexString())
        asset.collection = _asset.toTuple()[0].toAddress()
        asset.tokenId = _asset.toTuple()[1].toBigInt()
        asset.borrow = borrow.id

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

export function handleRepay(event: RepayEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())
    const borrow = getOrCreateBorrow(event.params.loanId.toHexString())

    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.assets = event.params.assets

    for (let index = 0; index < event.params.assets.length; index++) {
        const assetId = event.params.assets[index]
        store.remove('Asset', assetId.toHexString().toLowerCase())
    }

    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash

    repay.save()
    borrow.totalAssets = borrow.totalAssets.minus(BigInt.fromI32(event.params.assets.length))
    borrow.amount = borrow.amount.minus(repay.amount)
    borrow.save()

    const borrowedAmount = account.amountBorrowed.minus(repay.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(event.params.assets.length))

    account.amountBorrowed = borrowedAmount
    account.user = event.params.user
    account.totalAssets = newTotalAssets
    account.save()
}

