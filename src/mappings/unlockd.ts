import {
    ProxyCreated as ProxyCreatedEvent,
  } from "../../generated/unlockd/Unlockd";
import { getOrCreateProxy } from "../helpers/unlockd";


export function handleProxyCreated(event: ProxyCreatedEvent): void {
  const proxyContract = getOrCreateProxy(event.params.moduleId.toString())
  proxyContract.proxy = event.params.proxy

  proxyContract.blockNumber = event.block.number
  proxyContract.blockTimestamp = event.block.timestamp
  proxyContract.transactionHash = event.transaction.hash
  proxyContract.transactionInput = event.transaction.input
  proxyContract.save()
}
