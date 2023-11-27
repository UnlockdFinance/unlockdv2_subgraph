import { Bytes, BigInt } from '@graphprotocol/graph-ts';
import {
    LoanCreated,
} from '../../generated/schema';
import { ZERO_ADDRESS } from '../utils/constants';

export function getOrCreateLoanCreated(
    id: String,
    createIfNotFound: boolean = true,
): LoanCreated {
    // @ts-ignore: assign wrapper object to primitive
    let created = LoanCreated.load(id);

    if (created == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        created = new LoanCreated(id);
        created.loanId = Bytes.fromHexString(ZERO_ADDRESS);
        created.user = Bytes.fromHexString(ZERO_ADDRESS);
        created.totalAssets = BigInt.fromI32(0);
    }

    return created as LoanCreated;
}