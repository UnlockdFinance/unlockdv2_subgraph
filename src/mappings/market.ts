import {
    MarketCreated as MarketCreatedEvent, 
    Market__getOrderResultValue0Struct,
    MarketCancelAuction as MarketCancelEvent,
    MarketBid as MarketBidEvent,
    MarketClaim as MarketClaimEvent,
  } from "../../generated/market/Market";
import { getOrCreateMarketBid, getOrCreateMarketBuyNow, getOrCreateMarketClaim, getOrCreateMarketCreated, getOrCreateOrder, getOrder } from "../helpers/market";
import { Market, OrderStatus, ZERO_ADDRESS } from "../utils/constants";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";
  
export function handleMarketCreated(event: MarketCreatedEvent): void {
  const marketCreated = getOrCreateMarketCreated(event.transaction.hash.toHexString())
  marketCreated.loanId = event.params.loanId
  marketCreated.assetId = event.params.assetId
  marketCreated.orderId = event.params.orderId
  marketCreated.collection = event.params.collection
  marketCreated.tokenId = event.params.tokenId

  marketCreated.blockNumber = event.block.number
  marketCreated.blockTimestamp = event.block.timestamp
  marketCreated.transactionHash = event.transaction.hash
  marketCreated.transactionInput = event.transaction.input
  marketCreated.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  const onchainOrder = getOrder(event.params.orderId) as Market__getOrderResultValue0Struct
  
  order.status = BigInt.fromI32(OrderStatus.ACTIVE)
  order.market = BigInt.fromI32(Market.DEBT)
  order.orderType = onchainOrder.orderType.toString()
  order.asset = event.params.assetId.toHexString()
  order.seller = onchainOrder.owner
  order.loanId = event.params.loanId
  order.debtToSell = onchainOrder.offer.debtToSell
  order.startAmount = onchainOrder.offer.startAmount
  order.endAmount = onchainOrder.offer.endAmount
  order.startTime = onchainOrder.timeframe.startTime
  order.endTime = onchainOrder.timeframe.endTime
  order.save()
}

export function handleMarketCancel(event: MarketCancelEvent): void {
  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.CANCELLED)
  order.save()
}

export function handleMarketBid(event: MarketBidEvent): void {
  const marketBid = getOrCreateMarketBid(event.transaction.hash.toHexString())
  marketBid.user = event.params.user
  marketBid.loanId = event.params.loanId
  marketBid.assetId = event.params.assetId
  marketBid.orderId = event.params.orderId
  marketBid.amount = event.params.amount

  marketBid.blockNumber = event.block.number
  marketBid.blockTimestamp = event.block.timestamp
  marketBid.transactionHash = event.transaction.hash
  marketBid.transactionInput = event.transaction.input
  marketBid.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.lastBidder = order.bidder
  order.lastBidAmount = order.bidAmount
  order.bidder = event.params.user
  order.bidAmount = event.params.amount
  order.save()
}

export function handleMarketClaim(event: MarketClaimEvent): void {
  const marketClaim = getOrCreateMarketClaim(event.transaction.hash.toHexString())
  marketClaim.user = event.params.user
  marketClaim.loanId = event.params.loanId
  marketClaim.assetId = event.params.assetId
  marketClaim.orderId = event.params.orderId
  marketClaim.amount = event.params.amount

  marketClaim.blockNumber = event.block.number
  marketClaim.blockTimestamp = event.block.timestamp
  marketClaim.transactionHash = event.transaction.hash
  marketClaim.transactionInput = event.transaction.input
  marketClaim.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.CLAIMED)
  order.lastBidder = order.bidder
  order.lastBidAmount = order.bidAmount
  order.bidder = event.params.user
  order.bidAmount = event.params.amount
  order.save()
}

export function handleMarketBuyNow(event: MarketClaimEvent): void {
  const marketBuyNow = getOrCreateMarketBuyNow(event.transaction.hash.toHexString())
  marketBuyNow.user = event.params.user
  marketBuyNow.loanId = event.params.loanId
  marketBuyNow.assetId = event.params.assetId
  marketBuyNow.orderId = event.params.orderId
  marketBuyNow.amount = event.params.amount

  marketBuyNow.blockNumber = event.block.number
  marketBuyNow.blockTimestamp = event.block.timestamp
  marketBuyNow.transactionHash = event.transaction.hash
  marketBuyNow.transactionInput = event.transaction.input
  marketBuyNow.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.BOUGHT)
  order.buyer = event.params.user
  order.buyerAmount = event.params.amount
  order.save()
}

