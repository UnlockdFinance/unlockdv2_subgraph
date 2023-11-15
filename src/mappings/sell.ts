import {
    Sold as SoldEvent,
} from "../../generated/sellNow/SellNow"
import {getOrCreateAccount} from "../helpers/account"
import {getOrCreateBorrow} from "../helpers/action"
import {store, BigInt} from "@graphprotocol/graph-ts";
import { getOrCreateSell } from "../helpers/sell";
import { getOrCreateMarketOrder } from "../helpers/market";

export function handleSold(event: SoldEvent): void {
    const sell = getOrCreateSell(event.transaction.hash.toHexString())
    const borrow = getOrCreateBorrow(event.params.loanId.toHexString())
    const account = getOrCreateAccount(borrow.user)
    //const marketItems = getOrCreateMarketOrder(event.params.assetId.toHexString())

    sell.assetId = event.params.assetId
    sell.collection = event.params.collection
    sell.tokenId = event.params.tokenId
    sell.amount = event.params.amount
    sell.save()

    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())
    
    // if (marketItems) {
    //     store.remove('MarketItems', event.params.assetId.toHexString().toLowerCase())
    // }
    
    borrow.totalAssets = borrow.totalAssets.minus(BigInt.fromI32(1))
    borrow.amount = borrow.amount.minus(event.params.amount)
    borrow.save()

    const borrowedAmount = account.amountBorrowed.minus(event.params.amount)
    const newTotalAssets = account.totalAssets.minus(BigInt.fromI32(1))

    account.amountBorrowed = borrowedAmount
    account.totalAssets = newTotalAssets
    account.save()
}