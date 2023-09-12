import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Punk } from "../../generated/schema";

export const createPunk = (punkIndex: BigInt): Punk => {
  return new Punk(punkIndex.toString());
};

export const getPunk = (punkIndex: BigInt): Punk | null => {
  return Punk.load(punkIndex.toString());
};

export const handlePunkOwnerChange = (
  punkIndex: BigInt,
  newOnwer: Bytes
): void => {
  let punk = getPunk(punkIndex);

  if (!punk) {
    punk = createPunk(punkIndex);
  }

  punk.owner = newOnwer;
  punk.save();
};