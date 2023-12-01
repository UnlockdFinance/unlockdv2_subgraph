import {
    Collections as CollectionEvent,
} from "../../generated/allowedControllers/AllowedControllers"
import { getOrCreateCollection } from "../helpers/allowedControllers";

export function handleCollection(event: CollectionEvent): void {
    const collection = getOrCreateCollection(event.params.collections.toHexString())
    collection.isAllowed = event.params.isAllowed 
    collection.blockNumber = event.block.number
    collection.blockTimestamp = event.block.timestamp
    collection.transactionHash = event.transaction.hash

    collection.save()
}
