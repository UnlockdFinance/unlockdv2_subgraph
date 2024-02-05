import {
    Borrow as BorrowEvent,
    Deposit as SupplyEvent,
    Repay as RepayEvent,
    Withdraw as WithdrawEvent
} from "../../generated/uTokenVault/uTokenVault"
import {
    getOrCreateUTokenBorrow,
    getOrCreateSupply,
    getOrCreateUTokenRepay,
    getOrCreateWithdraw
} from "../helpers/uTokenFactory"
import { getOrCreateAccount } from "../helpers/account"

// BorrowOnBelhalf
export function handleUTokenBorrow(event: BorrowEvent): void {
    let borrowOnBelhalf = getOrCreateUTokenBorrow(event.transaction.hash.toHexString())

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
export function handleSupply(event: SupplyEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    let deposit = getOrCreateSupply(event.transaction.hash.toHexString())

    deposit.user = event.params.user
    deposit.underlyingAsset = event.params.underlyingAsset
    deposit.amount = event.params.amount
    deposit.onBehalfOf = event.params.onBehalfOf

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
export function handleUTokenRepay(event: RepayEvent): void {
    let repayOnBehalf = getOrCreateUTokenRepay(event.transaction.hash.toHexString())

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
    withdraw.underlyingAsset = event.params.underlyingAsset
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


