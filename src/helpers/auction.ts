import {
    AuctionBid,
    AuctionRedeem,
    AuctionFinalize
} from '../../generated/schema';

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
