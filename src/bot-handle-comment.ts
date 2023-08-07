import { github } from "@eng-automation/integrations";
import { envVar } from "@eng-automation/js";
import { IssueCommentCreatedEvent } from "@octokit/webhooks-types";

import { matrixNotifyOnFailure, matrixNotifyOnNewRequest } from "./matrix";
import { GithubReactionType, State } from "./types";

type OnIssueCommentResult = { success: true; message: string } | { success: false; errorMessage: string };

export const handleIssueCommentCreated = async (state: State, event: IssueCommentCreatedEvent): Promise<void> => {
  const [botMention] = event.comment.body.split(" ") as (string | undefined)[];

  // The bot only triggers on creation of a new comment on a pull request.
  if (!event.issue.pull_request || event.action !== "created" || !botMention?.startsWith("/rfc-bot")) {
    return;
  }

  const requester = event.comment.user.login;
  const installationId = (
    await github.getRepoInstallation({ owner: event.repository.owner.login, repo: event.repository.name })
  ).id;

  const octokitInstance = await github.getInstance({
    authType: "installation",
    appId: envVar("GITHUB_APP_ID"),
    installationId: String(installationId),
    privateKey: envVar("GITHUB_PRIVATE_KEY"),
  });

  const respondParams = {
    owner: event.repository.owner.login,
    repo: event.repository.name,
    issue_number: event.issue.number,
  };

  const githubComment = async (body: string) =>
    await github.createComment({ ...respondParams, body }, { octokitInstance });
  const githubEmojiReaction = async (reaction: GithubReactionType) =>
    await github.createReactionForIssueComment(
      { ...respondParams, comment_id: event.comment.id, content: reaction },
      { octokitInstance },
    );

  await githubEmojiReaction("eyes");
  // await matrixNotifyOnNewRequest(state.matrix, event);
  try {
    // Do the thing.
  } catch (e) {
    state.bot.log.error(e.message);
    await githubComment(
      `@${requester} Creating RFC proposal referendum failed :( The team has been notified. Alternatively open an issue [here](https://github.com/paritytech/rfc-bot/issues/new).`,
    );
    await githubEmojiReaction("confused");
    // await matrixNotifyOnFailure(state.matrix, event);
  }
};
