import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const VAULT_ID = Address.fromString("0x893E5c05A4d43c0d52A00d38AE0069dcaD986e36")
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x5cf9c8f9b41e04a51e95783ce90ffeb9a9421c7f') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0xcc3972d8b95f24859c614bcabef3db05e14f174b') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x28fb73f263b968fe41876484d0524756c3f25a90')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0x742852b8f96cb0b48cdcbbc1e1e1837543adf76b') // 4

export enum OrderStatus {
    ACTIVE = 0,
    CANCELLED = 1,
    REDEEMED = 2,
    BOUGHT = 3,
    CLAIMED = 4,
}

export enum Market {
    DEBT = 0,
    AUCTION = 1,
}

export enum LoanStatus {
    BORROWED = 0,
    PENDING = 1,
    PAID = 2,
}

