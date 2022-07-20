import { PushEvent } from '@octokit/webhooks-types';
import { components } from '@octokit/openapi-types';

export type EnterprisePushEvent = PushEvent & { enterprise?: components['schemas']['enterprise'] };
