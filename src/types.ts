import type { MatrixClient } from "matrix-js-sdk";
import { Probot } from "probot";

export type State = {
  bot: Probot;
  matrix?:
    | {
        client: MatrixClient;
        roomId: string;
      }
    | undefined;
};

// https://docs.github.com/en/rest/reactions/reactions#about-reactions
export type GithubReactionType = "+1" | "-1" | "laugh" | "confused" | "heart" | "hooray" | "rocket" | "eyes";
