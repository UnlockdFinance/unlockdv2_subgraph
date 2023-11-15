import {
    MarketCreated as MarketCreatedEvent, 
    Market__getOrderResultValue0Struct,
    MarketCancelAuction as MarketCancelEvent
  } from "../../generated/market/Market";
import { getOrCreateMarketCreated, getOrCreateOrder, getOrder } from "../helpers/market";
  
export function handleMarketCreated(event: MarketCreatedEvent): void {
  const marketCreated = getOrCreateMarketCreated(event.transaction.hash.toHexString())
  marketCreated.loanId = event.params.loanId
  marketCreated.assetId = event.params.assetId
  marketCreated.orderId = event.params.orderId
  marketCreated.collection = event.params.collection
  marketCreated.tokenId = event.params.tokenId
  marketCreated.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  const onchainOrder = getOrder(event.params.orderId) as Market__getOrderResultValue0Struct
  order.status = "ACTIVE"
  order.orderType = onchainOrder.orderType.toString()
  order.assetId = event.params.assetId
  order.seller = onchainOrder.owner
  order.loanId = event.params.loanId
  order.debtToSell = onchainOrder.offer.debtToSell
  order.startAmount = onchainOrder.offer.startAmount
  order.endAmount = onchainOrder.offer.endAmount
  order.startTime = onchainOrder.timeframe.startTime
  order.endTime = onchainOrder.timeframe.endTime
  order.collection = event.params.collection
  order.tokenId = event.params.tokenId
  order.save()
}

export function handleMarketCancel(event: MarketCancelEvent): void {
  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = "CANCELLED"
  order.save()
  
}

