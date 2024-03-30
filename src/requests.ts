import { port, url } from './config.json';
import request, { HttpVerb } from 'sync-request-curl';
import type { RequestHelperReturnType, QuestionBody } from './interfaces';

const SERVER_URL = `${url}:${port}`;

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
  const res = request(method, SERVER_URL + path, { qs, json, timeout: 1000 });
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

export const requestAdminAuthLogin = (email: string, password: string): RequestHelperReturnType => {
  return requestHelper('POST',
    '/v1/admin/auth/login',
    { email: email, password: password });
};

export const requestAdminAuthLogout = (token: string): RequestHelperReturnType => {
  return requestHelper('POST',
    '/v1/admin/auth/logout',
    { token: token });
};

export const requestAdminAuthRegister = (email: string, password: string, firstName: string, lastName: string): RequestHelperReturnType => {
  return requestHelper('POST',
    '/v1/admin/auth/register',
    { email: email, password: password, nameFirst: firstName, nameLast: lastName });
};

export const requestAdminQuizCreate = (token: string, name:string, description: string): RequestHelperReturnType => {
  return requestHelper('POST',
    '/v1/admin/quiz',
    { token: token, name: name, description: description });
};

export const requestAdminQuizDescriptionUpdate = (token: string, quizid: number, description: string): RequestHelperReturnType => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/description`,
    { token: token, quizid: quizid, description: description });
};

export const requestAdminQuizInfo = (token: string, quizid: number): RequestHelperReturnType => {
  return requestHelper('GET',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const requestAdminQuizList = (token: string): RequestHelperReturnType => {
  return requestHelper('GET',
    '/v1/admin/quiz/list',
    { token: token });
};

export const requestAdminQuizNameUpdate = (token: string, quizid: number, newName: string): RequestHelperReturnType => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/name`,
    { token: token, name: newName });
};

export const requestAdminQuizRemove = (token: string, quizid: number): RequestHelperReturnType => {
  return requestHelper('DELETE',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const requestAdminQuizQuestionCreate = (token: string, quizid: number, questionBody: QuestionBody): RequestHelperReturnType => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/question`,
    { token: token, questionBody: questionBody });
};

export const requestAdminQuizQuestionDuplicate = (token: string, quizid: number, questionid: number): RequestHelperReturnType => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    { token: token });
};

export const requestAdminQuizQuestionDelete = (token: string, quizid: number, questionid: number): RequestHelperReturnType => {
  return requestHelper('DELETE',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token });
};

export const requestAdminQuizQuestionUpdate = (token: string, quizid: number, questionid: number, questionBody: QuestionBody): RequestHelperReturnType => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token, questionBody: questionBody });
};

export const requestAdminQuizQuestionMove = (token: string, quizid: number, questionid: number, newPosition: number): RequestHelperReturnType => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}/move`,
    { token: token, newPosition: newPosition });
};

export const requestAdminQuizTransfer = (token: string, quizid: number, userEmail: string): RequestHelperReturnType => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/transfer`,
    { token: token, userEmail: userEmail });
};

export const requestAdminQuizTrashEmpty = (token: string, quizids: number[]): RequestHelperReturnType => {
  return requestHelper('DELETE',
    '/v1/admin/quiz/trash/empty',
    { token: token, quizIds: quizids });
};

export const requestAdminUserDetails = (token: string): RequestHelperReturnType => {
  return requestHelper('GET',
    '/v1/admin/user/details',
    { token: token });
};

export const requestAdminUserDetailsUpdate = (token: string, email: string, firstName: string, lastName: string): RequestHelperReturnType => {
  return requestHelper('PUT',
    '/v1/admin/user/details',
    { token: token, email: email, nameFirst: firstName, nameLast: lastName });
};

export const requestAdminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string): RequestHelperReturnType => {
  return requestHelper('PUT',
    '/v1/admin/user/password',
    { token: token, oldPassword: oldPassword, newPassword: newPassword });
};

export const requestAdminQuizRestore = (token: string, quizid: number): RequestHelperReturnType => {
  return requestHelper('POST',
  `/v1/admin/quiz/${quizid}/restore`,
  { token: token });
};

export const requestAdminQuizViewTrash = (token: string): RequestHelperReturnType => {
  return requestHelper('GET',
    '/v1/admin/quiz/trash',
    { token: token });
};

export const requestClear = (): RequestHelperReturnType => {
  return requestHelper('DELETE', '/v1/clear');
};
