import {
    AddCollateral as AddCollateralEvent,
    Borrow as BorrowEvent,
    Repay as RepayEvent
} from "../../generated/action/Action"
import {getOrCreateAccount} from "../helpers/account"
import { getOrCreateAddCollateral, getOrCreateAsset, getOrCreateBorrow, getOrCreateLoan, getOrCreateRepay} from "../helpers/action"
import { store, BigInt } from "@graphprotocol/graph-ts";
import { LoanStatus } from "../utils/constants";
import { getOrCreateTotalCount } from "../helpers/totalCount";

export function handleBorrow(event: BorrowEvent): void {
    // Save into Contract Entity
    const borrow = getOrCreateBorrow(event.transaction.hash.toHexString())
    
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
    
    // Save into Private Entities
    // Borrow in an entry point to create a Loan
    // We need to create an Account and a Loan (the asset is not emmitted in the event)
    
    // LOAN
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    
    loan.id = event.params.loanId.toHexString()
    loan.user = event.params.user.toHexString()
    loan.status = BigInt.fromI32(LoanStatus.BORROWED)
    loan.amount = event.params.amount     
    loan.underlyingAsset = event.params.token
    loan.totalAssets = event.params.totalAssets
    loan.save()

    // ACCOUNT
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrowed = account.amountBorrowed.plus(event.params.amount)
    const totalAssets = account.totalAssets.plus(event.params.totalAssets)
    
    account.amountBorrowed = borrowed
    account.user = event.params.user
    account.totalAssets = totalAssets
    account.save()
}

export function handleAddCollateral(event: AddCollateralEvent): void {
    // Save into Contract Entity
    const addCollateral = getOrCreateAddCollateral(event.transaction.hash.toHexString())

    addCollateral.loanId = event.params.loanId
    addCollateral.collection = event.params.collection
    addCollateral.tokenId = event.params.tokenId
    addCollateral.assetId = event.params.assetId
    addCollateral.blockNumber = event.block.number
    addCollateral.blockTimestamp = event.block.timestamp
    addCollateral.transactionHash = event.transaction.hash
    addCollateral.transactionInput = event.transaction.input
    addCollateral.save()

    // Save into Private Entities
    // Create the asset and add it to the Loan
    const asset = getOrCreateAsset(event.params.assetId.toHexString())

    asset.collection = event.params.collection
    asset.tokenId = event.params.tokenId
    asset.isOnAuction = false
    asset.loan = event.params.loanId.toHexString()  
    asset.save()

    // Count the total number of assets
    const totalCount = getOrCreateTotalCount()
    totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
    totalCount.save()
}

export function handleRepay(event: RepayEvent): void {
    // Save into Contract Entity
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())
    
    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.assets = event.params.assets
    repay.totalAssets = event.params.totalAssets
    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash
    repay.transactionInput = event.transaction.input
    repay.save()

    // Save into Private Entities
    // the Loan should remove the assets that are not in use anymore
    // totalCount should decrease the counter per asset removed
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    const totalCount = getOrCreateTotalCount()
    
    let totalAssets = loan.totalAssets
    const assetsToRemove = totalAssets.minus(event.params.totalAssets)

    for (let index = 0; BigInt.fromI32(index) < assetsToRemove; index++) {
        const assetId = event.params.assets[index]
        store.remove('Asset', assetId.toHexString().toLowerCase())
        totalCount.totalCount = totalCount.totalCount.minus(BigInt.fromI32(1))
        totalAssets = totalAssets.minus(BigInt.fromI32(1))
    }

    totalCount.save()

    loan.amount = loan.amount.minus(repay.amount)
    loan.totalAssets = totalAssets
    loan.save() 

    if(totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrowedAmount = account.amountBorrowed.minus(repay.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(event.params.assets.length))

    account.amountBorrowed = borrowedAmount
    account.user = event.params.user
    account.totalAssets = newTotalAssets
    account.save()
}

