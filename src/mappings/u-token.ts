import { 
  Approval as ApprovalEvent,
  BalanceTransfer as BalanceTransferEvent,
  BorrowOnBelhalf as BorrowOnBelhalfEvent,
  Burn as BurnEvent,
  Deposit as DepositEvent,
  Mint as MintEvent,
  Paused as PausedEvent,
  PausedTimeUpdated as PausedTimeUpdatedEvent,
  RepayOnBelhalf as RepayOnBelhalfEvent,
  ReserveDataUpdated as ReserveDataUpdatedEvent,
  Transfer as TransferEvent,
  TreasuryAddressUpdated as TreasuryAddressUpdatedEvent,
  UTokenSwept as UTokenSweptEvent,
  Unpaused as UnpausedEvent,
  Withdraw as WithdrawEvent
} from "../../generated/uToken/uToken"

import { 
  getOrCreateApproval, 
  getOrCreateBalanceTransfer, 
  getOrCreateBorrowOnBelhalf, 
  getOrCreateBurn, 
  getOrCreateDeposit, 
  getOrCreateMint, 
  getOrCreatePaused, 
  getOrCreatePausedTimeUpdated, 
  getOrCreateRepayOnBelhalf, 
  getOrCreateReserveDataUpdated, 
  getOrCreateTransfer, 
  getOrCreateTreasuryAddressUpdated, 
  getOrCreateUTokenSwept, 
  getOrCreateUnpaused, 
  getOrCreateWithdraw 
} from "../helpers/u-token"

import { BIGINT_ZERO } from "../utils/constants"
import { getOrCreateAccount } from "../helpers/account"

  // Approval
  export function handleApproval(event: ApprovalEvent): void {
    let approval = getOrCreateApproval(event.transaction.hash.toHexString())

    approval.owner = event.params.owner
    approval.spender = event.params.spender
    approval.value = event.params.value

    approval.blockNumber = event.block.number
    approval.blockTimestamp = event.block.timestamp
    approval.transactionHash = event.transaction.hash

    approval.save()
  }

  // BalanceTransfer
  export function handleBalanceTransfer(event: BalanceTransferEvent): void {
    let balanceTransfer = getOrCreateBalanceTransfer(event.transaction.hash.toHexString())  
    
    balanceTransfer.from = event.params.from
    balanceTransfer.to = event.params.to
    balanceTransfer.value = event.params.value
    balanceTransfer.index = event.params.index

    balanceTransfer.blockNumber = event.block.number
    balanceTransfer.blockTimestamp = event.block.timestamp
    balanceTransfer.transactionHash = event.transaction.hash

    balanceTransfer.save() 
  }

  // BorrowOnBelhalf
  export function handleBorrowOnBelhalf(event: BorrowOnBelhalfEvent): void {
    let borrowOnBelhalf = getOrCreateBorrowOnBelhalf(event.transaction.hash.toHexString())
    
    borrowOnBelhalf.onBehalfOf = event.params.onBehalfOf
    borrowOnBelhalf.iniciator = event.params.iniciator
    borrowOnBelhalf.amount = event.params.amount
    borrowOnBelhalf.loanId = event.params.loanId
    borrowOnBelhalf.underlyingAsset = event.params.underlyingAsset 
    borrowOnBelhalf.borrowRate = event.params.borrowRate

    borrowOnBelhalf.blockNumber = event.block.number
    borrowOnBelhalf.blockTimestamp = event.block.timestamp
    borrowOnBelhalf.transactionHash = event.transaction.hash

    borrowOnBelhalf.save()
  } 
  // Burn
  export function handleBurn(event: BurnEvent): void {
    let burn = getOrCreateBurn(event.transaction.hash.toHexString())
    burn.from = event.params.from
    burn.target = event.params.target
    burn.value = event.params.value
    burn.index = event.params.index

    burn.blockNumber = event.block.number
    burn.blockTimestamp = event.block.timestamp
    burn.transactionHash = event.transaction.hash

    burn.save()
  }

  // Deposit  
  export function handleDeposit(event: DepositEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    let deposit = getOrCreateDeposit(event.transaction.hash.toHexString())

    deposit.user = event.params.user
    deposit.reserve = event.params.reserve
    deposit.amount = event.params.amount
    deposit.onBehalfOf = event.params.onBehalfOf
    deposit.referral = BIGINT_ZERO // TODO: event.params.referral

    deposit.blockNumber = event.block.number
    deposit.blockTimestamp = event.block.timestamp
    deposit.transactionHash = event.transaction.hash

    deposit.save()

    const deposited = account.amountDeposited.plus(deposit.amount)
    account.amountBorrowed = deposited
    account.save()
  }

  // Mint
  export function handleMint(event: MintEvent): void {
    let mint = getOrCreateMint(event.transaction.hash.toHexString())
    
    mint.from = event.params.from
    mint.value = event.params.value
    mint.index = event.params.index

    mint.blockNumber = event.block.number
    mint.blockTimestamp = event.block.timestamp
    mint.transactionHash = event.transaction.hash

    mint.save()
  }

  // Paused
  export function handlePaused(event: PausedEvent): void {
    let paused = getOrCreatePaused(event.transaction.hash.toHexString())

    paused.blockNumber = event.block.number
    paused.blockTimestamp = event.block.timestamp
    paused.transactionHash = event.transaction.hash

    paused.save()
  }

  // PausedTimeUpdated
  export function handlePausedTimeUpdated(event: PausedTimeUpdatedEvent): void {
    let pausedTimeUpdated = getOrCreatePausedTimeUpdated(
      event.transaction.hash.toHexString()
    )
    pausedTimeUpdated.startTime = event.params.startTime
    pausedTimeUpdated.durationTime = event.params.durationTime

    pausedTimeUpdated.blockNumber = event.block.number
    pausedTimeUpdated.blockTimestamp = event.block.timestamp
    pausedTimeUpdated.transactionHash = event.transaction.hash

    pausedTimeUpdated.save() 
  }

  // RepayOnBelhalf
  export function handleRepayOnBelhalf(event: RepayOnBelhalfEvent): void {
    let repayOnBehalf = getOrCreateRepayOnBelhalf(event.transaction.hash.toHexString())

    repayOnBehalf.iniciator = event.params.iniciator
    repayOnBehalf.loanId = event.params.loanId
    repayOnBehalf.underlyingAsset = event.params.underlyingAsset
    repayOnBehalf.amount = event.params.amount
    repayOnBehalf.onBehalfOf = event.params.onBehalfOf
    repayOnBehalf.borrowRate = event.params.borrowRate

    repayOnBehalf.blockNumber = event.block.number
    repayOnBehalf.blockTimestamp = event.block.timestamp
    repayOnBehalf.transactionHash = event.transaction.hash

    repayOnBehalf.save()
  }

  // ReserveDataUpdated
  export function handleReserveDataUpdated(event: ReserveDataUpdatedEvent): void {
    let reserveDataUpdated = getOrCreateReserveDataUpdated(event.transaction.hash.toHexString())
    reserveDataUpdated.reserve = event.params.reserve
    reserveDataUpdated.liquidityRate = event.params.liquidityRate
    reserveDataUpdated.variableBorrowRate = event.params.variableBorrowRate
    reserveDataUpdated.liquidityIndex = event.params.liquidityIndex
    reserveDataUpdated.variableBorrowIndex = event.params.variableBorrowIndex

    reserveDataUpdated.blockNumber = event.block.number
    reserveDataUpdated.blockTimestamp = event.block.timestamp
    reserveDataUpdated.transactionHash = event.transaction.hash

    reserveDataUpdated.save()
  }

  // Transfer  
  export function handleTransfer(event: TransferEvent): void {
    let transfer = getOrCreateTransfer(event.transaction.hash.toHexString())

    transfer.from = event.params.from
    transfer.to = event.params.to
    transfer.value = event.params.value

    transfer.blockNumber = event.block.number
    transfer.blockTimestamp = event.block.timestamp
    transfer.transactionHash = event.transaction.hash

    transfer.save()
  }

  // TreasuryAddressUpdated
  export function handleTreasuryAddressUpdated(event: TreasuryAddressUpdatedEvent): void {
    let treasuryAdded = getOrCreateTreasuryAddressUpdated(event.transaction.hash.toHexString())

    treasuryAdded._newTreasuryAddress = event.params._newTreasuryAddress

    treasuryAdded.blockNumber = event.block.number
    treasuryAdded.blockTimestamp = event.block.timestamp
    treasuryAdded.transactionHash = event.transaction.hash

    treasuryAdded.save()
  }

  // UTokenSwept
  export function handleUTokenSwept(event: UTokenSweptEvent): void {
    let swept = getOrCreateUTokenSwept(event.transaction.hash.toHexString())
    
    swept.uToken = event.params.uToken
    swept.underlyingAsset = event.params.underlyingAsset
    swept.amount = event.params.amount

    swept.blockNumber = event.block.number
    swept.blockTimestamp = event.block.timestamp
    swept.transactionHash = event.transaction.hash

    swept.save()
  }

  // Unpaused
  export function handleUnpaused(event: UnpausedEvent): void {
    let unpaused = getOrCreateUnpaused(event.transaction.hash.toHexString())

    unpaused.blockNumber = event.block.number
    unpaused.blockTimestamp = event.block.timestamp
    unpaused.transactionHash = event.transaction.hash

    unpaused.save()
  }

  // Withdraw
  export function handleWithdraw(event: WithdrawEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    let withdraw = getOrCreateWithdraw(event.transaction.hash.toHexString())

    withdraw.user = event.params.user
    withdraw.reserve = event.params.reserve
    withdraw.amount = event.params.amount
    withdraw.to = event.params.to

    withdraw.blockNumber = event.block.number
    withdraw.blockTimestamp = event.block.timestamp
    withdraw.transactionHash = event.transaction.hash

    withdraw.save()

    const Withdrawal = account.amountDeposited.minus(withdraw.amount)
    account.amountBorrowed = Withdrawal
    account.save()
  }

  