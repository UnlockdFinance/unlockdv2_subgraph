import {
    SetLoanId as SetLoanIdEvent,
} from "../../generated/ProtocolOwner/ProtocolOwner"
import { getOrCreateSetLoanId } from "../helpers/protocolOwner"

export function handleSetLoanId(event: SetLoanIdEvent): void {
    const setLoanId = getOrCreateSetLoanId(event.transaction.hash.toHexString())
    setLoanId.index = event.params.index
    setLoanId.loanId = event.params.loanId

    setLoanId.blockNumber = event.block.number
    setLoanId.blockTimestamp = event.block.timestamp
    setLoanId.transactionHash = event.transaction.hash
    setLoanId.transactionInput = event.transaction.input
    setLoanId.save()
}