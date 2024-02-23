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

import { readFileFromLayer } from './file-readers';
import { isMatch } from 'micromatch';

export function destinationHostIsAllowed(url: string) {
  const allowedDestinationHostsContents = readFileFromLayer('allowed-destination-hosts.json');
  if (!allowedDestinationHostsContents) {
    return true;
  }
  const allowedDestinationHosts: string[] = JSON.parse(allowedDestinationHostsContents);
  const host = new URL(url).host;
  const destinationHostIsAllowed = allowedDestinationHosts.includes(host) || isMatch(host, allowedDestinationHosts);
  if (!destinationHostIsAllowed) {
    console.error(`Destination host ${host} does not match allowlist ${allowedDestinationHosts}`);
  }
  return destinationHostIsAllowed;
}
