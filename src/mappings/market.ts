import {
    MarketCreated as MarketCreatedEvent,
    Market__getOrderResultValue0Struct,
    MarketCancelAuction as MarketCancelEvent,
    MarketBid as MarketBidEvent,
    MarketClaim as MarketClaimEvent,
    MarketBuyNow as MarketBuyNowEvent
} from "../../generated/market/Market";
import {
    getOrCreateBid,
    getOrCreateMarketBid,
    getOrCreateMarketBuyNow,
    getOrCreateMarketClaim,
    getOrCreateMarketCreated,
    getOrCreateOrder,
    getOrder,
    getOrCreateBuyer
} from "../helpers/market";
import { LoanStatus, OrderStatus, ZERO_ADDRESS } from "../utils/constants";
import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";
import { getOrCreateAsset, getOrCreateLoan } from "../helpers/action";
import { getOrCreateOrderCreated } from "../helpers/orderLogic";
import { getOrCreateTotalCount } from "../helpers/totalCount";
import { getOrCreateLoanCreated } from "../helpers/loanCreated";
import { getOrCreateAccount } from "../helpers/account";

export function handleMarketCreated(event: MarketCreatedEvent): void {
    // Save into Contract Entity
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

    // Save into Private Entities
    const order = getOrCreateOrder(event.params.orderId.toHexString())
    const asset = getOrCreateAsset(event.params.assetId.toHexString())
    // Query onchain the created order
    const onchainOrder = getOrder(event.params.orderId) as Market__getOrderResultValue0Struct

    // Create Order for front-end. If the order is created by the contract, the orderType is 0
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

    const orderCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
    if (onchainOrder.owner == Bytes.fromHexString(ZERO_ADDRESS)) {
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
    // Save into Contract Entity
    const marketBid = getOrCreateMarketBid(event.transaction.hash.toHexString())

    marketBid.loanId = event.params.loanId
    marketBid.orderId = event.params.orderId
    marketBid.assetId = event.params.assetId
    marketBid.amountToPay = event.params.amountToPay
    marketBid.amountOfDebt = event.params.amountOfDebt
    marketBid.amount = event.params.amount
    marketBid.user = event.params.user
    marketBid.blockNumber = event.block.number
    marketBid.blockTimestamp = event.block.timestamp
    marketBid.transactionHash = event.transaction.hash
    marketBid.transactionInput = event.transaction.input
    marketBid.save()

    // Save into Private Entities
    // Update the order: lastBidder, lastBidAmount, bidder, bidAmount
    const order = getOrCreateOrder(event.params.orderId.toHexString())
    order.lastBidder = order.bidder
    order.lastBidAmount = order.bidAmount
    order.bidder = event.params.user
    order.bidAmount = event.params.amount
    order.save()

    // Create the bid
    const bid = getOrCreateBid(event.transaction.hash.toHexString())
    bid.bidder = event.params.user
    bid.bidAmount = event.params.amount
    bid.order = order.id
    bid.amountToPay = event.params.amountToPay
    bid.amountOfDebt = event.params.amountOfDebt
    bid.save()

    // if the debt is greater than 0, create a loan
    if (event.params.amountOfDebt.gt(BigInt.fromI32(0))) {
        // make this loan pending till the claim event
        // status Pending
        const loan = getOrCreateLoan(event.params.loanId.toHexString())
        loan.status = BigInt.fromI32(LoanStatus.PENDING)
        loan.user = event.params.user.toHexString()
        loan.amount = event.params.amountOfDebt
        loan.save()

        // Update the account created for the new user
        const account = getOrCreateAccount(event.params.user.toHexString())
        account.amountBorrowed = account.amountBorrowed.plus(event.params.amountOfDebt)
        account.save()

        // Create the buyer
        const buyerId = event.params.assetId.toHexString().concat(event.params.user.toHexString())
        const buyer = getOrCreateBuyer(buyerId)
        buyer.user = event.params.user
        buyer.loanId = event.params.loanId
        buyer.assetId = event.params.assetId
        buyer.orderId = event.params.orderId
        buyer.save()
    }
}

export function handleMarketClaim(event: MarketClaimEvent): void {
    // Save into Contract Entity
    const marketClaim = getOrCreateMarketClaim(event.transaction.hash.toHexString())

    marketClaim.loanId = event.params.loanId
    marketClaim.assetId = event.params.assetId
    marketClaim.orderId = event.params.orderId
    marketClaim.amount = event.params.amount
    marketClaim.bidder = event.params.bidder
    marketClaim.receiver = event.params.receiver
    marketClaim.user = event.params.user
    marketClaim.blockNumber = event.block.number
    marketClaim.blockTimestamp = event.block.timestamp
    marketClaim.transactionHash = event.transaction.hash
    marketClaim.transactionInput = event.transaction.input
    marketClaim.save()

    // Save into Private Entities
    // Update the order: status, bidder, bidAmount
    const order = getOrCreateOrder(event.params.orderId.toHexString())
    order.status = BigInt.fromI32(OrderStatus.CLAIMED)
    order.date = event.block.timestamp
    order.lastBidder = order.bidder
    order.lastBidAmount = order.bidAmount
    order.bidder = event.params.user
    order.bidAmount = event.params.amount
    order.save()

    // store the asset, remove it from the actual loan
    const asset = getOrCreateAsset(event.params.assetId.toHexString())
    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

    // get the buyer create on the bid event
    const buyerId = event.params.assetId.toHexString().concat(event.params.bidder.toHexString())
    const buyer = getOrCreateBuyer(buyerId)

    // if theres a valid loan id for the buyer
    // we update the loan status to borrowed
    // we add the stored asset to the new loan
    if (buyer.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
        const loan = getOrCreateLoan(buyer.loanId.toHexString())
        loan.status = BigInt.fromI32(LoanStatus.BORROWED)
        loan.save()
        asset.loan = loan.id
        asset.save()

        // update the total count
        const totalCount = getOrCreateTotalCount()
        totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
        totalCount.save()

        // remove the history of the buyer
        store.remove('Buyer', buyerId)
    } else {
        store.remove('Buyer', buyerId)
    }

    // read existing loan and reduces the total assets by 1
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
    loan.save()

    // if the loan has no more assets, change the status to paid
    if (loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    // update the total count removing 1 asset
    const totalCount = getOrCreateTotalCount()
    totalCount.totalCount = totalCount.totalCount.minus(BigInt.fromI32(1))
    totalCount.save()
}

export function handleMarketBuyNow(event: MarketBuyNowEvent): void {
    const marketBuyNow = getOrCreateMarketBuyNow(event.transaction.hash.toHexString())
    marketBuyNow.loanId = event.params.loanId
    marketBuyNow.assetId = event.params.assetId
    marketBuyNow.orderId = event.params.orderId
    marketBuyNow.amount = event.params.amount
    marketBuyNow.user = event.params.user

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

    const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
    if (loanCreated.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
        const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
        loan.status = BigInt.fromI32(LoanStatus.BORROWED)
        loan.save()
        asset.loan = loanCreated.loanId.toHexString()
        asset.save()

        const totalCount = getOrCreateTotalCount()
        totalCount.totalCount = totalCount.totalCount.plus(BigInt.fromI32(1))
        totalCount.save()

        loan.totalAssets = BigInt.fromI32(1)
        loan.save()
    } else {
        store.remove('LoanCreated', event.transaction.hash.toHexString())
    }

    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.totalAssets = loan.totalAssets.minus(BigInt.fromI32(1))
    loan.save()

    if (loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.save()
    }

    const totalCount = getOrCreateTotalCount()
    totalCount.totalCount = totalCount.totalCount.minus(BigInt.fromI32(1))
    totalCount.save()
}
