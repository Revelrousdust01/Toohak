import { port, url } from './config.json';
import request, { HttpVerb } from 'sync-request-curl';
import type { QuestionBody, Payload, OldRequestHelperReturnType } from './interfaces';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 10000;

const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: Payload,
  headers: IncomingHttpHeaders = {}
) => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const url = SERVER_URL + path;
  const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS });

  let responseBody;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: unknown) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
      );
    }
    if (err instanceof Error) {
      responseBody = { error: `Failed to parse JSON: '${err.message}'` };
    }
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody.error || responseBody || 'No message specified!';

  // NOTE: the error is rethrown in the test below. This is useful becasuse the
  // test suite will halt (stop) if there's an error, rather than carry on and
  // potentially failing on a different expect statement without useful outputs
  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nHint: Check that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
};

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
const oldRequestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {}
): OldRequestHelperReturnType => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json, timeout: 1000 });
  const bodyString = res.body.toString();
  let bodyObject: OldRequestHelperReturnType;
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

export const v1RequestAdminAuthLogin = (email: string, password: string) => {
  return requestHelper('POST',
    '/v1/admin/auth/login',
    { email: email, password: password });
};

export const v1RequestAdminAuthLogout = (token: string) => {
  return requestHelper('POST',
    '/v1/admin/auth/logout',
    { token: token });
};

export const v2RequestAdminAuthLogout = (token: string) => {
  return requestHelper('POST',
    '/v2/admin/auth/logout',
    { }, { token });
};

export const v1RequestAdminAuthRegister = (email: string, password: string, firstName: string, lastName: string) => {
  return requestHelper('POST',
    '/v1/admin/auth/register',
    { email: email, password: password, nameFirst: firstName, nameLast: lastName });
};

export const v1RequestAdminQuizCreate = (token: string, name:string, description: string) => {
  return requestHelper('POST',
    '/v1/admin/quiz',
    { token: token, name: name, description: description });
};

export const v2RequestAdminQuizCreate = (token: string, name:string, description: string) => {
  return requestHelper('POST',
    '/v2/admin/quiz',
    { name: name, description: description }, { token });
};

export const requestAdminQuizDescriptionUpdate = (token: string, quizid: number, description: string) => {
  return oldRequestHelper('PUT',
    `/v1/admin/quiz/${quizid}/description`,
    { token: token, quizid: quizid, description: description });
};

export const requestAdminQuizInfo = (token: string, quizid: number) => {
  return oldRequestHelper('GET',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const requestAdminQuizList = (token: string) => {
  return oldRequestHelper('GET',
    '/v1/admin/quiz/list',
    { token: token });
};

export const requestAdminQuizNameUpdate = (token: string, quizid: number, newName: string) => {
  return oldRequestHelper('PUT',
    `/v1/admin/quiz/${quizid}/name`,
    { token: token, name: newName });
};

export const requestAdminQuizRemove = (token: string, quizid: number) => {
  return oldRequestHelper('DELETE',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const requestAdminQuizQuestionCreate = (token: string, quizid: number, questionBody: QuestionBody) => {
  return oldRequestHelper('POST',
    `/v1/admin/quiz/${quizid}/question`,
    { token: token, questionBody: questionBody });
};

export const requestAdminQuizQuestionDuplicate = (token: string, quizid: number, questionid: number) => {
  return oldRequestHelper('POST',
    `/v1/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    { token: token });
};

export const requestAdminQuizQuestionDelete = (token: string, quizid: number, questionid: number) => {
  return oldRequestHelper('DELETE',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token });
};

export const requestAdminQuizQuestionUpdate = (token: string, quizid: number, questionid: number, questionBody: QuestionBody) => {
  return oldRequestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token, questionBody: questionBody });
};

export const requestAdminQuizQuestionMove = (token: string, quizid: number, questionid: number, newPosition: number) => {
  return oldRequestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}/move`,
    { token: token, newPosition: newPosition });
};

export const requestAdminQuizTransfer = (token: string, quizid: number, userEmail: string) => {
  return oldRequestHelper('POST',
    `/v1/admin/quiz/${quizid}/transfer`,
    { token: token, userEmail: userEmail });
};

export const requestAdminQuizTrashEmpty = (token: string, quizids: number[]) => {
  return oldRequestHelper('DELETE',
    '/v1/admin/quiz/trash/empty',
    { token: token, quizIds: quizids });
};

export const v1RequestAdminUserDetails = (token: string) => {
  return requestHelper('GET',
    '/v1/admin/user/details',
    { token: token });
};

export const v2RequestAdminUserDetails = (token: string) => {
  return requestHelper('GET',
    '/v2/admin/user/details',
    { }, { token });
};

export const v1RequestAdminUserDetailsUpdate = (token: string, email: string, firstName: string, lastName: string) => {
  return oldRequestHelper('PUT',
    '/v1/admin/user/details',
    { token: token, email: email, nameFirst: firstName, nameLast: lastName });
};

export const v2RequestAdminUserDetailsUpdate = (token: string, email: string, firstName: string, lastName: string) => {
    return requestHelper('PUT',
      '/v2/admin/user/details',
      { email: email, nameFirst: firstName, nameLast: lastName }, { token });
};

export const requestAdminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return oldRequestHelper('PUT',
    '/v1/admin/user/password',
    { token: token, oldPassword: oldPassword, newPassword: newPassword });
};

export const requestAdminQuizRestore = (token: string, quizid: number) => {
  return oldRequestHelper('POST',
  `/v1/admin/quiz/${quizid}/restore`,
  { token: token });
};

export const requestAdminQuizViewTrash = (token: string) => {
  return oldRequestHelper('GET',
    '/v1/admin/quiz/trash',
    { token: token });
};

export const requestClear = () => {
  return oldRequestHelper('DELETE', '/v1/clear');
};
