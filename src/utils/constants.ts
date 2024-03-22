import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0xf74409bf0b2bbcc9e07a7e73f11bfce7ec25c2f0') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0x5d80a469756bb6aabcfc5da764294c069b1e2f45') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x96769eaab3697ac8a881f77ecbb4730c86a6bdcd')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0x11585e3e1c82945fb3de45e10f2bde50d15b9042') // 4

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

