import { Bytes, ethereum } from "@graphprotocol/graph-ts";

export function getTxnInputDataToDecode(event: ethereum.Event): Bytes {
    const inputDataHexString = event.transaction.input.toHexString().slice(10); //take away function signature: 0x???????? and the function name 8 next caracters
    const hexStringToDecode = '0x0000000000000000000000000000000000000000000000000000000000000020' + inputDataHexString; // prepend tuple offset
    return Bytes.fromByteArray(Bytes.fromHexString(hexStringToDecode));
}