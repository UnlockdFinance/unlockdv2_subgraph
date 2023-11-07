import { 
  BorrowOnBelhalf as BorrowOnBelhalfEvent,
  Deposit as DepositEvent,
  RepayOnBelhalf as RepayOnBelhalfEvent,
  Withdraw as WithdrawEvent
} from "../../generated/uToken/uToken"

import {  
  getOrCreateBorrowOnBelhalf,
  getOrCreateDeposit,
  getOrCreateRepayOnBelhalf,
  getOrCreateWithdraw 
} from "../helpers/u-token"

import { BIGINT_ZERO } from "../utils/constants"
import { getOrCreateAccount } from "../helpers/account"

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
    account.user = event.params.user
    account.save()
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
    account.user = event.params.user
    account.amountBorrowed = Withdrawal
    account.save()
  }

  