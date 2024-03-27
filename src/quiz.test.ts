import {
  requestAdminAuthLogin, requestAdminAuthRegister,
  requestAdminQuizCreate, requestAdminQuizNameUpdate, requestAdminQuizRemove, requestClear
} from './requests';
import { ErrorObject } from './interfaces';

beforeEach(() => {
  requestClear();
});

const ERROR: ErrorObject = { error: expect.any(String) };

// adminQuizCreate
describe('Test adminQuizCreate', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    expect(newQuiz.jsonBody).toMatchObject({ quizId: expect.any(Number) });
    expect(newQuiz.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(invalidToken, quizName, quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidCharacter: '`' },
    { invalidCharacter: '~' },
    { invalidCharacter: '+' },
    { invalidCharacter: '_' },
    { invalidCharacter: '=' },
    { invalidCharacter: '*' },
    { invalidCharacter: '/' }
  ])("Quiz name contains unwanted character: '$invalidCharacter'", ({ invalidCharacter }) => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, invalidCharacter, quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, shortQuizName, quizDescription);
    requestAdminAuthRegister(email, password, lastName, firstName);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Quiz name is greater than 30 characters', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, 'a'.repeat(31), quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Name is already used', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Description is too long', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, quizName, 'a'.repeat(101));
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });
});

// adminQuizDescriptionUpdate
describe.skip('Test adminQuizDescriptionUpdate', () => {
  // const nameFirst = 'Leon';
  // const nameLast = 'Sun';
  // const email = 'leonsun@gmail.com';
  // const password = 'qwer88888888';
  // const quizName = 'Quiz 1 Name';
  // const quizDescription = 'This is the first new quiz';
  // const newQuizDescription = 'New Quiz 1 description';

  test('working input, 0 errors expected', () => {
    // const admin = adminAuthRegister(email, password, nameFirst, nameLast);
    // const quiz1 = adminQuizCreate(admin.authUserId, quizName, quizDescription);
    // expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, newQuizDescription)).toStrictEqual({});
  });

  test('authUserId is not valid', () => {
    // const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
    // const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
    // expect(adminQuizDescriptionUpdate(-1, quiz1.quizId,
    //   'This is the new description for the first test quiz')).toStrictEqual(ERROR);
  });

  test.each([
    { invalidId: '-1' },
    { invalidId: 'a' },
    { invalidId: '/' },
  ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
    // const admin = adminAuthRegister(email, password, nameFirst, nameLast);
    // const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
    // expect(adminQuizDescriptionUpdate(invalidId, newQuiz.quizId, newQuizDescription)).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: '-1' },
    { invalidQuizId: 'a' },
    { invalidQuizId: '/' },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    // const admin = adminAuthRegister(email, password, nameFirst, nameLast);
    // adminQuizCreate(admin.authUserId, quizName, quizDescription);
    // expect(adminQuizDescriptionUpdate(admin.authUserId, invalidQuizId, newQuizDescription)).toStrictEqual(ERROR);
  });

  test('quizId does not refer to a quiz that this user owns', () => {
    // const admin = adminAuthRegister(email, password, nameFirst, nameLast);
    // const otherAdmin = adminAuthRegister('johndoe@gmail.com', 'johndoespassword', 'John', 'Doe');
    // const quizId = adminQuizCreate(otherAdmin.authUserId, quizName, quizDescription);
    // expect(adminQuizDescriptionUpdate(admin.authUserId, quizId, newQuizDescription)).toStrictEqual(ERROR);
  });

  test('Description length is greater than 100 characters', () => {
    // const admin = adminAuthRegister(email, password, nameFirst, nameLast);
    // const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
    // expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, 'A'.repeat(999))).toStrictEqual(ERROR);
  });
});

// adminQuizRemove
describe('Test adminQuizRemove', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const login = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizRemove(login.jsonBody.token as string, quizId.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const login = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizRemove(invalidToken, quizId.jsonBody.quizid as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const response = requestAdminQuizRemove(login.jsonBody.token as string, invalidQuizId);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const login1 = requestAdminAuthLogin('bob.smith@gmail.com', 'a1234567');
    const response = requestAdminQuizRemove(login1.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizInfo
describe.skip('Test adminQuizInfo', () => {
  // const firstName = 'Jeffery';
  // const lastName = 'Zhang';
  // const email = 'jeffery.zhang385@gmail.com';
  // const password = 'str0ngpassword';
  // const quizName = 'New Quiz';
  // const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    // const admin = adminAuthRegister(email, password, lastName, firstName);
    // const quizCreate = adminQuizCreate(admin.authUserId, quizName, quizDescription);
    // expect(adminQuizInfo(admin.authUserId, quizCreate.quizId)).toStrictEqual(
    //   {
    //     quizId: quizCreate.quizId,
    //     name: quizName,
    //     timeCreated: expect.any(Number),
    //     timeLastEdited: expect.any(Number),
    //     description: quizDescription,
    //   });
  });

  test.each([
    { invalidId: '-1' },
    { invalidId: 'a' },
    { invalidId: '/' },
  ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
    // const admin = adminAuthRegister(email, password, lastName, firstName);
    // const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
    // expect(adminQuizInfo(invalidId, quizId)).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: '-1' },
    { invalidQuizId: 'a' },
    { invalidQuizId: '/' },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    // const admin = adminAuthRegister(email, password, lastName, firstName);
    // expect(adminQuizInfo(admin.authUserId, invalidQuizId)).toStrictEqual(ERROR);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    // const admin = adminAuthRegister(email, password, lastName, firstName);
    // const admin1 = adminAuthRegister('bob.smith@gmail.com', '1234', 'Smith', 'Bob');
    // const quizId = adminQuizCreate(admin1.authUserId, quizName, quizDescription);
    // expect(adminQuizInfo(admin.authUserId, quizId)).toStrictEqual(ERROR);
  });
});

// adminQuizList
describe.skip('adminQuizList', () => {
  // const firstName = 'Samuel';
  // const lastName = 'Huang';
  // const email = 'shuang@student.unsw.edu.au';
  // const password = 'a1b2c3d4e5f6';

  test('One quiz in quizlist', () => {
    // const UserId = adminAuthRegister(email, password, firstName, lastName);
    // const quizId1 = adminQuizCreate(UserId.authUserId, 'How to train your dragon',
    //   'Quiz about the movie trivia of How to Train your dragon');
    // expect(adminQuizList(UserId.authUserId)).toStrictEqual({
    //   quizzes: [
    //     {
    //       quizId: quizId1.quizId,
    //       name: 'How to train your dragon'
    //     }
    //   ]
    // });
  });

  test('Multiple quiz in quizlist', () => {
    // const UserId = adminAuthRegister(email, password, firstName, lastName);
    // const quizId1 = adminQuizCreate(UserId.authUserId, 'How to train your dragon',
    //   'Quiz about the movie trivia of How to Train your dragon');
    // const quizId2 = adminQuizCreate(UserId.authUserId, 'Age of Adeline',
    //   'Quiz about the movie trivia of Age of Adeline');
    // const quizId3 = adminQuizCreate(UserId.authUserId, 'Kung Fu Panda',
    //   'Quiz about the movie trivia of Kung Fu Panda');
    // expect(adminQuizList(UserId.authUserId)).toStrictEqual({
    //   quizzes: [
    //     {
    //       quizId: quizId1.quizId,
    //       name: 'How to train your dragon'
    //     },
    //     {
    //       quizId: quizId2.quizId,
    //       name: 'Age of Adeline'
    //     },
    //     {
    //       quizId: quizId3.quizId,
    //       name: 'Kung Fu Panda'
    //     }
    //   ]
    // });
  });

  test('No quiz in quizlist', () => {
    // const UserId = adminAuthRegister(email, password, firstName, lastName);
    // expect(adminQuizList(UserId.authUserId)).toStrictEqual({
    //   quizzes: []
    // });
  });

  test.each([
    { invalidId: '-1' },
    { invalidId: 'a' },
    { invalidId: '/' },
  ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
    // const admin = adminAuthRegister(email, password, lastName, firstName);
    // adminQuizCreate(admin.authUserId, 'QuizName', 'QuizDescription');
    // expect(adminQuizList(invalidId)).toStrictEqual(ERROR);
  });
});

// adminQuizNameUpdate
describe.only('Test adminQuizNameUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizName = 'New Quiz 1 Name';

  test('Working input, 0 errors expected', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    console.log(newQuiz);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(invalidToken, newQuiz.jsonBody.quizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: $invalidQuizId", ({ invalidQuizId }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, invalidQuizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const user2 = requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizNameUpdate(user2.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test.each([
    { invalidCharacter: '`' },
    { invalidCharacter: '~' },
    { invalidCharacter: '+' },
    { invalidCharacter: '_' },
    { invalidCharacter: '=' },
    { invalidCharacter: '*' },
    { invalidCharacter: '/' }
  ])("Quiz name contains invalid character(s): $invalidCharacter'", ({ invalidCharacter }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const invalidQuizName = quizName + invalidCharacter;
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: $shortQuizName'", ({ shortQuizName }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, shortQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Quiz name is greater than 30 characters', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, 'A'.repeat(31));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);  
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuiz2 = requestAdminQuizCreate(user.jsonBody.token as string, 'Quiz 2', 'This is the second test quiz');
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz2.jsonBody.quizId as number, quizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);  
  });
});