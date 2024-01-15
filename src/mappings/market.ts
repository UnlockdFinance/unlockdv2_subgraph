import {
    MarketCreated as MarketCreatedEvent, 
    Market__getOrderResultValue0Struct,
    MarketCancelAuction as MarketCancelEvent,
    MarketBid as MarketBidEvent,
    MarketClaim as MarketClaimEvent,
    MarketBuyNow as MarketBuyNowEvent
  } from "../../generated/market/Market";
import { getOrCreateBid, getOrCreateMarketBid, getOrCreateMarketBuyNow, getOrCreateMarketClaim, getOrCreateMarketCreated, getOrCreateOrder, getOrder } from "../helpers/market";
import { LoanStatus, OrderStatus, ZERO_ADDRESS } from "../utils/constants";
import {BigInt, Bytes, ethereum, store, log} from "@graphprotocol/graph-ts";
import { getTxnInputDataToDecode } from "../utils/dataToDecode";
import { getOrCreateAsset, getOrCreateLoan } from "../helpers/action";
import { getOrCreateOrderCreated } from "../helpers/orderLogic";
import { getOrCreateSetLoanId } from "../helpers/protocolOwner";
import { getOrCreateTotalCount } from "../helpers/totalCount";
  
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
  const orderCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
  const asset = getOrCreateAsset(event.params.assetId.toHexString())

  order.status = BigInt.fromI32(OrderStatus.ACTIVE)
  order.date = event.block.timestamp
  order.assetId = event.params.assetId
  order.collection = asset.collection
  order.tokenId = asset.tokenId
  order.loanId = event.params.loanId
  order.seller = onchainOrder.owner

  order.orderType = onchainOrder.orderType.toString()
  order.debtToSell = onchainOrder.offer.debtToSell
  order.startAmount = onchainOrder.offer.startAmount
  order.endAmount = onchainOrder.offer.endAmount
  order.startTime = onchainOrder.timeframe.startTime
  order.endTime = onchainOrder.timeframe.endTime
  order.loan = event.params.loanId.toHexString()

  if(onchainOrder.owner == Bytes.fromHexString(ZERO_ADDRESS)) {
    order.orderType = orderCreated.orderType.toString()
  }

  order.save()
}

export function handleMarketCancel(event: MarketCancelEvent): void {
  const order = getOrCreateOrder(event.params.orderId.toHexString())
  order.status = BigInt.fromI32(OrderStatus.CANCELLED)
  order.date = event.block.timestamp
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

  const bid = getOrCreateBid(event.transaction.hash.toHexString())
  bid.bidder = event.params.user
  bid.bidAmount = event.params.amount
  bid.order = order.id
  
  const dataToDecode = getTxnInputDataToDecode(event)
  const decoded = ethereum.decode('(bytes32,uint128,uint128,SignMarket,EIP712Signature)', dataToDecode);
  const amountToPay = decoded!.toTuple()[1].toBigInt()
  const amountOfDebt = decoded!.toTuple()[2].toBigInt()
  bid.amountToPay = amountToPay
  bid.amountOfDebt = amountOfDebt
  bid.save()

  //status from 0 to 1
  const loanCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
  if(loanCreated.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
    const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
    loan.status = BigInt.fromI32(LoanStatus.PENDING)
    loan.user = event.params.user.toHexString()
    loan.amount = amountOfDebt
    loan.save()
  }
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
  order.date = event.block.timestamp
  order.lastBidder = order.bidder
  order.lastBidAmount = order.bidAmount
  order.bidder = event.params.user
  order.bidAmount = event.params.amount
  order.save()

  // status from 1 to 0
  const asset = getOrCreateAsset(event.params.assetId.toHexString())
  store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

  const setLoanId = getOrCreateSetLoanId(event.transaction.hash.toHexString())

  if(setLoanId.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
    const loan = getOrCreateLoan(setLoanId.loanId.toHexString())
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
    store.remove('OrderCreated', event.transaction.hash.toHexString())
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

export function handleMarketBuyNow(event: MarketBuyNowEvent): void {
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
  order.date = event.block.timestamp
  order.buyer = event.params.user
  order.buyerAmount = event.params.amount
  order.save()

  const asset = getOrCreateAsset(event.params.assetId.toHexString())
  store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

  const loanCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
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
    store.remove('OrderCreated', event.transaction.hash.toHexString())
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
