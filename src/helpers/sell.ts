import {
    Sold,
    ForceSold
} from '../../generated/schema';
import {BIGINT_ZERO} from "../utils/constants";

export function getOrCreateSell(
    id: String,
    createIfNotFound: boolean = true,
): Sold {
    // @ts-ignore: assign wrapper object to primitive
    let sell = Sold.load(id);

    if (sell == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        sell = new Sold(id);
        sell.tokenId = BIGINT_ZERO;
    }

    return sell as Sold;
}

export function getOrCreateForceSell(
    id: String,
    createIfNotFound: boolean = true,
): ForceSold {
    // @ts-ignore: assign wrapper object to primitive
    let forceSell = ForceSold.load(id);

    if (forceSell == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        forceSell = new ForceSold(id);
        forceSell.tokenId = BIGINT_ZERO;
        forceSell.marketPrice = BIGINT_ZERO;
    }

    return forceSell as ForceSold;
}