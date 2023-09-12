import { 
    Borrow,
    Repay,
  } from '../../generated/schema';
  
    export function getOrCreateBorrow(
      id: String,
      createIfNotFound: boolean = true,
    ): Borrow {
      // @ts-ignore: assign wrapper object to primitive
      let borrow = Borrow.load(id);
  
      if (borrow == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        borrow = new Borrow(id);
      }
  
      return borrow as Borrow;
    }
  
    export function getOrCreateRepay(
      id: String, 
      createIfNotFound: boolean = true,
    ): Repay {
      // @ts-ignore: assign wrapper object to primitive
      let repay = Repay.load(id);
  
      if (repay == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive{
        repay = new Repay(id);
      }
  
      return repay as Repay;
    }