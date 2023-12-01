import {
    MarketCreated,
    Order,
    MarketBid,
    MarketClaim,
    MarketBuyNow,
    Bid
} from '../../generated/schema';
import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Market, Market__getOrderResultValue0Struct} from "../../generated/market/Market";
import { BIGINT_ZERO, UNLOCK_HELPER_ADDRESS, UNLOCK_MARKET_ADDRESS, ZERO_ADDRESS } from '../utils/constants';
import { UnlockdHelper } from '../../generated/action/UnlockdHelper';

export function getOrCreateMarketCreated(
    id: String,
    createIfNotFound: boolean = true,
): MarketCreated {
    // @ts-ignore: assign wrapper object to primitive
    let order = MarketCreated.load(id);

    if (order == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        order = new MarketCreated(id);
        order.tokenId = BIGINT_ZERO;
    }

    return order as MarketCreated;
}

export function getOrCreateMarketBid(
    id: String,
    createIfNotFound: boolean = true,
): MarketBid {
    // @ts-ignore: assign wrapper object to primitive
    let bid = MarketBid.load(id);

    if (bid == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        bid = new MarketBid(id);
    }

    return bid as MarketBid;
}

export function getOrCreateMarketClaim(
    id: String,
    createIfNotFound: boolean = true,
): MarketClaim {
    // @ts-ignore: assign wrapper object to primitive
    let claim = MarketClaim.load(id);

    if (claim == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        claim = new MarketClaim(id);
    }

    return claim as MarketClaim;
}

export function getOrCreateMarketBuyNow(
    id: String,
    createIfNotFound: boolean = true,
): MarketBuyNow {
    // @ts-ignore: assign wrapper object to primitive
    let buyNow = MarketBuyNow.load(id);

    if (buyNow == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        buyNow = new MarketBuyNow(id);
    }

    return buyNow as MarketBuyNow;
}

export function getOrCreateBid(
    id: String,
    createIfNotFound: boolean = true,
): Bid {
    // @ts-ignore: assign wrapper object to primitive
    let bid = Bid.load(id);

    if (bid == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        bid = new Bid(id);
        bid.amountOfDebt = BIGINT_ZERO;
        bid.amountToPay = BIGINT_ZERO;
    }

    return bid as Bid;
}

export function getOrCreateOrder(
    id: String,
    createIfNotFound: boolean = true,
): Order {
    // @ts-ignore: assign wrapper object to primitive
    let order = Order.load(id);

    if (order == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        order = new Order(id);
        order.status = BIGINT_ZERO;
        order.market = BIGINT_ZERO;
        order.date = BIGINT_ZERO;
        order.debtToSell = BIGINT_ZERO;
        order.startAmount = BIGINT_ZERO;
        order.endAmount = BIGINT_ZERO;
        order.startTime = BIGINT_ZERO;
        order.endTime = BIGINT_ZERO;
        order.lastBidder = Bytes.fromHexString(ZERO_ADDRESS);
        order.lastBidAmount = BIGINT_ZERO;
        order.bidder = Bytes.fromHexString(ZERO_ADDRESS);
        order.bidAmount = BIGINT_ZERO;
        order.buyer = Bytes.fromHexString(ZERO_ADDRESS);
        order.buyerAmount = BIGINT_ZERO;
        order.assetId = Bytes.fromHexString(ZERO_ADDRESS);
        order.collection = Bytes.fromHexString(ZERO_ADDRESS);
        order.tokenId = BIGINT_ZERO;
    }

    return order as Order;
}

export function getOrder(
    orderId: Bytes
): Market__getOrderResultValue0Struct {
    const contract = Market.bind(UNLOCK_MARKET_ADDRESS)
    const callResult = contract.try_getOrder(orderId)

    return callResult.value
}

export function getOrderId(
    assetId: Bytes,
    loanId: Bytes
): Bytes {
    const contract = UnlockdHelper.bind(UNLOCK_HELPER_ADDRESS)
    const callResult = contract.try_getOrderId(assetId, loanId)

    return callResult.value
}