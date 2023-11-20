import {
    Sold,
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