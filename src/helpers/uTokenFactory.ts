import { 
  UTokenBorrow,
  Supply,
  UTokenRepay,
  Withdraw,
} from '../../generated/schema';

  export function getOrCreateUTokenBorrow(
    id: String,
    createIfNotFound: boolean = true,  
  ): UTokenBorrow {
    // @ts-ignore: assign wrapper object to primitive
    let borrowOnBelhalf = UTokenBorrow.load(id);

    if (borrowOnBelhalf == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      borrowOnBelhalf = new UTokenBorrow(id);
    }

    return borrowOnBelhalf as UTokenBorrow;
  }

  export function getOrCreateSupply(
    id: String,
    createIfNotFound: boolean = true,
  ): Supply {
    // @ts-ignore: assign wrapper object to primitive
    let deposit = Supply.load(id);

    if (deposit == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      deposit = new Supply(id);
    }

    return deposit as Supply;
  }

  export function getOrCreateUTokenRepay(
    id: String,
    createIfNotFound: boolean = true, 
  ): UTokenRepay {
    // @ts-ignore: assign wrapper object to primitive
    let repayOnBelhalf = UTokenRepay.load(id);

    if (repayOnBelhalf == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      repayOnBelhalf = new UTokenRepay(id);
    }

    return repayOnBelhalf as UTokenRepay;
  }

  export function getOrCreateWithdraw(
    id: String,
    createIfNotFound: boolean = true,
  ): Withdraw {
    // @ts-ignore: assign wrapper object to primitive
    let withdraw = Withdraw.load(id);

    if (withdraw == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      withdraw = new Withdraw(id);
    }

    return withdraw as Withdraw;
  }


