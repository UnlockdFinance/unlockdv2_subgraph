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
export const UNLOCK_MARKET_ADDRESS = Address.fromString('0x12d3a6668e6db47b4a17003dd2abf7eecbc72964')
