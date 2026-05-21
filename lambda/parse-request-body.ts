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

import { IncomingHttpHeaders } from "http";
import { bodySchema, CONTENT_TYPES, headersSchema } from "./schema";
import { EnterpriseProxyEvent } from "./types";

export function parseRequestBody(
  body: string,
  headers: IncomingHttpHeaders,
): EnterpriseProxyEvent | undefined {
  const headersResult = headersSchema.parse(headers);
  const contentType = headersResult["content-type"];
  try {
    switch (contentType) {
      case CONTENT_TYPES.JSON:
        return JSON.parse(body);
      case CONTENT_TYPES.URL_ENCODED:
        const params = new URLSearchParams(body);
        // bodySchema is `z.object({ payload: z.string() })`, so wrap the
        // URLSearchParams.get() value (a `string | null`) in that shape
        // before validating; passing the raw string failed schema parsing
        // and broke every valid urlencoded webhook.
        const { payload } = bodySchema.parse({
          payload: params.get("payload"),
        });
        // URLSearchParams.get already URL-decodes the value, so `payload`
        // is already the JSON string sent by GitHub. A second
        // decodeURIComponent would throw URIError on any bare '%' that
        // appears as literal user content (e.g. "30% threshold" in a PR
        // title) and is unnecessary because GitHub webhooks are
        // single-URL-encoded per the form-urlencoded spec.
        return JSON.parse(payload);
    }
  } catch (error) {
    console.error(`Error parsing request body: ${error}`);
    return undefined;
  }
}
