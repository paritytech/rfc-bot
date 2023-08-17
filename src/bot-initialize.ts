import { envVar } from "@eng-automation/js";
import { createClient } from "matrix-js-sdk";
import { ApplicationFunction, Probot } from "probot";

import { handleIssueCommentCreated } from "./bot-handle-comment";
import { addMetricsRoute } from "./metrics";
import { State } from "./types";

export const botInitialize: ApplicationFunction = (bot: Probot, { getRouter }) => {
  bot.log.info("Loading RFC bot...");
  const router = getRouter?.("/rfc-bot");
  if (router) {
    addMetricsRoute(router);
  } else {
    bot.log.warn("No router received from the probot library, metrics were not added.");
  }

  const state: State = {
    bot,
    matrix: {
      client: createClient({
        accessToken: envVar("MATRIX_ACCESS_TOKEN"),
        baseUrl: envVar("MATRIX_SERVER_URL"),
        localTimeoutMs: 10000,
      }),
      roomId: envVar("MATRIX_ROOM_ID"),
    },
  };

  bot.log.info("RFC bot was loaded!");

  bot.on("issue_comment.created", async (context) => {
    await handleIssueCommentCreated(state, context.payload);
  });
};
