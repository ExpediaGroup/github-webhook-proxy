import { PushEvent, PingEvent } from '@octokit/webhooks-types';
import { components } from '@octokit/openapi-types';

export type EnterprisePayload = { enterprise?: components['schemas']['enterprise'] };

export type EnterpriseProxyEvent = (PushEvent | PingEvent) & EnterprisePayload;
