import { 
    Account,
  } from '../../generated/schema';
import { BIGINT_ZERO } from '../utils/constants';
  
export function getOrCreateAccount(
  id: String,
  createIfNotFound: boolean = true,
): Account {
  // @ts-ignore: assign wrapper object to primitive
  let account = Account.load(id);
  
  if (account == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    account = new Account(id);
    account.amountDeposited = BIGINT_ZERO;
    account.amountBorrowed = BIGINT_ZERO;
    account.totalAssets = BIGINT_ZERO;
  }
  
  return account as Account;
}
