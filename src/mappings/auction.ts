import {
    AuctionBid as AuctionBidEvent,
    AuctionRedeem as AuctionRedeemEvent,
    AuctionFinalize as AuctionFinalizeEvent,
  } from "../../generated/auction/Auction";
import { Market__getOrderResultValue0Struct } from "../../generated/market/Market";
import { getOrCreateAuctionBid, getOrCreateAuctionFinalize, getOrCreateAuctionRedeem } from "../helpers/auction";
import { getOrCreateOrder, getOrder } from "../helpers/market";
import { Market, OrderStatus } from "../utils/constants";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAuctionBid(event: AuctionBidEvent): void {
    const bid = getOrCreateAuctionBid(event.transaction.hash.toHexString())
    bid.user = event.params.user
    bid.loanId = event.params.loanId
    bid.assetId = event.params.assetId
    bid.orderId = event.params.orderId
    bid.amount = event.params.amount
  
    bid.blockNumber = event.block.number
    bid.blockTimestamp = event.block.timestamp
    bid.transactionHash = event.transaction.hash
    bid.transactionInput = event.transaction.input
    bid.save()
  
    const order = getOrCreateOrder(event.params.orderId.toHexString())
    const onchainOrder = getOrder(event.params.orderId) as Market__getOrderResultValue0Struct
    
    order.status = BigInt.fromI32(OrderStatus.ACTIVE)
    order.market = BigInt.fromI32(Market.AUCTION)
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

export function handleAuctionRedeem(event: AuctionRedeemEvent): void {
  const redeem = getOrCreateAuctionRedeem(event.transaction.hash.toHexString())
  redeem.user = event.params.user
  redeem.loanId = event.params.loanId
  redeem.assetId = event.params.assetId
  redeem.orderId = event.params.orderId
  redeem.amount = event.params.amount

  redeem.blockNumber = event.block.number
  redeem.blockTimestamp = event.block.timestamp
  redeem.transactionHash = event.transaction.hash
  redeem.transactionInput = event.transaction.input
  redeem.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.REDEEMED)
  order.save()
}

export function handleAuctionFinalize(event: AuctionFinalizeEvent): void {
  const finalize = getOrCreateAuctionFinalize(event.transaction.hash.toHexString())
  finalize.owner = event.params.owner
  finalize.loanId = event.params.loanId
  finalize.assetId = event.params.assetId
  finalize.orderId = event.params.orderId
  finalize.amount = event.params.amount
  finalize.winner = event.params.winner
  finalize.debtAmount = event.params.debtAmount

  finalize.blockNumber = event.block.number
  finalize.blockTimestamp = event.block.timestamp
  finalize.transactionHash = event.transaction.hash
  finalize.transactionInput = event.transaction.input
  finalize.save()

  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.CLAIMED)
  order.buyer = event.params.winner
  order.buyerAmount = event.params.amount
  order.save()
}