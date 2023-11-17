import { 
    ProxyCreated
  } from '../../generated/schema';
  
export function getOrCreateProxy(
  id: String,
  createIfNotFound: boolean = true,
): ProxyCreated {
  // @ts-ignore: assign wrapper object to primitive
  let proxyContractCreated = ProxyCreated.load(id);
  
  if (proxyContractCreated == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    proxyContractCreated = new ProxyCreated(id);
  }
  
  return proxyContractCreated as ProxyCreated;
}