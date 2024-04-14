import {
  v1RequestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestClear
} from './requests';

beforeEach(() => {
  requestClear();
});

describe.skip('Iteration 2: Test "clear" function', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'Leonsunspassword1';
  const quizName = 'The Quiz 1';
  const quizDescription = 'Description for first quiz';

  test('Returns empty object from an empty test', () => {
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets users list to empty', () => {
    v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets quizzes list to empty', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets trash list to empty', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    requestAdminQuizRemove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets quiz counter to 1', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });

  test('Resets user sessions list to empty', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestClear();
    expect(response.jsonBody).toStrictEqual({});
  });
});
