import { 
  Approval,
  BalanceTransfer,
  BorrowOnBelhalf,
  Burn,
  Deposit,
  Mint,
  Paused,
  PausedTimeUpdated,
  RepayOnBelhalf,
  ReserveDataUpdated,
  Transfer,
  TreasuryAddressUpdated,
  UTokenSwept,
  Unpaused,
  Withdraw,
} from '../../generated/schema';

  export function getOrCreateApproval(
    id: String,
    createIfNotFound: boolean = true,
  ): Approval {
    // @ts-ignore: assign wrapper object to primitive
    let approval = Approval.load(id);

    if (approval == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      approval = new Approval(id);
    }

    return approval as Approval;
  }

  export function getOrCreateBalanceTransfer(
    id: String, 
    createIfNotFound: boolean = true,
  ): BalanceTransfer {
    // @ts-ignore: assign wrapper object to primitive
    let balanceTransfer = BalanceTransfer.load(id);

    if (balanceTransfer == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive{
      balanceTransfer = new BalanceTransfer(id);
    }

    return balanceTransfer as BalanceTransfer;
  }

  export function getOrCreateBorrowOnBelhalf(
    id: String,
    createIfNotFound: boolean = true,  
  ): BorrowOnBelhalf {
    // @ts-ignore: assign wrapper object to primitive
    let borrowOnBelhalf = BorrowOnBelhalf.load(id);

    if (borrowOnBelhalf == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      borrowOnBelhalf = new BorrowOnBelhalf(id);
    }

    return borrowOnBelhalf as BorrowOnBelhalf;
  }

  export function getOrCreateBurn(
    id: String,
    createIfNotFound: boolean = true,  
  ): Burn {
    // @ts-ignore: assign wrapper object to primitive
    let burn = Burn.load(id);

    if (burn == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      burn = new Burn(id);
    }

    return burn as Burn; 
  }

  export function getOrCreateDeposit(
    id: String,
    createIfNotFound: boolean = true,
  ): Deposit {
    // @ts-ignore: assign wrapper object to primitive
    let deposit = Deposit.load(id);

    if (deposit == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      deposit = new Deposit(id);
    }

    return deposit as Deposit;
  }

  export function getOrCreateMint(
    id: String, 
    createIfNotFound: boolean = true,
  ): Mint {
    // @ts-ignore: assign wrapper object to primitive
    let mint = Mint.load(id);

    if (mint == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      mint = new Mint(id);
    }

    return mint as Mint;
  }

  export function getOrCreatePaused(
    id: String,
    createIfNotFound: boolean = true,   
  ): Paused {
    // @ts-ignore: assign wrapper object to primitive
    let paused = Paused.load(id);

    if (paused == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      paused = new Paused(id);
    }

    return paused as Paused;
  }

  export function getOrCreatePausedTimeUpdated(
    id: String,
    createIfNotFound: boolean = true,
  ): PausedTimeUpdated {  
    // @ts-ignore: assign wrapper object to primitive
    let pausedTimeUpdated = PausedTimeUpdated.load(id);

    if (pausedTimeUpdated == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      pausedTimeUpdated = new PausedTimeUpdated(id);
    }

    return pausedTimeUpdated as PausedTimeUpdated;
  }


  export function getOrCreateRepayOnBelhalf(
    id: String,
    createIfNotFound: boolean = true, 
  ): RepayOnBelhalf {
    // @ts-ignore: assign wrapper object to primitive
    let repayOnBelhalf = RepayOnBelhalf.load(id);

    if (repayOnBelhalf == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      repayOnBelhalf = new RepayOnBelhalf(id);
    }

    return repayOnBelhalf as RepayOnBelhalf;
  }

  export function getOrCreateReserveDataUpdated(
    id: String,
    createIfNotFound: boolean = true,
  ): ReserveDataUpdated {
    // @ts-ignore: assign wrapper object to primitive
    let reserveDataUpdated = ReserveDataUpdated.load(id);

    if (reserveDataUpdated == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      reserveDataUpdated = new ReserveDataUpdated(id);
    }

    return reserveDataUpdated as ReserveDataUpdated;
  }

  export function getOrCreateTransfer(
    id: String,
    createIfNotFound: boolean = true,  
  ): Transfer {
    // @ts-ignore: assign wrapper object to primitive
    let transfer = Transfer.load(id);

    if (transfer == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      transfer = new Transfer(id);
    }

    return transfer as Transfer;
  }

  export function getOrCreateTreasuryAddressUpdated(
    id: String,
    createIfNotFound: boolean = true,
  ): TreasuryAddressUpdated {
    // @ts-ignore: assign wrapper object to primitive
    let treasuryAddressUpdated = TreasuryAddressUpdated.load(id);

    if (treasuryAddressUpdated == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      treasuryAddressUpdated = new TreasuryAddressUpdated(id);
    }

    return treasuryAddressUpdated as TreasuryAddressUpdated;
  }

  export function getOrCreateUTokenSwept(
    id: String,
    createIfNotFound: boolean = true,  
  ): UTokenSwept {
    // @ts-ignore: assign wrapper object to primitive
    let uTokenSwept = UTokenSwept.load(id);

    if (uTokenSwept == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      uTokenSwept = new UTokenSwept(id);
    }

    return uTokenSwept as UTokenSwept;
  }

  export function getOrCreateUnpaused(
    id: String,
    createIfNotFound: boolean = true,
  ): Unpaused {
    // @ts-ignore: assign wrapper object to primitive
    let unpaused = Unpaused.load(id);

    if (unpaused == null && createIfNotFound) {
      // @ts-ignore: assign wrapper object to primitive
      unpaused = new Unpaused(id);
    }

    return unpaused as Unpaused;  
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


