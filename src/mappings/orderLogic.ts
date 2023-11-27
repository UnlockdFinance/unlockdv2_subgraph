import { Action, Action__getLoanResultValue0Struct } from "../../generated/action/Action";
import {
    LoanCreated as LoanCreatedEvent, 
} from "../../generated/orderLogic/OrderLogic";
import { getLoan, getOrCreateLoan } from "../helpers/action";
import { getOrCreateLoanCreated } from "../helpers/orderLogic";

export function handleLoanCreated(event: LoanCreatedEvent): void {
    const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
    loanCreated.loanId = event.params.loanId
    loanCreated.user = event.params.user
    loanCreated.totalAssets = event.params.totalAssets

    loanCreated.blockNumber = event.block.number
    loanCreated.blockTimestamp = event.block.timestamp
    loanCreated.transactionHash = event.transaction.hash
    loanCreated.transactionInput = event.transaction.input
    loanCreated.save()

    const onChainLoan = getLoan(event.params.loanId) as Action__getLoanResultValue0Struct
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.user = onChainLoan.owner.toHexString()
    loan.totalAssets = onChainLoan.totalAssets
    loan.uToken = onChainLoan.uToken
    loan.save()
}