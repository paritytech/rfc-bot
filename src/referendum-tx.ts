/**
 * We're using the fact that Kusama has the fellowshipReferenda pallet,
 * so the types are available there.
 * Polkadot has that pallet on a Collectives parachain,
 * and it's not available in that types.
 */
import "@polkadot/api-augment/kusama";
import { ApiPromise } from "@polkadot/api";

import { byteSize, hashProposal } from "./util";

/**
 * The URL is not used by the bot to connect to the chain.
 * It is only used to construct a link to Polkadot.js.org/apps that will be able to decode the transaction.
 */
const PROVIDER_URL = "wss://polkadot-collectives-rpc.polkadot.io";
const POLKADOT_APPS_URL = `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(PROVIDER_URL)}#/`;
const polkadotAppsDecodeURL = (transactionHex: string) => `${POLKADOT_APPS_URL}extrinsics/decode/${transactionHex}`;

export const createReferendumTx = async (opts: {
  rfcNumber: string;
  rfcProposalText: string;
}): Promise<{ transactionHex: string; transactionCreationUrl: string }> => {
  const api = new ApiPromise();
  await api.isReadyOrError;

  const remarkText = `RFC_APPROVE(${opts.rfcNumber},${hashProposal(opts.rfcProposalText)})`;
  const remarkTx = api.tx.system.remark(remarkText);

  if (byteSize(remarkTx) >= 128) {
    // https://github.com/paritytech/substrate/blob/ae5085782b2981f35338ff6d4e5417e74c569377/frame/support/src/traits/preimages.rs#L27
    throw new Error("Inlining proposal is limited to 128 bytes.");
  }

  const submitTx = api.tx.fellowshipReferenda.submit(
    { Origins: "Fellows" },
    { Inline: remarkTx.method.toHex() },
    { After: 0 },
  );

  let transactionHex: string = submitTx.method.toHex();
  // Replace the positions of Kusama indexes to Polkadot's Collectives
  transactionHex = transactionHex.replace("1700", "3d00"); // fellowshipReferenda.submit call index
  transactionHex = transactionHex.replace("2b0f", "3e01"); // {Origins: 'Fellows'} changed to {FellowshipOrigins: 'Fellows'}

  await api.disconnect();
  return { transactionHex, transactionCreationUrl: polkadotAppsDecodeURL(transactionHex) };
};
