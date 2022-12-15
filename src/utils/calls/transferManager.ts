import { Contract, BigNumberish, Overrides } from "ethers";
import { TransferManager } from "../../../typechain/contracts-exchange-v2/contracts/TransferManager";
import abi from "../../abis/TransferManager.json";
import { AssetType, Signer, ContractMethods } from "../../types";

export const transferBatchItemsAcrossCollections = (
  signer: Signer,
  address: string,
  collections: string[],
  assetTypes: AssetType[],
  from: string,
  to: string,
  itemIds: BigNumberish[][],
  amounts: BigNumberish[][],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: () =>
      contract.transferBatchItemsAcrossCollections(collections, assetTypes, from, to, itemIds, amounts, {
        ...overrides,
      }),
    estimateGas: () =>
      contract.estimateGas.transferBatchItemsAcrossCollections(collections, assetTypes, from, to, itemIds, amounts, {
        ...overrides,
      }),
  };
};

export const grantApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: () => contract.grantApprovals(operators, { ...overrides }),
    estimateGas: () => contract.estimateGas.grantApprovals(operators, { ...overrides }),
  };
};

export const revokeApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi, signer) as TransferManager;
  return {
    call: () => contract.revokeApprovals(operators, { ...overrides }),
    estimateGas: () => contract.estimateGas.revokeApprovals(operators, { ...overrides }),
  };
};
