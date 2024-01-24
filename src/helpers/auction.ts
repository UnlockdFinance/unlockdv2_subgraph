import { Bytes } from '@graphprotocol/graph-ts';
import {
    AuctionBid,
    AuctionRedeem,
    AuctionFinalize,
    AuctionOrderRedeemed,
} from '../../generated/schema';
import { Auction, Auction__getOrderAuctionResultValue0Struct } from '../../generated/auction/Auction';
import { UNLOCK_AUCTION_ADDRESS } from '../utils/constants';

export function getOrCreateAuctionOrderRedeemed(
    id: String,
    createIfNotFound: boolean = true,
): AuctionOrderRedeemed {
    // @ts-ignore: assign wrapper object to primitive
    let orderRedeemed = AuctionOrderRedeemed.load(id);

    if (orderRedeemed == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        orderRedeemed = new AuctionOrderRedeemed(id);
    }

    return orderRedeemed as AuctionOrderRedeemed;
}

export function getOrCreateAuctionBid(
    id: String,
    createIfNotFound: boolean = true,
): AuctionBid {
    // @ts-ignore: assign wrapper object to primitive
    let bid = AuctionBid.load(id);

    if (bid == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        bid = new AuctionBid(id);
    }

    return bid as AuctionBid;
}

export function getOrCreateAuctionRedeem(
    id: String,
    createIfNotFound: boolean = true,
): AuctionRedeem {
    // @ts-ignore: assign wrapper object to primitive
    let redeem = AuctionRedeem.load(id);

    if (redeem == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        redeem = new AuctionRedeem(id);
    }

    return redeem as AuctionRedeem;
}

export function getOrCreateAuctionFinalize(
    id: String,
    createIfNotFound: boolean = true,
): AuctionFinalize {
    // @ts-ignore: assign wrapper object to primitive
    let finalize = AuctionFinalize.load(id);

    if (finalize == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        finalize = new AuctionFinalize(id);
    }

    return finalize as AuctionFinalize;
}

export function getOrderAuction(
    orderId: Bytes
  ): Auction__getOrderAuctionResultValue0Struct {
    const contract = Auction.bind(UNLOCK_AUCTION_ADDRESS)
    const callResult = contract.try_getOrderAuction(orderId)
  
    return callResult.value
  }