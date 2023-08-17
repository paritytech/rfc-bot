import type { Router } from "express";
import promClient from "prom-client";

const prefix = "rfc_bot_";

promClient.register.setDefaultLabels({ team: "opstooling" });
promClient.collectDefaultMetrics({ prefix });

export const addMetricsRoute = (router: Router): void => {
  router.get("/metrics", (req, res) => {
    promClient.register
      .metrics()
      .then((metrics) => {
        res.status(200);
        res.type("text/plain");
        res.send(metrics);
      })
      .catch((error) => {
        res.status(500);
        res.send(error.message);
      });
  });

  router.get("/health", (req, res) => {
    res.send("OK");
  });
};
