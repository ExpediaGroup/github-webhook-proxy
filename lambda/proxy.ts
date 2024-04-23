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

import axios, { AxiosResponse } from "axios";
import { APIGatewayProxyWithLambdaAuthorizerEvent } from "aws-lambda";
import { requestPayloadIsValid } from "./request-payload-is-valid";
import { destinationHostIsAllowed } from "./destination-host-is-allowed";
import { getHttpsAgent } from "./get-https-agent";
import { parseRequestBody } from "./parse-request-body";
import { EnterpriseProxyEvent } from "./types";
import { urlIsValid } from "./url-is-valid";
import { axiosErrorSchema } from "./schema";

export async function handler(
  event: APIGatewayProxyWithLambdaAuthorizerEvent<any>,
) {
  try {
    console.info("Incoming event:", JSON.stringify(event));

    const { body, headers, pathParameters } = event;
    const endpointId = pathParameters?.endpointId;

    if (!endpointId || !body) {
      console.error(
        `EndpointId or body is missing. endpointId: ${endpointId}, body: ${body}`,
      );
      return { statusCode: 404, body: "Not found" };
    }

    const requestPayload: EnterpriseProxyEvent = parseRequestBody(
      body,
      headers,
    );
    const url = decodeURIComponent(endpointId);

    if (
      !urlIsValid(url) ||
      !requestPayloadIsValid(requestPayload) ||
      !destinationHostIsAllowed(url)
    ) {
      return { statusCode: 403, body: "Access denied" };
    }

    // Forward all headers except `Host`
    delete headers["Host"];

    console.info("Forwarding webhook for url:", url);
    const {
      status: statusCode,
      data,
      headers: responseHeaders,
    } = await axios.post(url, body, { headers, httpsAgent: getHttpsAgent() });
    console.info("Request was forwarded successfully!");
    console.info(
      "result",
      JSON.stringify({ statusCode, body: data, headers: responseHeaders }),
    );
    return { statusCode, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    const safeError = axiosErrorSchema.safeParse(error);
    if (safeError.success) {
      console.warn("Request was forwarded but got an error response.");
      const {
        status: statusCode,
        data,
        headers: responseHeaders,
      } = safeError.data.response as AxiosResponse;
      console.warn(
        "result",
        JSON.stringify({ statusCode, body: data, headers: responseHeaders }),
      );
      return {
        statusCode,
        body: JSON.stringify(data),
        headers: responseHeaders,
      };
    }

    console.error("An unknown error occurred.", error);
    return { statusCode: 500, body: `Internal server error: ${error}` };
  }
}
