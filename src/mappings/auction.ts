import {
    AuctionBid as AuctionBidEvent,
    AuctionRedeem as AuctionRedeemEvent,
    AuctionFinalize as AuctionFinalizeEvent,
    AuctionOrderRedeemed as AuctionOrderRedeemedEvent,
} from "../../generated/auction/Auction";
import { Action__getLoanResultValue0Struct } from "../../generated/action/Action";
import { getOrCreateAsset, getOrCreateLoan, getLoan } from "../helpers/action";
import { getOrCreateAuctionBid, getOrCreateAuctionFinalize, getOrCreateAuctionOrderRedeemed, getOrCreateAuctionRedeem, getOrderAuction } from "../helpers/auction";
import { getOrCreateLoanCreated } from "../helpers/loanCreated";
import { getOrCreateBid, getOrCreateOrder, getOrCreateBuyer } from "../helpers/market";
import { getOrCreateOrderCreated } from "../helpers/orderLogic";
import { getOrCreateTotalCount } from "../helpers/totalCount";
import { getOrCreateAccount } from "../helpers/account";
import { LoanStatus, OrderStatus, ZERO_ADDRESS } from "../utils/constants";
import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";

export function handleAuctionBid(event: AuctionBidEvent): void {
    const auctionBid = getOrCreateAuctionBid(event.transaction.hash.toHexString())

    auctionBid.loanId = event.params.loanId
    auctionBid.orderId = event.params.orderId
    auctionBid.assetId = event.params.assetId
    auctionBid.amountToPay = event.params.amountToPay
    auctionBid.amountOfDebt = event.params.amountOfDebt
    auctionBid.user = event.params.user

    auctionBid.blockNumber = event.block.number
    auctionBid.blockTimestamp = event.block.timestamp
    auctionBid.transactionHash = event.transaction.hash
    auctionBid.transactionInput = event.transaction.input
    auctionBid.save()

    const order = getOrCreateOrder(event.params.orderId.toHexString())
    const onchainOrder = getOrderAuction(event.params.orderId)
    const asset = getOrCreateAsset(event.params.assetId.toHexString())
    asset.isOnAuction = true
    asset.orderId = event.params.orderId
    asset.save()

    // end time from function
    order.status = BigInt.fromI32(OrderStatus.ACTIVE)
    order.date = event.block.timestamp
    order.orderType = "0"
    order.assetId = event.params.assetId
    order.collection = asset.collection
    order.tokenId = asset.tokenId
    order.seller = onchainOrder.owner
    order.loanId = onchainOrder.offer.loanId
    order.lastBidder = order.bidder
    order.lastBidAmount = order.bidAmount
    order.bidder = onchainOrder.bid.buyer
    order.bidAmount = event.params.amountToPay.plus(event.params.amountOfDebt)
    order.loan = onchainOrder.offer.loanId.toHexString()
    order.endTime = onchainOrder.timeframe.endTime

    const loan = getOrCreateLoan(onchainOrder.offer.loanId.toHexString())
    loan.isFrozen = true
    loan.save()

    order.loanStatus = loan.status
    order.save()

    const bid = getOrCreateBid(event.transaction.hash.toHexString())
    bid.bidder = event.params.user
    bid.bidAmount = event.params.amountToPay.plus(event.params.amountOfDebt)
    bid.order = order.id
    bid.amountToPay = event.params.amountToPay
    bid.amountOfDebt = event.params.amountOfDebt
    bid.save()
    
    
    const buyerId = event.params.assetId.toHexString().concat(event.params.user.toHexString())
    const buyer = getOrCreateBuyer(buyerId)
    
    if(event.params.amountOfDebt.gt(BigInt.fromI32(0))) {
      const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
      const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
      loan.status = BigInt.fromI32(LoanStatus.PENDING)
      loan.user = event.params.user.toHexString()
      loan.save()

      // Update the account created for the new user
      const account = getOrCreateAccount(event.params.user.toHexString())
      account.amountBorrowed = account.amountBorrowed.plus(event.params.amountOfDebt)
      account.save()
      
      // Buyer
      buyer.user = event.params.user
      buyer.loanId = loanCreated.loanId
      buyer.assetId = event.params.assetId
      buyer.orderId = event.params.orderId
      buyer.save()  
    } else {
      store.remove('Buyer', buyerId)
    }
}

export function handleAuctionRedeem(event: AuctionRedeemEvent): void {
    const redeem = getOrCreateAuctionRedeem(event.transaction.hash.toHexString())
    redeem.user = event.params.user
    redeem.loanId = event.params.loanId
    redeem.amount = event.params.amount

    redeem.blockNumber = event.block.number
    redeem.blockTimestamp = event.block.timestamp
    redeem.transactionHash = event.transaction.hash
    redeem.transactionInput = event.transaction.input
    redeem.save()

    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.isFrozen = false
    loan.save()
}

export function handleAuctionOrderRedeemed(event: AuctionOrderRedeemedEvent): void {
    const orderRedeemed = getOrCreateAuctionOrderRedeemed(event.transaction.hash.toHexString())
    orderRedeemed.loanId = event.params.loanId
    orderRedeemed.orderId = event.params.orderId
    orderRedeemed.amountOfDebt = event.params.amountOfDebt
    orderRedeemed.amountToPay = event.params.amountToPay
    orderRedeemed.bonus = event.params.bonus
    orderRedeemed.countBids = event.params.countBids

    orderRedeemed.blockNumber = event.block.number
    orderRedeemed.blockTimestamp = event.block.timestamp
    orderRedeemed.transactionHash = event.transaction.hash
    orderRedeemed.transactionInput = event.transaction.input
    orderRedeemed.save()

    const order = getOrCreateOrder(event.params.orderId.toHexString())
    order.status = BigInt.fromI32(OrderStatus.REDEEMED)
    order.date = event.block.timestamp
    order.save()

    const asset = getOrCreateAsset(order.assetId.toHexString())
    asset.isOnAuction = false
    asset.orderId = Bytes.fromHexString(ZERO_ADDRESS)
    asset.save()
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
    order.loanStatus = BigInt.fromI32(LoanStatus.PAID)
    order.date = event.block.timestamp
    order.buyer = event.params.winner
    order.buyerAmount = event.params.amount
    order.transactionHash = event.transaction.hash
    order.save()

    const asset = getOrCreateAsset(event.params.assetId.toHexString())
    store.remove('Asset', event.params.assetId.toHexString().toLowerCase())

    const loanCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
    if (loanCreated.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
        const loan = getOrCreateLoan(loanCreated.loanId.toHexString())
        loan.status = BigInt.fromI32(LoanStatus.BORROWED)
        loan.save()
        asset.loan = loan.id
        asset.orderId = Bytes.fromHexString(ZERO_ADDRESS)
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

    const cLoan = getLoan(event.params.loanId) as Action__getLoanResultValue0Struct
    if (cLoan.state != 2) {
        loan.isFrozen = false
    }
    loan.save()

    if (loan.totalAssets.equals(BigInt.fromI32(0))) {
        loan.status = BigInt.fromI32(LoanStatus.PAID)
        loan.isFrozen = false
        loan.save()
    }

    // get the buyer create on the bid event
    const buyerId = event.params.assetId.toHexString().concat(event.params.winner.toHexString())
    const buyer = getOrCreateBuyer(buyerId)

    // if theres a valid loan id for the buyer
    // we update the loan status to borrowed
    // we add the stored asset to the new loan
    if (buyer.loanId != Bytes.fromHexString(ZERO_ADDRESS)) {
        const loan = getOrCreateLoan(buyer.loanId.toHexString())
        loan.status = BigInt.fromI32(LoanStatus.BORROWED)
        loan.save()
        asset.loan = loan.id
        asset.orderId = Bytes.fromHexString(ZERO_ADDRESS)
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
}
