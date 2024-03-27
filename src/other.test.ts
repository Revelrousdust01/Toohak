import {
  requestAdminAuthRegister, requestAdminAuthLogin,
  requestAdminQuizCreate, requestAdminQuizRemove, requestClear
} from './requests';
import { quizCounter } from './quiz';

beforeEach(() => {
  requestClear();
});

describe('Iteration 2: Test "clear" function', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun';
  const password = 'Leonsunspassword1';
  const quizName = 'Quiz 1';
  const quizDescription = 'Description for first quiz';

  test('Returns empty object from an empty test', () => {
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets users list to empty', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets quizzes list to empty', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets trash list to empty', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    requestAdminQuizRemove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets quiz counter to 1', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
    expect(quizCounter).toStrictEqual(1);
  });

  test('Resets user sessions list to empty', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets everything to empty', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, 'This is quiz 2', quizDescription);
    console.log(newQuiz);
    requestAdminQuizRemove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });
});
