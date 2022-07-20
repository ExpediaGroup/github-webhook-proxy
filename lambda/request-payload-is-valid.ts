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

import { EnterprisePushEvent } from './types';

export function requestPayloadIsValid(requestPayload: EnterprisePushEvent) {
  const {
    repository: {
      owner: { login: githubOrg }
    },
    enterprise
  } = requestPayload;
  return requestCameFromValidEnterprise(enterprise) || githubOrgEndsWithUserSuffix(githubOrg);
}

function requestCameFromValidEnterprise(enterprise: EnterprisePushEvent['enterprise'] | undefined) {
  return process.env.ENTERPRISE_SLUG && enterprise?.slug === process.env.ENTERPRISE_SLUG;
}

function githubOrgEndsWithUserSuffix(githubOrg: string) {
  return (
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX && githubOrg.endsWith(`_${process.env.ENTERPRISE_MANAGED_USER_SUFFIX}`)
  );
}
