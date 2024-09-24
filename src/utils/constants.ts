import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0x42110B4F70Bd57972bCF4383b04Ce5E41F02A8a8')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x5a5bd67e6e780783176b87a6a07e1aab7b5a95b9') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0xb297b6976e0b9cd8a373b19249799676168b4eff') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x5b384fcf76c18ad2dfb9cc7fafb2d8ab36436c4b')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0x284ae2b6f12195c11e5903974e116f486d375c0a') // 4

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

