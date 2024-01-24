import {
    AddCollateral as AddCollateralEvent,
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"

import {getAssetId, getOrCreateAddCollateral, getOrCreateAsset, getOrCreateBorrow, getOrCreateLoan, getOrCreateRepay} from "../helpers/action"
import {ethereum, store, BigInt, Bytes, ByteArray} from "@graphprotocol/graph-ts";
import {getTxnInputDataToDecode} from "../utils/dataToDecode";
import { LoanStatus } from "../utils/constants";
import { getOrCreateTotalCount } from "../helpers/totalCount";
import { AddCollateral } from "../../generated/schema";

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

    borrow.save()
    
    // LOAN
    loan.id = event.params.loanId.toHexString()
    loan.user = event.params.user.toHexString()
    loan.status = BigInt.fromI32(LoanStatus.BORROWED)
    loan.amount = event.params.amount     
    loan.underlyingAsset = event.params.token
    
    if(event.params.totalAssets.gt(BigInt.fromI32(0))) {
        loan.totalAssets = loan.totalAssets.plus(event.params.totalAssets)
    }

    loan.save()

    // ACCOUNT
    const borrowed = account.amountBorrowed.plus(event.params.amount)
    const totalAssets = account.totalAssets.plus(loan.totalAssets)

    account.amountBorrowed = borrowed
    account.user = event.params.user
    account.totalAssets = totalAssets

    account.save()
}

export function handleAddCollateral(event: AddCollateralEvent): void {
    const assetId = event.params.assetId
    const addCollateral = getOrCreateAddCollateral(event.transaction.hash.toHexString())

    addCollateral.loanId = event.params.loanId
    addCollateral.collection = event.params.collection
    addCollateral.tokenId = event.params.tokenId

    addCollateral.blockNumber = event.block.number
    addCollateral.blockTimestamp = event.block.timestamp
    addCollateral.transactionHash = event.transaction.hash
    addCollateral.transactionInput = event.transaction.input

    addCollateral.save()

    const asset = getOrCreateAsset(assetId.toHexString())

    asset.collection = event.params.collection
    asset.tokenId = event.params.tokenId
    asset.isOnAuction = false
    asset.loan = event.params.loanId.toHexString()  
    asset.save()

    const totalCount = getOrCreateTotalCount()
    totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
    totalCount.save()
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

