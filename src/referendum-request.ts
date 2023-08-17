import { github } from "@eng-automation/integrations";
import { IssueCommentCreatedEvent } from "@octokit/webhooks-types";
import fetch from "node-fetch";

import { createReferendumTx } from "./referendum-tx";
import { State } from "./types";

export const handleRFCReferendumRequest = async (
  state: State,
  event: IssueCommentCreatedEvent,
  requester: string,
  octokitInstance: github.GitHubInstance,
): Promise<{ success: true; message: string } | { success: false; errorMessage: string }> => {
  const userError = (message: string) => ({ success: false, errorMessage: `@${requester} ${message}` } as const);
  const prNumber = event.issue.number.toString().padStart(4, "0"); // e.g. 0005

  const addedMarkdownFiles = (
    await octokitInstance.rest.pulls.listFiles({
      repo: event.repository.name,
      owner: event.repository.owner.login,
      pull_number: event.issue.number,
    })
  ).data.filter((file) => file.status === "added" && file.filename.includes(".md"));
  if (addedMarkdownFiles.length < 1) {
    return userError("RFC markdown file was not found in the PR.");
  }
  if (addedMarkdownFiles.length > 1) {
    return userError(
      "More than one markdown file was found in the PR. Please double check the [Process](https://github.com/polkadot-fellows/RFCs#process)",
    );
  }
  const rfcFile = addedMarkdownFiles[0];
  const rawText = await (await fetch(rfcFile.raw_url)).text();

  const { transactionCreationUrl } = await createReferendumTx({ rfcProposalText: rawText, prNumber });

  const message =
    `## Approve RFC${prNumber} ${event.issue.title}` +
    `\n\nApprove [RFC${prNumber}](${event.issue.html_url}) at commit hash ${rfcFile.sha}.` +
    `\n\n[Referendum transaction creation link](${transactionCreationUrl})`;

  return { success: true, message };
};
