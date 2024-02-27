import { components } from '@octokit/openapi-types';

export type EnterprisePayload = { enterprise?: components['schemas']['enterprise'] };
type PingEvent = components['schemas']['webhook-ping'];
type PushEvent = components['schemas']['webhook-push'];

export type EnterpriseProxyEvent = (PushEvent | PingEvent) & EnterprisePayload;
