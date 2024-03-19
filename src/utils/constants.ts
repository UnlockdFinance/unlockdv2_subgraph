import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x32d7cf863e0d578f76efff1a41cf4a4a4759259d') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0x269605dd60b609a49297e4be6a9e76189bb536cd') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0xcb09fa26fe65e52929ffb42a3519fa8a6960e8c8')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0xf08cc6ae6fa73ddd152aed38f44e6b40d8afe53e') // 4

export enum OrderStatus {
    ACTIVE = 0,
    CANCELLED = 1,
    REDEEMED = 2,
    BOUGHT = 3,
    CLAIMED = 4,
    PAID = 5,
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

