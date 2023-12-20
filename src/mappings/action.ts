import {
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"

import {getAssetId, getOrCreateAsset, getOrCreateBorrow, getOrCreateLoan, getOrCreateRepay} from "../helpers/action"
import {ethereum, store, BigInt} from "@graphprotocol/graph-ts";
import {getTxnInputDataToDecode} from "../utils/dataToDecode";
import { LoanStatus } from "../utils/constants";
import { getOrCreateTotalCount } from "../helpers/totalCount";

export function handleBorrow(event: BorrowEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrow = getOrCreateBorrow(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())

    // BORROW 
    borrow.uToken = event.params.token
    borrow.loanId = event.params.loanId
    borrow.user = event.params.user
    borrow.amount = event.params.amount

    borrow.blockNumber = event.block.number
    borrow.blockTimestamp = event.block.timestamp
    borrow.transactionHash = event.transaction.hash
    borrow.transactionInput = event.transaction.input

    borrow.save()

    // LOAN
    loan.id = event.params.loanId.toHexString()
    loan.user = event.params.user.toHexString()
    loan.status = BigInt.fromI32(LoanStatus.BORROWED)
    loan.amount = event.params.amount     
    loan.uToken = event.params.token
    
    if(event.params.totalAssets.gt(BigInt.fromI32(0))) {
        loan.totalAssets = event.params.totalAssets
    }
    
    // ASSETS
    const dataToDecode = getTxnInputDataToDecode(event)
    const decoded = ethereum.decode('(address,uint256,(address,uint256)[],SignAction,EIP712Signature)', dataToDecode);
    const assets = decoded!.toTuple()[2].toArray()
    const totalCount = getOrCreateTotalCount()
    for (let index = 0; index < assets.length; index++) {
        const _asset = assets[index]
        const id = getAssetId(_asset.toTuple()[0].toAddress(), _asset.toTuple()[1].toBigInt())
        const asset = getOrCreateAsset(id.toHexString())
        asset.collection = _asset.toTuple()[0].toAddress()
        asset.tokenId = _asset.toTuple()[1].toBigInt()
        asset.loan = loan.id

        asset.save()
        totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
    }

    totalCount.save()
    loan.save()

    // ACCOUNT
    const borrowed = account.amountBorrowed.plus(event.params.amount)
    const totalAssets = account.totalAssets.plus(loan.totalAssets)

    account.amountBorrowed = borrowed
    account.user = event.params.user
    account.totalAssets = totalAssets

    account.save()
}

export function handleRepay(event: RepayEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    const totalCount = getOrCreateTotalCount()

    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.assets = event.params.assets
    
    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash
    repay.transactionInput = event.transaction.input

    let totalAssets = loan.totalAssets

    for (let index = 0; index < event.params.assets.length; index++) {
        const assetId = event.params.assets[index]
        store.remove('Asset', assetId.toHexString().toLowerCase())
        totalCount.totalCount = totalCount.totalCount.minus(BigInt.fromI32(1))
        totalAssets = totalAssets.minus(BigInt.fromI32(1))
    }

    totalCount.save()
    repay.save()
    
    loan.amount = loan.amount.minus(repay.amount)
    loan.totalAssets = totalAssets
    loan.save() 

    if(loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    const borrowedAmount = account.amountBorrowed.minus(repay.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(event.params.assets.length))

    account.amountBorrowed = borrowedAmount
    account.user = event.params.user
    account.totalAssets = newTotalAssets
    account.save()
}

