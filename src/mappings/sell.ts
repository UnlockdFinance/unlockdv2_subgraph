import {
    Sold as SoldEvent,
} from "../../generated/sellNow/SellNow"
import {getOrCreateAccount} from "../helpers/account"
import {getOrCreateLoan} from "../helpers/action"
import {store, BigInt} from "@graphprotocol/graph-ts";
import { getOrCreateSell } from "../helpers/sell";
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