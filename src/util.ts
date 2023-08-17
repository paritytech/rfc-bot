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
 * @returns The hash without a "0x" prefix.
 */
export const hashProposal = (proposal: string): string => {
  const result = blake2AsHex(proposal, 256);
  return result.startsWith("0x") ? result.slice(2) : result;
};

// https://stackoverflow.com/a/52254083
export const byteSize = (str: string): number => new Blob([str]).size;

/**
 * Extracts commit hash from GitHub's raw url.
 */
export const extractCommitHash = (rawUrl: string): string => {
  const match = rawUrl.match("raw/(.*)/text")?.[1];
  if (match === undefined) throw new Error("Could not extract commit hash.");
  return match;
};
