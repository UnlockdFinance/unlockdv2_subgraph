import { Bytes } from '@graphprotocol/graph-ts';
import { 
    SetLoanId
  } from '../../generated/schema';
import { ZERO_ADDRESS } from '../utils/constants';
  
export function getOrCreateSetLoanId(
  id: String,
  createIfNotFound: boolean = true,
): SetLoanId {
  // @ts-ignore: assign wrapper object to primitive
  let loanId = SetLoanId.load(id);
  
  if (loanId == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    loanId = new SetLoanId(id);
    loanId.index = Bytes.fromHexString(ZERO_ADDRESS);
    loanId.loanId = Bytes.fromHexString(ZERO_ADDRESS);
  }
  
  return loanId as SetLoanId;
}