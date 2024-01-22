import {
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"

import {getAssetId, getOrCreateAsset, getOrCreateBorrow, getOrCreateLoan, getOrCreateRepay} from "../helpers/action"
import {ethereum, store, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {getTxnInputDataToDecode} from "../utils/dataToDecode";
import { LoanStatus } from "../utils/constants";
import { getOrCreateTotalCount } from "../helpers/totalCount";

export function handleBorrow(event: BorrowEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrow = getOrCreateBorrow(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())

    // BORROW 
    
    borrow.user = event.params.user
    borrow.loanId = event.params.loanId
    borrow.amount = event.params.amount
    borrow.totalAssets = event.params.totalAssets
    borrow.token = event.params.token
    
    borrow.blockNumber = event.block.number
    borrow.blockTimestamp = event.block.timestamp
    borrow.transactionHash = event.transaction.hash
    borrow.transactionInput = event.transaction.input

    // LOAN
    loan.id = event.params.loanId.toHexString()
    loan.user = event.params.user.toHexString()
    loan.status = BigInt.fromI32(LoanStatus.BORROWED)
    loan.amount = event.params.amount     
    loan.underlyingAsset = event.params.token
    
    if(event.params.totalAssets.gt(BigInt.fromI32(0))) {
        loan.totalAssets = event.params.totalAssets
    }
    
    // ASSETS
    const decoded = ethereum.decode('(address,uint256)[]', event.params.assets);
    const assets = decoded!.toTuple()[0].toArray()
    const totalCount = getOrCreateTotalCount()
    
    for (let index = 0; index < assets.length; index++) {
        const collection = assets[index].toTuple()[0].toAddress()
        const tokenId = assets[index].toTuple()[1].toBigInt()
        const id = getAssetId(collection, tokenId)
        const asset = getOrCreateAsset(id.toHexString())
        asset.collection = collection
        asset.tokenId = tokenId
        asset.loan = loan.id
        asset.borrow = borrow.id

        asset.save()
        totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
        loan.totalAssets = loan.totalAssets.plus(BigInt.fromI32(1))
    }

    totalCount.save()
    borrow.save()
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

