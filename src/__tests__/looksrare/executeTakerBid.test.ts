import { expect } from "chai";
import { constants, utils } from "ethers";
import { ethers } from "hardhat";
import { setUpContracts, Mocks, getSigners, Signers } from "../helpers/setup";
import { LooksRare } from "../../LooksRare";
import { Addresses } from "../../constants/addresses";
import { SupportedChainId, AssetType, StrategyType, MakerAskInputs } from "../../types";

describe("execute taker bid", () => {
  let contracts: Mocks;
  let signers: Signers;
  let baseMakerAskInput: MakerAskInputs;
  let addresses: Addresses;
  beforeEach(async () => {
    contracts = await setUpContracts();
    signers = await getSigners();

    const tx = await contracts.transferManager
      .connect(signers.user1)
      .grantApprovals([contracts.looksRareProtocol.address]);
    await tx.wait();

    addresses = {
      EXCHANGE: contracts.looksRareProtocol.address,
      LOOKS: constants.AddressZero,
      TRANSFER_MANAGER: contracts.transferManager.address,
      WETH: contracts.weth.address,
    };
    baseMakerAskInput = {
      collection: contracts.collection1.address,
      assetType: AssetType.ERC721,
      strategyId: StrategyType.standard,
      subsetNonce: 0,
      orderNonce: 0,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 3600,
      price: utils.parseEther("1"),
      itemIds: [1],
    };
  });
  it("execute maker ask and taker bid", async () => {
    const lrUser1 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user1, addresses);
    const lrUser2 = new LooksRare(ethers.provider, SupportedChainId.HARDHAT, signers.user2, addresses);
    const { order, action } = await lrUser1.createMakerAsk(baseMakerAskInput);
    await action!();
    const signature = await lrUser1.signMakerAsk(order);

    const takerBid = lrUser2.createTakerBid(order, signers.user2.address);
    const tx = await lrUser2.executeTakerBid(order, takerBid, signature).call();
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
  });
});
