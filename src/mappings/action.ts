import {
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"

import {getOrCreateAsset, getOrCreateBorrow, getOrCreateRepay} from "../helpers/action"
import {Bytes, ethereum} from "@graphprotocol/graph-ts";
import {Asset} from "../../generated/schema";

export function handleBorrow(event: BorrowEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrow = getOrCreateBorrow(event.transaction.hash.toHexString())

    borrow.user = event.params.user
    borrow.loanId = event.params.loanId
    borrow.amount = event.params.amount
    borrow.totalAssets = event.params.totalAssets
    borrow.uToken = event.params.token
    borrow.transactionInput = event.transaction.input

    const dataToDecode = getTxnInputDataToDecode(event)
    const decoded = ethereum.decode('(address,uint256,(address,uint256)[],SignAction,EIP712Signature)', dataToDecode);

    decoded!.toTuple()[2].toArray().forEach((_asset) => {
        const asset = getOrCreateAsset(_asset.toTuple()[0].toAddress().toHexString() + "-" + _asset.toTuple()[1].toBigInt().toString())
        asset.collection = _asset.toTuple()[0].toAddress()
        asset.tokenId = _asset.toTuple()[1].toBigInt()
        asset.save()
    })

    borrow.blockNumber = event.block.number
    borrow.blockTimestamp = event.block.timestamp
    borrow.transactionHash = event.transaction.hash

    borrow.save()

    const borrowed = account.amountBorrowed.plus(borrow.amount)
    account.amountBorrowed = borrowed
    account.user = event.params.user
    account.save()
}

function getTxnInputDataToDecode(event: ethereum.Event): Bytes {
    const inputDataHexString = event.transaction.input.toHexString().slice(10); //take away function signature: '0x????????'
    const hexStringToDecode = '0x0000000000000000000000000000000000000000000000000000000000000020' + inputDataHexString; // prepend tuple offset
    return Bytes.fromByteArray(Bytes.fromHexString(hexStringToDecode));
}

export function handleRepay(event: RepayEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())

    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.unlockedAssets = event.params.unlockedAssets

    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash

    repay.save()

    const repaid = account.amountBorrowed.minus(repay.amount)
    account.amountBorrowed = repaid
    account.user = event.params.user
    account.save()
}
