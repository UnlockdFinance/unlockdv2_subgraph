import {
    Sold as SoldEvent,
} from "../../generated/sellNow/SellNow"
import {getOrCreateAccount} from "../helpers/account"
import {getOrCreateBorrow, getOrCreateLoan} from "../helpers/action"
import {store, BigInt} from "@graphprotocol/graph-ts";
import { getOrCreateSell } from "../helpers/sell";
import { getOrCreateOrder, getOrderId } from "../helpers/market";
import { OrderStatus } from "../utils/constants";

export function handleSold(event: SoldEvent): void {
    const sell = getOrCreateSell(event.transaction.hash.toHexString())
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    const account = getOrCreateAccount(loan.user)
    const orderId = getOrderId(event.params.assetId, event.params.loanId)
    const order = getOrCreateOrder(orderId.toHexString())

    sell.assetId = event.params.assetId
    sell.collection = event.params.collection
    sell.tokenId = event.params.tokenId
    sell.amount = event.params.amount
    sell.save()

    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())
    
    if (order) {
        order.status = BigInt.fromI32(OrderStatus.SOLD)
        order.save()
    }
    
    loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
    loan.amount = loan.amount.minus(event.params.amount)
    loan.save()

    const borrowedAmount = account.amountBorrowed.minus(event.params.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(1))

    account.amountBorrowed = borrowedAmount
    account.totalAssets = newTotalAssets
    account.save()
}