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

import { EnterpriseProxyEvent } from "./types";

export function requestPayloadIsValid(payload?: EnterpriseProxyEvent) {
  const { sender, enterprise } = payload ?? {};
  return (
    requestCameFromValidEnterprise(enterprise) ||
    senderLoginEndsWithUserSuffix(sender?.login)
  );
}

function requestCameFromValidEnterprise(
  enterprise?: EnterpriseProxyEvent["enterprise"],
) {
  const requestCameFromValidEnterprise =
    process.env.ENTERPRISE_SLUG &&
    enterprise?.slug === process.env.ENTERPRISE_SLUG;
  if (!requestCameFromValidEnterprise) {
    console.error(
      `ENTERPRISE_SLUG environment variable ${process.env.ENTERPRISE_SLUG} does not equal enterprise slug ${enterprise?.slug}`,
    );
  }
  return requestCameFromValidEnterprise;
}

function senderLoginEndsWithUserSuffix(senderLogin?: string) {
  const senderLoginEndsWithUserSuffix =
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX &&
    senderLogin?.endsWith(`_${process.env.ENTERPRISE_MANAGED_USER_SUFFIX}`);
  if (!senderLoginEndsWithUserSuffix) {
    console.error(
      `Sender login ${senderLogin} does not end with ENTERPRISE_MANAGED_USER_SUFFIX environment variable ${process.env.ENTERPRISE_MANAGED_USER_SUFFIX}`,
    );
  }
  return senderLoginEndsWithUserSuffix;
}
