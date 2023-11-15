import {
    MarketCreated as MarketCreatedEvent,
  } from "../../generated/market/Market";
import { getOrCreateMarketOrder } from "../helpers/market";
  
export function handleMarketOrderCreated(event: MarketCreatedEvent): void {
  const order = getOrCreateMarketOrder(event.transaction.hash.toHexString())
  
  order.assetId = event.params.assetId
  order.orderId = event.params.orderId
  order.loanId = event.params.loanId
  order.collection = event.params.collection
  order.tokenId = event.params.tokenId

  order.save()
}

