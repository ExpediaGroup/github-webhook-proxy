import { components } from "@octokit/openapi-types";

export type EnterprisePayload = {
  enterprise?: components["schemas"]["enterprise"];
};
export type PingEvent = components["schemas"]["webhook-ping"];
export type PushEvent = components["schemas"]["webhook-push"];

export type EnterpriseProxyEvent = (PushEvent | PingEvent) & EnterprisePayload;
