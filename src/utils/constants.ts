import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x92c71cae4cbe1582fb7f474ffea82ab7b5068be8') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0xe01eb0a41127d2ceae7dd55fe0995996586b36d7') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x12d08b92d7c7806da7222c52bb0eba9dbfde3a47')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0x55f90e140cb98a26f72271d0b342d0f8ce208b7f') // 4

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

