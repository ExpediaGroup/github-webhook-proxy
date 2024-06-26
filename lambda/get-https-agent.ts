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

import https from "https";
import { getPublicCerts, readFileFromLayer } from "./file-readers";

export function getHttpsAgent() {
  const suppliedCertificateAuthority = readFileFromLayer("ca.pem");
  const suppliedCertificate = readFileFromLayer("cert.pem");
  if (!suppliedCertificateAuthority || !suppliedCertificate) {
    return undefined;
  }

  return new https.Agent({
    ca: [getPublicCerts(), suppliedCertificateAuthority].join("\n"),
    cert: suppliedCertificate,
  });
}
