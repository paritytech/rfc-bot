import { IssueCommentCreatedEvent } from "@octokit/webhooks-types";

import { State } from "./types";
import { teamMatrixHandles } from "./util";

export const sendMatrixMessage = async (
  matrix: State["matrix"],
  opts: { text: string; html: string },
): Promise<void> => {
  await matrix?.client.sendMessage(matrix.roomId, {
    body: opts.text,
    format: "org.matrix.custom.html",
    formatted_body: opts.html,
    msgtype: "m.text",
  });
};

export const matrixNotifyOnNewRequest = async (
  matrix: State["matrix"],
  event: IssueCommentCreatedEvent,
): Promise<void> => {
  await sendMatrixMessage(matrix, {
    text: `A new RFC proposal referendum has been requested: ${event.comment.html_url}`,
    html: `A new RFC proposal referendum has been <a href="${event.comment.html_url}">requested</a>.`,
  });
};

export const matrixNotifyOnFailure = async (
  matrix: State["matrix"],
  event: IssueCommentCreatedEvent,
  opts: { tagMaintainers: boolean },
): Promise<void> => {
  const tag = opts.tagMaintainers ? `${teamMatrixHandles.join(" ")} ` : "";
  await sendMatrixMessage(matrix, {
    text: `${tag}An RFC proposal referendum has failed: ${event.comment.html_url}`,
    html: `${tag}An RFC proposal has <a href="${event.comment.html_url}">failed</a>!`,
  });
};
