import { 
    TotalCount
  } from '../../generated/schema';
import { BIGINT_ZERO } from '../utils/constants';
import { BigInt } from "@graphprotocol/graph-ts";

export function getOrCreateTotalCount(
  createIfNotFound: boolean = true,
): TotalCount {
  // @ts-ignore: assign wrapper object to primitive
  let totalCount = TotalCount.load("1");
  
  if (totalCount == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    totalCount = new TotalCount("1");
    totalCount.totalCount = BIGINT_ZERO;
  }
  
  return totalCount as TotalCount;
}