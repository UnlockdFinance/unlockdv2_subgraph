import {
    Assign as AssignEvent,
    PunkBought as PunkBoughtEvent,
    PunkTransfer as PunkTransferEvent,
  } from "../../generated/CryptoPunks/CryptoPunks";
  
  import { handlePunkOwnerChange } from "../helpers/cryptoPunks";
  
  export function handleAssign(event: AssignEvent): void {
    handlePunkOwnerChange(event.params.punkIndex, event.params.to);
  }
  
  export function handlePunkBought(event: PunkBoughtEvent): void {
    handlePunkOwnerChange(event.params.punkIndex, event.params.toAddress);
  }
  
  export function handlePunkTransfer(event: PunkTransferEvent): void {
    handlePunkOwnerChange(event.params.punkIndex, event.params.to);
  }