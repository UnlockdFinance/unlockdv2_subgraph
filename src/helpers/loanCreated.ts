import {
    LoanCreated,
} from '../../generated/schema';
import {Bytes} from "@graphprotocol/graph-ts";
import { BIGINT_ZERO, ZERO_ADDRESS } from '../utils/constants';

export function getOrCreateLoanCreated(
    id: String,
    createIfNotFound: boolean = true,
): LoanCreated {
    // @ts-ignore: assign wrapper object to primitive
    let loan = LoanCreated.load(id);

    if (loan == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        loan = new LoanCreated(id);
        loan.user = Bytes.fromHexString(ZERO_ADDRESS);
        loan.loanId = Bytes.fromHexString(ZERO_ADDRESS);
        loan.totalAssets = BIGINT_ZERO;
    }

    return loan as LoanCreated;
}