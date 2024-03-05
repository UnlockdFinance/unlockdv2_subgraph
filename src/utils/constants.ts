import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x05d18ab726281f62b1747a7f74a618af5d247ded') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0xf910f287416f9aaa5cdb3cd22d54ffab4a1afb6b') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x504328ff34c7b7cbbb3be34bb2223a6abb5bc806')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0xe92817b85729eafab104ed4fc73d62a348a2ad78') // 4

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

