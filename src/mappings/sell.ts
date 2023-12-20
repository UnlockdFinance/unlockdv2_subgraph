import {
    Sold as SoldEvent,
    ForceSold as ForceSoldEvent
} from "../../generated/sellNow/SellNow"
import {getOrCreateAccount} from "../helpers/account"
import {getOrCreateLoan} from "../helpers/action"
import {store, BigInt, log} from "@graphprotocol/graph-ts";
import { getOrCreateForceSell, getOrCreateSell } from "../helpers/sell";
import { LoanStatus } from "../utils/constants";

export function handleSold(event: SoldEvent): void {
    const sell = getOrCreateSell(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    const account = getOrCreateAccount(loan.user)

    sell.assetId = event.params.assetId
    sell.collection = event.params.collection
    sell.tokenId = event.params.tokenId
    sell.amount = event.params.amount
    
    sell.blockNumber = event.block.number
    sell.blockTimestamp = event.block.timestamp
    sell.transactionHash = event.transaction.hash
    sell.transactionInput = event.transaction.input
    sell.save()

    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())
    
    loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
    loan.amount = loan.amount.minus(event.params.amount)
    loan.save()

    if(loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    const borrowedAmount = account.amountBorrowed.minus(event.params.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(1))

    account.amountBorrowed = borrowedAmount
    account.totalAssets = newTotalAssets
    account.save()
}

export function handleForceSold(event: ForceSoldEvent): void {
    const forceSell = getOrCreateForceSell(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    const account = getOrCreateAccount(loan.user)

    forceSell.loanId = event.params.loanId
    forceSell.assetId = event.params.assetId
    forceSell.collection = event.params.collection
    forceSell.tokenId = event.params.tokenId
    forceSell.marketPrice = event.params.amount
    
    forceSell.blockNumber = event.block.number
    forceSell.blockTimestamp = event.block.timestamp
    forceSell.transactionHash = event.transaction.hash
    forceSell.transactionInput = event.transaction.input
    forceSell.save()

    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

    const blockNumber = event.block.number
    const oldBlockNumber = BigInt.fromI32(4912007)
    const newBlock = BigInt.fromI32(4912010)
    //const loanId = '0x6c25ff4f76c872af3decf033734ed79cf5309dbf67a60fef87eafb3d03ec09ab'
    if(blockNumber.gt(oldBlockNumber) && blockNumber.lt(newBlock)) {  
        store.remove('Loan', event.params.loanId.toHexString().toLowerCase())
        log.info('Loan removed {}', [event.params.loanId.toHexString()])
    }
    
    loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
    loan.amount = loan.amount.minus(event.params.amount)
    loan.save()

    if(loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    const borrowedAmount = account.amountBorrowed.minus(event.params.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(1))

    account.amountBorrowed = borrowedAmount
    account.totalAssets = newTotalAssets
    account.save()
}