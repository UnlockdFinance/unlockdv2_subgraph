import {
    AuctionBid as AuctionBidEvent,
    AuctionRedeem as AuctionRedeemEvent,
    AuctionFinalize as AuctionFinalizeEvent,
    Auction__getOrderAuctionResultValue0Struct,
  } from "../../generated/auction/Auction";
import { getOrCreateAsset, getOrCreateLoan } from "../helpers/action";
import { getOrCreateAuctionBid, getOrCreateAuctionFinalize, getOrCreateAuctionRedeem, getOrderAuction } from "../helpers/auction";
import { getOrCreateBid, getOrCreateOrder } from "../helpers/market";
import { getOrCreateLoanCreated } from "../helpers/orderLogic";
import { getOrCreateTotalCount } from "../helpers/totalCount";
import { LoanStatus, Market, OrderStatus, ZERO_ADDRESS } from "../utils/constants";
import { BigInt, Bytes, ethereum, store } from "@graphprotocol/graph-ts";
import { getTxnInputDataToDecode } from "../utils/dataToDecode";

export function handleAuctionBid(event: AuctionBidEvent): void {
    const auctionBid = getOrCreateAuctionBid(event.transaction.hash.toHexString())
    auctionBid.user = event.params.user
    auctionBid.loanId = event.params.loanId
    auctionBid.assetId = event.params.assetId
    auctionBid.orderId = event.params.orderId
    auctionBid.amount = event.params.amount
  
    auctionBid.blockNumber = event.block.number
    auctionBid.blockTimestamp = event.block.timestamp
    auctionBid.transactionHash = event.transaction.hash
    auctionBid.transactionInput = event.transaction.input
    auctionBid.save()
  
    const order = getOrCreateOrder(event.params.orderId.toHexString())
    const onchainOrder = getOrderAuction(event.params.orderId) as Auction__getOrderAuctionResultValue0Struct
    order.status = BigInt.fromI32(OrderStatus.ACTIVE)
    order.market = BigInt.fromI32(Market.AUCTION)
    order.orderType = onchainOrder.orderType.toString()
    order.lastBidder = order.bidder
    order.lastBidAmount = order.bidAmount
    order.bidder = event.params.user
    order.bidAmount = event.params.amount
    order.date = event.block.timestamp
    order.save()
    
    const bid = getOrCreateBid(event.transaction.hash.toHexString())
    bid.bidder = event.params.user
    bid.bidAmount = event.params.amount
    bid.order = order.id
    
    const dataToDecode = getTxnInputDataToDecode(event)
    const decoded = ethereum.decode('(uint128,uint128,SignAuction,EIP712Signature)', dataToDecode);
    const amountToPay = decoded!.toTuple()[0].toBigInt()
    const amountOfDebt = decoded!.toTuple()[1].toBigInt()
    bid.amountToPay = amountToPay
    bid.amountOfDebt = amountOfDebt
    bid.save()
    bid.save()

    const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
    if(loanCreated.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
      const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
      loan.status = BigInt.fromI32(LoanStatus.PENDING)
      loan.user = event.params.user.toHexString()
      loan.save()
    }
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
  order.date = event.block.timestamp
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
  order.date = event.block.timestamp
  order.buyer = event.params.winner
  order.buyerAmount = event.params.amount
  order.save()

  const asset = getOrCreateAsset(event.params.assetId.toHexString())
  store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

  const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
  if(loanCreated.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
    const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
    loan.status = BigInt.fromI32(LoanStatus.BORROWED)
    loan.save()
    asset.loan = loan.id
    asset.save()

    const totalCount = getOrCreateTotalCount()
    totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
    totalCount.save()

    loan.totalAssets = loan.totalAssets.plus(BigInt.fromI32(1))
    loan.save()
  } else { 
    store.remove('LoanCreated', event.transaction.hash.toHexString())
  }

  const loan = getOrCreateLoan(event.params.loanId.toHexString())
  loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
  loan.save()

  if(loan.totalAssets.equals(BigInt.fromI32(0))) {
    loan.status = BigInt.fromI32(LoanStatus.PAID)
    loan.save()
  }

  const totalCount = getOrCreateTotalCount()
  totalCount.totalCount = totalCount.totalCount.minus(BigInt.fromI32(1))
  totalCount.save()
}