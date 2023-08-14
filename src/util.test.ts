import * as fs from "fs";

import { hashProposal } from "./util";

describe("Utility functions", () => {
  describe("hashProposal", () => {
    test("Properly hashes the RFC text", () => {
      // https://raw.githubusercontent.com/polkadot-fellows/RFCs/33d45a809d12481c32b6b1d129caf609bb7db7c6/text/0005-coretime-interface.md
      const rfcText = fs.readFileSync("src/examples/0005-coretime-interface.md").toString();

      // https://collectives.polkassembly.io/member-referenda/13
      // The remark is: "APPROVE_RFC(0005,9cbabfa80598d2935830c09c18e0a0e4ed8227b8c8f744f1f4a41d8597bb6d44)"
      const expectedHash = "9cbabfa80598d2935830c09c18e0a0e4ed8227b8c8f744f1f4a41d8597bb6d44";

      expect(hashProposal(rfcText)).toEqual(expectedHash);
    });
  });
});