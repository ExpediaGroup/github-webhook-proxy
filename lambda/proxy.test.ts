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

import { handler } from './proxy';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { Agent } from 'https';
import { readFileFromLayer } from './file-readers';
import { APIGatewayProxyWithLambdaAuthorizerEvent } from 'aws-lambda';
import { VALID_PING_EVENT } from '../fixtures/valid-ping-payload';
import { VALID_PUSH_PAYLOAD } from '../fixtures/valid-push-payload';
import { VALID_PUSH_PAYLOAD_USER_REPO } from '../fixtures/valid-push-payload-user-repo';
const urlencodedPayload = readFileSync('fixtures/invalid-payload-urlencoded.txt').toString();

jest.mock('axios');
jest.mock('./file-readers');
const axiosResponse: AxiosResponse = {
  status: 200,
  data: {
    some: 'data'
  },
  headers: {
    response: 'headers'
  },
  statusText: 'status',
  config: {
    headers: {} as AxiosRequestHeaders
  }
};
(axios.post as jest.Mock).mockResolvedValue(axiosResponse);
const expectedResponseObject = {
  statusCode: 200,
  body: '{"some":"data"}',
  headers: { response: 'headers' }
};
const stringifiedPayload = JSON.stringify(VALID_PUSH_PAYLOAD);
const baseEvent: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
  body: stringifiedPayload,
  headers: {
    Accept: '*/*',
    'content-type': 'application/json',
    Host: 'some-api.us-west-2.amazonaws.com'
  },
  pathParameters: {
    endpointId: encodeURIComponent('https://approved.host/github-webhook/')
  },
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '',
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  stageVariables: {},
  requestContext: {} as any,
  resource: ''
};
const fileMap: Record<string, string> = {
  'allowed-destination-hosts.json': JSON.stringify(['approved.host', 'another.approved.host'])
};
(readFileFromLayer as jest.Mock).mockImplementation((fileName: string) => fileMap[fileName]);

describe('proxy', () => {
  beforeEach(() => {
    process.env.ENTERPRISE_SLUG = 'some_enterprise';
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX = '';
  });

  it('should reject a request with an invalid urlencoded payload', async () => {
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      headers: {
        ...baseEvent.headers,
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: urlencodedPayload
    };
    const result = await handler(event);
    expect(result).toEqual({ statusCode: 403, body: 'Access denied' });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should reject a request with an endpointId which is not an encoded URL', async () => {
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      pathParameters: {
        endpointId: 'some-invalid-endpoint'
      }
    };
    const result = await handler(event);
    expect(result).toEqual({ statusCode: 403, body: 'Access denied' });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should allow a request from a managed user suffix when supplied', async () => {
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX = 'suffix';
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      body: JSON.stringify(VALID_PUSH_PAYLOAD_USER_REPO),
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual(expectedResponseObject);
    expect(axios.post).toHaveBeenCalled();
  });

  it('should forward a request when header is Content-Type', async () => {
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      headers: {
        ...baseEvent.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(VALID_PUSH_PAYLOAD),
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual(expectedResponseObject);
    expect(axios.post).toHaveBeenCalled();
  });

  it('should not forward a request that does not come from an enterprise or managed user suffix', async () => {
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const payload = {
      ...VALID_PUSH_PAYLOAD,
      enterprise: undefined
    };
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      body: JSON.stringify(payload),
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual({ statusCode: 403, body: 'Access denied' });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should not forward a request that does not have an approved host', async () => {
    const destinationUrl = 'https://not-an-approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual({ statusCode: 403, body: 'Access denied' });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should forward a request from an enterprise and github org without supplied certs', async () => {
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(axios.post).toHaveBeenCalledWith(destinationUrl, stringifiedPayload, {
      headers: {
        Accept: '*/*',
        'content-type': 'application/json'
      }
    });
    expect(result).toEqual(expectedResponseObject);
  });

  it('should forward a request from an enterprise and github org with supplied certs', async () => {
    const newFileMap: Record<string, string> = {
      ...fileMap,
      'ca.pem': 'some ca',
      'cert.pem': 'some cert'
    };
    (readFileFromLayer as jest.Mock).mockImplementation((fileName: string) => newFileMap[fileName]);
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(axios.post).toHaveBeenCalledWith(destinationUrl, stringifiedPayload, {
      headers: {
        Accept: '*/*',
        'content-type': 'application/json'
      },
      httpsAgent: expect.any(Agent)
    });
    expect(result).toEqual(expectedResponseObject);
  });

  it('should return a 404 when no endpointId is found', async () => {
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      pathParameters: {}
    };
    const result = await handler(event);
    expect(result).toEqual({ statusCode: 404, body: 'Not found' });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should forward a ping event from a managed user suffix when supplied', async () => {
    process.env.ENTERPRISE_MANAGED_USER_SUFFIX = 'suffix';
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      body: JSON.stringify(VALID_PING_EVENT),
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual(expectedResponseObject);
    expect(axios.post).toHaveBeenCalled();
  });

  it('should return error response from axios', async () => {
    const axiosErrorResponse: AxiosResponse = {
      status: 400,
      data: {
        some: 'error'
      },
      headers: {
        response: 'headers'
      },
      statusText: 'bad request',
      config: {
        headers: {} as AxiosRequestHeaders
      }
    };
    (axios.post as jest.Mock).mockRejectedValue({ response: axiosErrorResponse });

    process.env.ENTERPRISE_MANAGED_USER_SUFFIX = 'suffix';
    const destinationUrl = 'https://approved.host/github-webhook/';
    const endpointId = encodeURIComponent(destinationUrl);
    const event: APIGatewayProxyWithLambdaAuthorizerEvent<any> = {
      ...baseEvent,
      body: JSON.stringify(VALID_PUSH_PAYLOAD_USER_REPO),
      pathParameters: {
        endpointId
      }
    };
    const result = await handler(event);
    expect(result).toEqual({
      statusCode: 400,
      body: '{"some":"error"}',
      headers: { response: 'headers' }
    });
    expect(axios.post).toHaveBeenCalled();
  });
});
