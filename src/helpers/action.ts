import {
    Borrow,
    Repay,
    Asset,
} from '../../generated/schema';
import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {UnlockdHelper} from "../../generated/UnlockdHelper/UnlockdHelper";
import {UNLOCK_HELPER_ADDRESS,BIGINT_ZERO} from "../utils/constants";

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
        borrow.totalAssets = BIGINT_ZERO;
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
        repay.unlockedAssets = BIGINT_ZERO;
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
    }

    return asset as Asset;
}

export function getAssetId(
    collection: Address,
    tokenId: BigInt,
): Bytes {
    const contract = UnlockdHelper.bind(UNLOCK_HELPER_ADDRESS)
    const callResult = contract.try_assetId(collection, tokenId)

    return callResult.value
}
