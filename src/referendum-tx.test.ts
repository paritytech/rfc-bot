import * as fs from "fs";

import { createReferendumTx } from "./referendum-tx";

describe("createReferendumTx", () => {
  test("Properly constructs the transaction hash and link", async () => {
    // https://raw.githubusercontent.com/polkadot-fellows/RFCs/33d45a809d12481c32b6b1d129caf609bb7db7c6/text/0005-coretime-interface.md
    const rfcProposalText = fs.readFileSync("src/examples/0005-coretime-interface.md").toString();

    const result = await createReferendumTx({ rfcProposalText, rfcNumber: "0005" });

    expect(result.transactionHex).toEqual(
      "0x3d003e0101590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290100000000",
    );
    console.log(`Link for manual inspection: ${result.transactionCreationUrl}`);
  });
});
