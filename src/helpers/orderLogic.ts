import { Bytes, BigInt } from '@graphprotocol/graph-ts';
import {
    OrderCreated,
} from '../../generated/schema';
import { ZERO_ADDRESS } from '../utils/constants';

export function getOrCreateOrderCreated(
    id: String,
    createIfNotFound: boolean = true,
): OrderCreated {
    // @ts-ignore: assign wrapper object to primitive
    let created = OrderCreated.load(id);

    if (created == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        created = new OrderCreated(id);
        created.loanId = Bytes.fromHexString(ZERO_ADDRESS);
        created.owner = Bytes.fromHexString(ZERO_ADDRESS);
        created.orderId = Bytes.fromHexString(ZERO_ADDRESS);
        created.orderType = BigInt.fromI32(0);
    }

    return created as OrderCreated;
}