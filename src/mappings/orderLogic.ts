import { Action, Action__getLoanResultValue0Struct } from "../../generated/action/Action";
import {
    OrderCreated as OrderCreatedEvent, 
} from "../../generated/orderLogic/OrderLogic";
import { getLoan, getOrCreateLoan } from "../helpers/action";
import { getOrCreateOrderCreated } from "../helpers/orderLogic";
import {BigInt} from "@graphprotocol/graph-ts";

export function handleLoanCreated(event: OrderCreatedEvent): void {
    const loanCreated = getOrCreateOrderCreated(event.transaction.hash.toHexString())
    loanCreated.loanId = event.params.loanId
    loanCreated.owner = event.params.owner
    loanCreated.orderId = event.params.orderId
    loanCreated.orderType = BigInt.fromI32(event.params.orderType)

    loanCreated.blockNumber = event.block.number
    loanCreated.blockTimestamp = event.block.timestamp
    loanCreated.transactionHash = event.transaction.hash
    loanCreated.transactionInput = event.transaction.input
    loanCreated.save()

    const onChainLoan = getLoan(event.params.loanId) as Action__getLoanResultValue0Struct
    const loan = getOrCreateLoan(event.params.loanId.toHexString())
    loan.user = onChainLoan.owner.toHexString()
    loan.totalAssets = onChainLoan.totalAssets
    loan.underlyingAsset = onChainLoan.underlyingAsset
    loan.save()
}