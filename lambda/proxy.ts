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

import axios from 'axios';
import { APIGatewayProxyWithLambdaAuthorizerEvent } from 'aws-lambda';
import { requestPayloadIsValid } from './request-payload-is-valid';
import { destinationHostIsAllowed } from './destination-host-is-allowed';
import { getHttpsAgent } from './get-https-agent';
import { parseRequestBody } from './parse-request-body';
import { EnterpriseProxyEvent } from './types';
import { isValidUrl } from './is-valid-url';

export async function handler(event: APIGatewayProxyWithLambdaAuthorizerEvent<any>) {
  try {
    console.log('Incoming event:', JSON.stringify(event));

    const {
      body,
      headers,
      pathParameters: { endpointId }
    } = event;

    if (!endpointId || !body) {
      return { statusCode: 404, body: 'Not found' };
    }

    const requestPayload: EnterpriseProxyEvent = parseRequestBody(body, headers);
    const url = decodeURIComponent(endpointId);

    if (!isValidUrl(url) || !requestPayloadIsValid(requestPayload) || !destinationHostIsAllowed(url)) {
      return { statusCode: 403, body: 'Access denied' };
    }

    // Forward all headers except `Host`
    delete headers['Host'];

    console.log('Forwarding webhook for url:', url);
    const {
      status: statusCode,
      data,
      headers: responseHeaders
    } = await axios.post(url, body, { headers, httpsAgent: getHttpsAgent() });
    console.log('result', JSON.stringify({ statusCode, body: data, headers: responseHeaders }));
    return { statusCode, body: JSON.stringify(data), headers: responseHeaders };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Internal server error' };
  }
}
