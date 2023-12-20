import {
    Loan,
    Borrow,
    Repay,
    Asset,
} from '../../generated/schema';
import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {UNLOCK_HELPER_ADDRESS,BIGINT_ZERO, UNLOCK_ACTION_ADDRESS, LoanStatus, ZERO_ADDRESS} from "../utils/constants";
import {UnlockdHelper} from "../../generated/action/UnlockdHelper";
import { Action, Action__getLoanResultValue0Struct } from '../../generated/action/Action';

export function getOrCreateLoan(
    id: String,
    createIfNotFound: boolean = true,
): Loan {
    // @ts-ignore: assign wrapper object to primitive
    let loan = Loan.load(id);

    if (loan == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        loan = new Loan(id);
        loan.status = BigInt.fromI32(LoanStatus.PENDING);
        loan.user = ZERO_ADDRESS;
        loan.amount = BIGINT_ZERO;
        loan.totalAssets = BIGINT_ZERO;
        loan.uToken = Bytes.fromHexString(ZERO_ADDRESS);
    }

    return loan as Loan;
}

export function getOrCreateBorrow(
    id: String,
    createIfNotFound: boolean = true,
): Borrow {
    // @ts-ignore: assign wrapper object to primitive
    let borrow = Borrow.load(id);

    if (borrow == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        borrow = new Borrow(id);
        borrow.amount = BIGINT_ZERO;
    }

    return borrow as Borrow;
}

export function getOrCreateRepay(
    id: String,
    createIfNotFound: boolean = true,
): Repay {
    // @ts-ignore: assign wrapper object to primitive
    let repay = Repay.load(id);

    if (repay == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive{
        repay = new Repay(id);
        repay.amount = BIGINT_ZERO;
    }

    return repay as Repay;
}

export function getOrCreateAsset(
    id: String,
    createIfNotFound: boolean = true,
): Asset {
    // @ts-ignore: assign wrapper object to primitive
    let asset = Asset.load(id);

    if (asset == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive{
        asset = new Asset(id);
        asset.tokenId = BIGINT_ZERO;
        asset.isOnAuction = false;
    }

    return asset as Asset;
}

export function getAssetId(
    collection: Address,
    tokenId: BigInt,
): Bytes {
    const contract = UnlockdHelper.bind(UNLOCK_HELPER_ADDRESS)
    const callResult = contract.try_getAssetId(collection, tokenId)

    return callResult.value
}

export function getLoan(
    loanId: Bytes
): Action__getLoanResultValue0Struct {
    const contract = Action.bind(UNLOCK_ACTION_ADDRESS)
    const callResult = contract.try_getLoan(loanId)

    return callResult.value
}