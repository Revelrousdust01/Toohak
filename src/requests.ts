import { port, url } from './config.json';
import request, { HttpVerb } from 'sync-request-curl';

const SERVER_URL = `${url}:${port}`;

interface RequestHelperReturnType {
    statusCode: number;
    jsonBody?: Record<string, string | number>;
    error?: string;
  }

/**
   * Sends a request to the given route and return its results
   *
   * Errors will be returned in the form:
   *  { statusCode: number, error: string }
   *
   * Normal responses will be in the form
   *  { statusCode: number, jsonBody: object }
   *
   * Reference: Week 5 server example: https://nw-syd-gitlab.cseunsw.tech/COMP1531/24T1/week5-server-example/-/blob/master/tests/wrapper.test.ts?ref_type=heads
   */
const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {}
): RequestHelperReturnType => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json, timeout: 100 });
  const bodyString = res.body.toString();
  let bodyObject: RequestHelperReturnType;
  try {
    // Return if valid JSON, in our own custom format
    bodyObject = {
      jsonBody: JSON.parse(bodyString),
      statusCode: res.statusCode,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      bodyObject = {
        error: `\
  Server responded with ${res.statusCode}, but body is not JSON!
  
  GIVEN:
  ${bodyString}.
  
  REASON:
  ${error.message}.
  
  HINT:
  Did you res.json(undefined)?`,
        statusCode: res.statusCode,
      };
    }
  }
  if ('error' in bodyObject) {
    // Return the error in a custom structure for testing later
    return { statusCode: res.statusCode, error: bodyObject.error };
  }
  return bodyObject;
};

export const requestAdminAuthRegister = (email: string, password: string, firstName: string, lastName: string) => {
  return requestHelper('POST',
    '/v1/admin/auth/register',
    { email: email, password: password, nameFirst: firstName, nameLast: lastName });
};
