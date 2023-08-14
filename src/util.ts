import { blake2AsHex } from "@polkadot/util-crypto";

/**
 * Matrix handles of the team supporting this project.
 * Currently - Engineering Automation / Opstooling.
 * It is used to tag these usernames when there is a failure.
 */
export const teamMatrixHandles =
  process.env.NODE_ENV === "development" ? [] : ["@przemek", "@mak", "@yuri", "@bullrich"]; // Don't interrupt other people when testing.

/**
 * blake2-256 hash of the raw proposal text, as described in the [RFC process](https://github.com/polkadot-fellows/RFCs#process).
 */
export const hashProposal = (proposal: string): string => blake2AsHex(proposal, 256);

// https://stackoverflow.com/a/52254083
export const byteSize = (str: string): number => new Blob([str]).size;
