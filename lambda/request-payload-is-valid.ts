/*
Copyright 2022 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { PushEvent } from '@octokit/webhooks-types';
import { readFileFromLayer } from './file-readers';

export function requestPayloadIsValid(requestPayload: PushEvent) {
  const {
    repository: {
      owner: { login: githubOrg }
    }
  } = requestPayload;
  return githubOrgIsAllowed(githubOrg) || githubOrgEndsWithUserSuffix(githubOrg);
}

function githubOrgIsAllowed(githubOrg: string) {
  const allowedGitHubOrgsContents = readFileFromLayer('allowed-github-orgs.json');
  if (!allowedGitHubOrgsContents) {
    return true;
  }
  const allowedGitHubOrgs: string[] = JSON.parse(allowedGitHubOrgsContents);
  return allowedGitHubOrgs.includes(githubOrg);
}

function githubOrgEndsWithUserSuffix(githubOrg: string) {
  return (
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX && githubOrg.endsWith(`_${process.env.ENTERPRISE_MANAGED_USER_SUFFIX}`)
  );
}
