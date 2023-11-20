import {
    MarketCreated,
    Order
} from '../../generated/schema';
import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Market, Market__getOrderResultValue0Struct} from "../../generated/market/Market";
import { BIGINT_ZERO, UNLOCK_HELPER_ADDRESS, UNLOCK_MARKET_ADDRESS } from '../utils/constants';
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
        order.debtToSell = BIGINT_ZERO;
        order.startAmount = BIGINT_ZERO;
        order.endAmount = BIGINT_ZERO;
        order.startTime = BIGINT_ZERO;
        order.endTime = BIGINT_ZERO;
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