import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export let BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
export const UNLOCK_HELPER_ADDRESS = Address.fromString('0xd186e00f3ad162c0f2b44e7fdc2c5697331a6c5c')
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x41dda08f36afdb83999e1f03eea87d1b24d31273') // 5
export const UNLOCK_ACTION_ADDRESS = Address.fromString('0x85ac071604d181d6b051f763b55e93a6c97d7995') // 3
export const UNLOCK_PROTOCOL_OWNER_ADDRESS = Address.fromString('0x68961f65a49b00a3c80175b9cf047de1f4b10d10')
export const UNLOCK_AUCTION_ADDRESS = Address.fromString('0xaa90f94ed8420cfed04b5e3908c69c4675570e4a') // 4

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

