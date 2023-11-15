import {
    MarketItems,
} from '../../generated/schema';

export function getOrCreateMarketOrder(
    id: String,
    createIfNotFound: boolean = true,
): MarketItems {
    // @ts-ignore: assign wrapper object to primitive
    let order = MarketItems.load(id);

    if (order == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        order = new MarketItems(id);
    }

    return order as MarketItems;
}