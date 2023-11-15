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

import { IncomingHttpHeaders } from 'http';
import { parse } from 'query-string';
import { bodySchema, CONTENT_TYPES, headersSchema } from './schema';

export function parseRequestBody(body: string, headers: IncomingHttpHeaders) {
  const headersResult = headersSchema.parse(headers);
  const contentType = headersResult['content-type'] || headersResult['Content-Type'];
  switch (contentType) {
    case CONTENT_TYPES.JSON:
      return JSON.parse(body);
    case CONTENT_TYPES.URL_ENCODED:
      const { payload } = bodySchema.parse(parse(body));
      return JSON.parse(decodeURIComponent(payload));
  }
}
