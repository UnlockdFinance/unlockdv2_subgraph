import { 
    Borrow as BorrowEvent, 
    Repay as RepayEvent
  } from "../../generated/action/Action"
import { getOrCreateAccount } from "../helpers/account"
  
import { getOrCreateBorrow, getOrCreateRepay } from "../helpers/action"
  
  export function handleBorrow(event: BorrowEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const borrow = getOrCreateBorrow(event.transaction.hash.toHexString())
    
    borrow.user = event.params.user
    borrow.loanId = event.params.loanId
    borrow.amount = event.params.amount
    borrow.totalAssets = event.params.totalAssets
    
    borrow.blockNumber = event.block.number
    borrow.blockTimestamp = event.block.timestamp
    borrow.transactionHash = event.transaction.hash
  
    borrow.save()

    const borrowed = account.amountBorrowed.plus(borrow.amount)
    account.amountBorrowed = borrowed
    account.save()
  }
  
  export function handleRepay(event: RepayEvent): void {
    const account = getOrCreateAccount(event.params.user.toHexString())
    const repay = getOrCreateRepay(event.transaction.hash.toHexString())
  
    repay.user = event.params.user
    repay.loanId = event.params.loanId
    repay.amount = event.params.amount
    repay.unlockedAssets = event.params.unlockedAssets
  
    repay.blockNumber = event.block.number
    repay.blockTimestamp = event.block.timestamp
    repay.transactionHash = event.transaction.hash
  
    repay.save() 

    const repaid = account.amountBorrowed.minus(repay.amount)
    account.amountBorrowed = repaid
    account.save()
  }