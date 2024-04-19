import { port, url } from './config.json';
import request, { HttpVerb } from 'sync-request';
import type { QuestionBody, Payload, DataStore } from './interfaces';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';
//import request, { HttpVerb } from 'sync-request-curl';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 15000;

/**
 * This helper function was referenced from lab08_quiz quiz.test.ts:
 * https://nw-syd-gitlab.cseunsw.tech/COMP1531/24T1/students/z5388072/lab08_quiz/-/blob/master/src/quiz.test.ts?ref_type=heads
 */
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

export const v1RequestAdminQuizDescriptionUpdate = (token: string, quizid: number, description: string) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/description`,
    { token: token, description: description });
};

export const v2RequestAdminQuizDescriptionUpdate = (token: string, quizid: number, newDescription: string) => {
  return requestHelper('PUT',
    `/v2/admin/quiz/${quizid}/description`,
    { description: newDescription }, { token });
};

export const v1RequestAdminQuizInfo = (token: string, quizid: number) => {
  return requestHelper('GET',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const v2RequestAdminQuizInfo = (token: string, quizid: number) => {
  return requestHelper('GET',
    `/v2/admin/quiz/${quizid}`,
    { }, { token });
};

export const v1RequestAdminQuizList = (token: string) => {
  return requestHelper('GET',
    '/v1/admin/quiz/list',
    { token: token });
};

export const v2RequestAdminQuizList = (token: string) => {
  return requestHelper('GET',
    '/v2/admin/quiz/list',
    { }, { token });
};

export const v1RequestAdminQuizNameUpdate = (token: string, quizid: number, newName: string) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/name`,
    { token: token, name: newName });
};

export const v2RequestAdminQuizNameUpdate = (token: string, quizid: number, newName: string) => {
  return requestHelper('PUT',
    `/v2/admin/quiz/${quizid}/name`,
    { name: newName }, { token });
};

export const v1RequestAdminQuizRemove = (token: string, quizid: number) => {
  return requestHelper('DELETE',
    `/v1/admin/quiz/${quizid}`,
    { token: token });
};

export const v2RequestAdminQuizRemove = (token: string, quizid: number) => {
  return requestHelper('DELETE',
    `/v2/admin/quiz/${quizid}`,
    { }, { token });
};

export const v1RequestAdminQuizQuestionCreate = (token: string, quizid: number, questionBody: QuestionBody) => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/question`,
    { token: token, questionBody: questionBody });
};

export const v2RequestAdminQuizQuestionCreate = (token: string, quizid: number, questionBody: QuestionBody) => {
  return requestHelper('POST',
    `/v2/admin/quiz/${quizid}/question`,
    { questionBody: questionBody }, { token });
};

export const v1RequestAdminQuizQuestionDuplicate = (token: string, quizid: number, questionid: number) => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    { token: token });
};

export const v2RequestAdminQuizQuestionDuplicate = (token: string, quizid: number, questionid: number) => {
  return requestHelper('POST',
    `/v2/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    { }, { token });
};

export const v1RequestAdminQuizQuestionDelete = (token: string, quizid: number, questionid: number) => {
  return requestHelper('DELETE',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token });
};

export const v2RequestAdminQuizQuestionDelete = (token: string, quizid: number, questionid: number) => {
  return requestHelper('DELETE',
    `/v2/admin/quiz/${quizid}/question/${questionid}`,
    { }, { token });
};

export const v1RequestAdminQuizQuestionUpdate = (token: string, quizid: number, questionid: number, questionBody: QuestionBody) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}`,
    { token: token, questionBody: questionBody });
};

export const v2RequestAdminQuizQuestionUpdate = (token: string, quizid: number, questionid: number, questionBody: QuestionBody) => {
  return requestHelper('PUT',
    `/v2/admin/quiz/${quizid}/question/${questionid}`,
    { questionBody: questionBody }, { token });
};

export const v1RequestAdminQuizQuestionMove = (token: string, quizid: number, questionid: number, newPosition: number) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/question/${questionid}/move`,
    { token: token, newPosition: newPosition });
};

export const v2RequestAdminQuizQuestionMove = (token: string, quizid: number, questionid: number, newPosition: number) => {
  return requestHelper('PUT',
    `/v2/admin/quiz/${quizid}/question/${questionid}/move`,
    { newPosition: newPosition }, { token });
};

export const v1RequestAdminQuizTransfer = (token: string, quizid: number, userEmail: string) => {
  return requestHelper('POST',
    `/v1/admin/quiz/${quizid}/transfer`,
    { token: token, userEmail: userEmail });
};

export const v2RequestAdminQuizTransfer = (token: string, quizid: number, userEmail: string) => {
  return requestHelper('POST',
    `/v2/admin/quiz/${quizid}/transfer`,
    { userEmail: userEmail }, { token });
};

export const v1RequestAdminQuizTrashEmpty = (token: string, quizids: number[]) => {
  return requestHelper('DELETE',
    '/v1/admin/quiz/trash/empty',
    { token: token, quizIds: quizids });
};

export const v2RequestAdminQuizTrashEmpty = (token: string, quizids: number[]) => {
  return requestHelper('DELETE',
    '/v2/admin/quiz/trash/empty',
    { quizIds: quizids }, { token });
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
  return requestHelper('PUT',
    '/v1/admin/user/details',
    { token: token, email: email, nameFirst: firstName, nameLast: lastName });
};

export const v2RequestAdminUserDetailsUpdate = (token: string, email: string, firstName: string, lastName: string) => {
  return requestHelper('PUT',
    '/v2/admin/user/details',
    { email: email, nameFirst: firstName, nameLast: lastName }, { token });
};

export const v1RequestAdminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT',
    '/v1/admin/user/password',
    { token: token, oldPassword: oldPassword, newPassword: newPassword });
};

export const v2RequestAdminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT',
    '/v2/admin/user/password',
    { oldPassword: oldPassword, newPassword: newPassword }, { token });
};

export const v1RequestAdminQuizRestore = (token: string, quizid: number) => {
  return requestHelper('POST',
  `/v1/admin/quiz/${quizid}/restore`,
  { token: token });
};

export const v2RequestAdminQuizRestore = (token: string, quizid: number) => {
  return requestHelper('POST',
    `/v2/admin/quiz/${quizid}/restore`,
    { }, { token });
};

export const v1RequestAdminQuizSession = (token: string, quizid: number, autoStartNum: number) => {
  return requestHelper('POST',
  `/v1/admin/quiz/${quizid}/session/start`,
  { autoStartNum: autoStartNum }, { token });
};

export const v1RequestAdminQuizViewTrash = (token: string) => {
  return requestHelper('GET',
    '/v1/admin/quiz/trash',
    { token: token });
};

export const v2RequestAdminQuizViewTrash = (token: string) => {
  return requestHelper('GET',
    '/v2/admin/quiz/trash',
    { }, { token });
};

export const v1RequestAdminQuizThumbnailUpdate = (token: string, quizid: number, imgUrl: string) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/thumbnail`,
    { imgUrl: imgUrl }, { token });
};

export const v1RequestClear = () => {
  return requestHelper('DELETE', '/v1/clear',
    { });
};

export const v1RequestAdminQuizSessionUpdate = (token: string, quizid: number, sessionid: number, action: string) => {
  return requestHelper('PUT',
    `/v1/admin/quiz/${quizid}/session/${sessionid}`,
    { action: action }, { token });
};

export const v1RequestAdminPlayerJoin = (sessionId: number, name: string) => {
  return requestHelper('POST',
    '/v1/player/join',
    { sessionId: sessionId, name: name });
};

export const v1RequestAdminPlayerSubmission = (playerid: number, questionposition: number, answerIds: number[]) => {
  return requestHelper('PUT',
    `/v1/player/${playerid}/question/${questionposition}/answer`,
    { answerIds: answerIds });
};

export function requestSleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // eslint-ignore-line
  }
}

export const v1RequestAdminViewQuizSessions = (token: string, quizid: number) => {
  return requestHelper('GET',
    `/v1/admin/quiz/${quizid}/sessions`,
    { }, { token });
};


export const requestGetData = () => {
  return requestHelper('GET',
  `/data`,
  { }, { });
}

export const requestSendData = (newData: DataStore) => {
  return requestHelper('PUT',
  `/data`,
  {data: newData }, { });
}