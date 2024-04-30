import { LoanCreated as LoanCreatedEvent} from "../../generated/LoanLogic/LoanLogic";
import { Action__getLoanResultValue0Struct } from "../../generated/action/Action";
import { getOrCreateAccount } from "../helpers/account";

import { getLoan, getOrCreateLoan } from "../helpers/action";
import { getOrCreateLoanCreated } from "../helpers/loanCreated";

export function handleLoanCreated(event: LoanCreatedEvent): void {
    const loanCreated = getOrCreateLoanCreated(event.transaction.hash.toHexString())
    loanCreated.user = event.params.user
    loanCreated.loanId = event.params.loanId
    loanCreated.totalAssets = event.params.totalAssets

    loanCreated.blockNumber = event.block.number
    loanCreated.blockTimestamp = event.block.timestamp
    loanCreated.transactionHash = event.transaction.hash
    loanCreated.transactionInput = event.transaction.input
    loanCreated.save()

    const onChainLoan = getLoan(event.params.loanId) as Action__getLoanResultValue0Struct
    const account = getOrCreateAccount(event.params.user.toHexString())
    account.user = event.params.user
    account.totalAssets = onChainLoan.totalAssets
    account.save()
    
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.user = onChainLoan.owner.toHexString()
    loan.totalAssets = onChainLoan.totalAssets
    loan.underlyingAsset = onChainLoan.underlyingAsset
    loan.save()
}
