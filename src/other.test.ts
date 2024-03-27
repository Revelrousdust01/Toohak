import {
  requestAdminAuthRegister, requestAdminAuthLogin,
  requestAdminQuizCreate, requestClear
} from './requests';

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
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets quizzes list to empty', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets both quizzes list and users list to empty', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });
});
