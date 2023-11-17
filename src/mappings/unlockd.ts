import {
    ProxyCreated as ProxyCreatedEvent,
  } from "../../generated/unlockd/Unlockd";
import { getOrCreateProxy } from "../helpers/unlockd";


export function handleProxyCreated(event: ProxyCreatedEvent): void {
  const proxyContract = getOrCreateProxy(event.params.moduleId.toString())
  proxyContract.proxy = event.params.proxy
  proxyContract.save()
}
