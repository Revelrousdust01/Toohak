import {
  v1RequestAdminAuthRegister, v1RequestAdminQuizCreate, v2RequestAdminQuizCreate,
  requestAdminQuizViewTrash, requestAdminQuizRestore, requestAdminQuizDescriptionUpdate,
  v1RequestAdminQuizList, v2RequestAdminQuizList, requestAdminQuizNameUpdate, requestAdminQuizRemove,
  v1RequestAdminQuizQuestionCreate, v2RequestAdminQuizQuestionCreate, requestAdminQuizQuestionMove, requestAdminQuizQuestionUpdate,
  v1RequestAdminQuizTransfer, v2RequestAdminQuizTransfer, requestAdminQuizTrashEmpty, requestAdminQuizQuestionDuplicate,
  requestAdminQuizInfo, requestAdminQuizQuestionDelete, requestClear, v1RequestAdminQuizSession
} from './requests';
import { ErrorObject, QuestionBody } from './interfaces';
import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

const ERROR: ErrorObject = { error: expect.any(String) };

// adminQuizCreate
describe('V1 - Test adminQuizCreate', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription)).toMatchObject({ quizId: expect.any(Number) });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizCreate(invalidToken, quizName, quizDescription)).toThrow(HTTPError[401]);
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
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizCreate(registered.token as string, invalidCharacter, quizDescription)).toThrow(HTTPError[400]);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizCreate(registered.token as string, shortQuizName, quizDescription)).toThrow(HTTPError[400]);
  });

  test('Quiz name is greater than 30 characters', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizCreate(registered.token as string, 'a'.repeat(31), quizDescription)).toThrow(HTTPError[400]);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription)).toThrow(HTTPError[400]);
  });

  test('Description is too long', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizCreate(registered.token as string, quizName, 'a'.repeat(101))).toThrow(HTTPError[400]);
  });
});

describe('V2 - Test adminQuizCreate', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription)).toMatchObject({ quizId: expect.any(Number) });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizCreate(invalidToken, quizName, quizDescription)).toThrow(HTTPError[401]);
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
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizCreate(registered.token as string, invalidCharacter, quizDescription)).toThrow(HTTPError[400]);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizCreate(registered.token as string, shortQuizName, quizDescription)).toThrow(HTTPError[400]);
  });

  test('Quiz name is greater than 30 characters', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizCreate(registered.token as string, 'a'.repeat(31), quizDescription)).toThrow(HTTPError[400]);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription)).toThrow(HTTPError[400]);
  });

  test('Description is too long', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizCreate(registered.token as string, quizName, 'a'.repeat(101))).toThrow(HTTPError[400]);
  });
});

// adminQuizDescriptionUpdate
describe.skip('Test adminQuizDescriptionUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizDescription = 'New Quiz 1 description';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(invalidToken, newQuiz.jsonBody.quizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(user.jsonBody.token as string, invalidQuizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizDescriptionUpdate(user2.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('Quiz description is greater than 100 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, 'A'.repeat(101));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });
});

// adminQuizRemove
describe.skip('Test adminQuizRemove', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizRemove(registered.jsonBody.token as string, quizId.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizRemove(invalidToken, quizId.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestAdminQuizRemove(registered.jsonBody.token as string, invalidQuizId);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizRemove(registered1.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizInfo
describe.skip('Test adminQuizInfo', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.jsonBody.token as string, quizId.jsonBody.quizId as number, question);
    const response = requestAdminQuizInfo(registered.jsonBody.token as string, quizId.jsonBody.quizId as number);
    expect(response.jsonBody).toMatchObject({
      quizId: quizId.jsonBody.quizId as number,
      name: quizName,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: quizDescription,
      numQuestions: expect.any(Number),
      questions: [
        {
          questionId: questionId.jsonBody.questionId as number,
          question: 'Who is the Monarch of England?',
          duration: 1,
          points: 5,
          answers: [
            {
              answerId: expect.any(Number),
              answer: 'Prince Charles',
              colour: expect.any(String),
              correct: true
            },
            {
              answerId: expect.any(Number),
              answer: 'Prince Charless',
              colour: expect.any(String),
              correct: false
            }
          ]
        }
      ],
      duration: expect.any(Number),
    });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizInfo(invalidToken, quizId.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestAdminQuizInfo(registered.jsonBody.token as string, invalidQuizId);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizInfo(registered1.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizList
describe('V1 - Test adminQuizList', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'How to train your dragon';
  const quizDescription = 'Quiz about the movie trivia of How to Train your dragon';

  test('One quiz in quizlist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    expect(v1RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        }
      ]
    });
  });

  test('Multiple quiz in quizlist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quizId1 = v1RequestAdminQuizCreate(register.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    expect(v1RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        },
        {
          quizId: quizId1.quizId as number,
          name: 'Age of Adeline'
        }
      ]
    });
  });

  test('Multiple quizzes with one quiz in trash', () => {
    const register = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quizId1 = v1RequestAdminQuizCreate(register.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    requestAdminQuizRemove(register.token as string, quizId1.quizId as number);
    expect(v1RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        }
      ]
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    expect(() => v1RequestAdminQuizList(invalidToken)).toThrow(HTTPError[401]);
  });
});

describe('V2 - Test adminQuizList', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'How to train your dragon';
  const quizDescription = 'Quiz about the movie trivia of How to Train your dragon';

  test('One quiz in quizlist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    expect(v2RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        }
      ]
    });
  });

  test('Multiple quiz in quizlist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quizId1 = v2RequestAdminQuizCreate(register.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    expect(v2RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        },
        {
          quizId: quizId1.quizId as number,
          name: 'Age of Adeline'
        }
      ]
    });
  });

  test('Multiple quizzes with one quiz in trash', () => {
    const register = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quizId1 = v2RequestAdminQuizCreate(register.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    requestAdminQuizRemove(register.token as string, quizId1.quizId as number);
    expect(v2RequestAdminQuizList(register.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: quizName
        }
      ]
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    expect(() => v2RequestAdminQuizList(invalidToken)).toThrow(HTTPError[401]);
  });
});

// adminQuizNameUpdate
describe.skip('Test adminQuizNameUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizName = 'New Quiz 1 Name';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
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
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(invalidToken, newQuiz.jsonBody.quizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, invalidQuizId as number, newQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
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
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const invalidQuizName = quizName + invalidCharacter;
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: $shortQuizName'", ({ shortQuizName }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, shortQuizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Quiz name is greater than 30 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, 'A'.repeat(31));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuiz2 = v1RequestAdminQuizCreate(user.jsonBody.token as string, 'Quiz 2', 'This is the second test quiz');
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz2.jsonBody.quizId as number, quizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });
});

// adminQuizRestore
describe.skip('adminQuizRestore', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const firstName2 = 'Paul';
  const lastName2 = 'Atreides';
  const email2 = 'sonofarrakis@student.unsw.edu.au';
  const quizName1 = 'lebron my glorious king';
  const quizName2 = 'jo mama';
  const quizDescr1 = 'quiz about my glorious king';
  const quizDescr2 = 'quiz about my mummy';

  test('Valid inputs with one quiz restore', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId.jsonBody.quizId as number);
    const response1 = requestAdminQuizViewTrash(user.jsonBody.token as string);
    expect(response1.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId.jsonBody.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
    expect(response1.statusCode).toStrictEqual(200);
    const response2 = requestAdminQuizRestore(user.jsonBody.token as string,
      quizId.jsonBody.quizId as number);
    expect(response2.jsonBody).toStrictEqual({ });
    expect(response2.statusCode).toStrictEqual(200);
    const response3 = requestAdminQuizViewTrash(user.jsonBody.token as string);
    expect(response3.jsonBody).toMatchObject({
      quizzes: [

      ]
    });
    expect(response3.statusCode).toStrictEqual(200);
  });

  test('Valid inputs with two quiz restores', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    const quizId2 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName2, quizDescr2);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId2.jsonBody.quizId as number);
    const response1 = requestAdminQuizRestore(user.jsonBody.token as string,
      quizId1.jsonBody.quizId as number);
    const response2 = requestAdminQuizRestore(user.jsonBody.token as string,
      quizId2.jsonBody.quizId as number);
    expect(response1.jsonBody).toStrictEqual({ });
    expect(response2.jsonBody).toStrictEqual({ });
    expect(response1.statusCode).toStrictEqual(200);
    expect(response2.statusCode).toStrictEqual(200);
    const response3 = requestAdminQuizViewTrash(user.jsonBody.token as string);
    expect(response3.jsonBody).toMatchObject({
      quizzes: [

      ]
    });
    expect(response3.statusCode).toStrictEqual(200);
  });

  test('Quiz name of the restored quiz is already used by another active quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    const response = requestAdminQuizRestore(user.jsonBody.token as string,
      quizId1.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Quiz ID refers to a quiz that is not currently in the trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    const response = requestAdminQuizRestore(user.jsonBody.token as string,
      quizId1.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const response = requestAdminQuizRestore(invalidToken, quizId1.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const response = requestAdminQuizRestore(user.jsonBody.token as string, invalidQuizId);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const user2 = v1RequestAdminAuthRegister(email2, password, firstName2, lastName2);
    const response = requestAdminQuizRestore(user2.jsonBody.token as string,
      quizId1.jsonBody.quizId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizQuestionCreate
describe('V1 - Test adminQuizQuestionCreate', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question)).toStrictEqual({ questionId: expect.any(Number) });
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, question: questionString };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    {
      invalidAnswers: [{ answer: 'A', correct: true },
        { answer: 'B', correct: false },
        { answer: 'C', correct: false },
        { answer: 'D', correct: false },
        { answer: 'E', correct: false },
        { answer: 'F', correct: false },
        { answer: 'G', correct: false }]
    },
    { invalidAnswers: [{ answer: 'A', correct: true }] },
  ])("Question has more than 6 answers or less than 2 answers: $invalidAnswers'", ({ invalidAnswers }) => {
    const invalidQuestion = { ...question, answers: invalidAnswers };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...question, duration: -1 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...question, duration: 150 };
    const question2 = { ...question, duration: 151 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question1);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question2)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...question, points: invalidPoints };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    { questionString: '' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }, { answer: 'Cool', correct: true }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }, { answer: 'B', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(invalidToken, newQuiz.quizId as number, question)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizQuestionCreate(user.token as string, invalidQuizId, question)).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizQuestionCreate', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question)).toStrictEqual({ questionId: expect.any(Number) });
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, question: questionString };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    {
      invalidAnswers: [{ answer: 'A', correct: true },
        { answer: 'B', correct: false },
        { answer: 'C', correct: false },
        { answer: 'D', correct: false },
        { answer: 'E', correct: false },
        { answer: 'F', correct: false },
        { answer: 'G', correct: false }]
    },
    { invalidAnswers: [{ answer: 'A', correct: true }] },
  ])("Question has more than 6 answers or less than 2 answers: $invalidAnswers'", ({ invalidAnswers }) => {
    const invalidQuestion = { ...question, answers: invalidAnswers };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...question, duration: -1 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...question, duration: 150 };
    const question2 = { ...question, duration: 151 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question1);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question2)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...question, points: invalidPoints };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    { questionString: '' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }, { answer: 'Cool', correct: true }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }, { answer: 'B', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(invalidToken, newQuiz.quizId as number, question)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, invalidQuizId, question)).toThrow(HTTPError[403]);
  });

  test.each([
    { invalidUrl: '' },
    { invalidUrl: 'http://google.com/some/image/' },
    { invalidUrl: 'google.com/some/image/path.jpg' },
  ])("Invalid Url: '$invalidUrl'", ({ invalidUrl }) => {
    const invalidQuestion = { ...question, thumbnailUrl: invalidUrl };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, invalidQuestion)).toThrow(HTTPError[400]);
  });
});

// adminQuizQuestionDuplicate
describe.skip('adminQuizQuestionDuplicate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'lebron my glorious king';
  const quizName2 = 'Jo mama';
  const quizDescr = 'quiz about my glorious king';
  const quizDescr2 = 'quiz about my mummy';
  const question1: QuestionBody = {
    question: 'Who is the glorious king?',
    duration: 5,
    points: 5,
    answers: [
      {
        answer: 'King Charles',
        correct: false
      },
      {
        answer: 'Lebron James',
        correct: true
      }
    ]
  };
  const question2: QuestionBody = {
    question: 'Who is Jo mama?',
    duration: 5,
    points: 5,
    answers: [
      {
        answer: 'Jo mum',
        correct: true
      },
      {
        answer: 'your mum',
        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescr);
    const question = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz.jsonBody.quizId as number, question1);
    const response = requestAdminQuizQuestionDuplicate(
      user.jsonBody.token as string, quiz.jsonBody.quizId as number, question.jsonBody.questionId as number);
    expect(response.jsonBody).toStrictEqual({ newQuestionId: expect.any(Number) });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescr);
    const quiz2 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName2, quizDescr2);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz.jsonBody.quizId as number, question1);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz2.jsonBody.quizId as number, question2);
    const questionsecond = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz2.jsonBody.quizId as number, question1);
    const response = requestAdminQuizQuestionDuplicate(user.jsonBody.token as string,
      quiz.jsonBody.quizId as number, questionsecond.jsonBody.questionId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescr);
    const question = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz.jsonBody.quizId as number, question1);
    const response = requestAdminQuizQuestionDuplicate(
      invalidToken, quiz.jsonBody.quizId as number, question.jsonBody.questionId as number);
    expect(response.statusCode).toStrictEqual(401);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescr);
    const question = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      newQuiz.jsonBody.quizId as number, question1);
    const response = requestAdminQuizQuestionDuplicate(user.jsonBody.token as string,
      invalidQuizId, question.jsonBody.questionId as number);
    expect(response.statusCode).toStrictEqual(403);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('QuizId does not refer to a quiz that this use owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescr);
    const question = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string,
      quiz.jsonBody.quizId as number, question1);
    const user2 = v1RequestAdminAuthRegister('cpolitis@student.unsw.edu.au',
      'ab123bweofljj4', 'Chris', 'Poopy');
    const response = requestAdminQuizQuestionDuplicate(user2.jsonBody.token as string,
      quiz.jsonBody.quizId as number, question.jsonBody.questionId as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizQuestionDelete
describe.skip('Test adminQuizQuestionDelete', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 150,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',

        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionDelete(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number);
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionDelete(invalidToken, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number);
    expect(response.statusCode).toStrictEqual(401);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionDelete(user.jsonBody.token as string, invalidQuizId, newQuestion.jsonBody.questionId as number);
    expect(response.statusCode).toStrictEqual(403);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: 0 },
    { invalidQuestionId: 150 },
  ])("Question ID is invalid or user does not own the quiz '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionDelete(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestionId);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });
});

// adminQuizQuestionUpdate
describe.skip('Test adminQuizQuestionUpdate', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 150,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  const updatedQuestion: QuestionBody = {
    question: 'Who is the Real Monarch of England?',
    duration: 2,
    points: 4,
    answers: [
      {
        answer: 'Prince Charless',
        correct: false
      },
      {
        answer: 'Prince Charlez',
        correct: true
      }
    ]
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, updatedQuestion);
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...updatedQuestion, question: questionString };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    {
      invalidAnswers: [{ answer: 'A', correct: true },
        { answer: 'B', correct: false },
        { answer: 'C', correct: false },
        { answer: 'D', correct: false },
        { answer: 'E', correct: false },
        { answer: 'F', correct: false },
        { answer: 'G', correct: false }]
    },
    { invalidAnswers: [{ answer: 'A', correct: true }] },
  ])("Question has more than 6 answers or less than 2 answers: $invalidAnswers'", ({ invalidAnswers }) => {
    const invalidQuestion = { ...updatedQuestion, answers: invalidAnswers };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...updatedQuestion, duration: -1 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...updatedQuestion, duration: 250 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, question1);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...updatedQuestion, points: invalidPoints };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { questionString: '' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }, { answer: 'Cool', correct: true }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...updatedQuestion, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }, { answer: 'B', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(invalidToken, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, updatedQuestion);
    expect(response.statusCode).toStrictEqual(401);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, invalidQuizId, newQuestion.jsonBody.questionId as number, updatedQuestion);
    expect(response.statusCode).toStrictEqual(403);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: 0 },
    { invalidQuestionId: 150 },
  ])("Question ID is invalid or user does not own the quiz '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestionId, updatedQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });
});

// adminQuizQuestionMove
describe.skip('Test adminQuizQuestionMove', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 150,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  const updatedQuestion: QuestionBody = {
    question: 'Who is the Real Monarch of England?',
    duration: 2,
    points: 4,
    answers: [
      {
        answer: 'Prince Charless',
        correct: false
      },
      {
        answer: 'Prince Charlez',
        correct: true
      }
    ]
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, updatedQuestion);
    const response = requestAdminQuizQuestionMove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, 1);
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: 0 },
    { invalidQuestionId: 150 },
  ])("Question ID is invalid or user does not own the quiz '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionMove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestionId, 1);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidNewPosition: -1 },
    { invalidNewPosition: 9999999 },
    { invalidNewPosition: 0 }
  ])("New position is invalid: '$invalidNewPosition'", ({ invalidNewPosition }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, updatedQuestion);
    const response = requestAdminQuizQuestionMove(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, invalidNewPosition);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, updatedQuestion);
    const response = requestAdminQuizQuestionMove(invalidToken, newQuiz.jsonBody.quizId as number, newQuestion.jsonBody.questionId as number, 1);
    expect(response.statusCode).toStrictEqual(401);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, updatedQuestion);
    const response = requestAdminQuizQuestionMove(user.jsonBody.token as string, invalidQuizId, newQuestion.jsonBody.questionId as number, 1);
    expect(response.statusCode).toStrictEqual(403);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });
});

// adminQuizTransfer
describe('V1 - Test adminQuizTransfer', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(v1RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toStrictEqual({});
  });

  test('userEmail is not a real user', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[400]);
  });

  test('userEmail is the current logged in user', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, email)).toThrow(HTTPError[400]);
  });

  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const registered = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    v1RequestAdminQuizCreate(registered.token as string, quizName, 'Bobs New Quiz');
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered1.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizTransfer(registered1.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizTransfer(invalidToken, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizTransfer(registered.token as string, invalidQuizId, 'bob.smith@gmail.com')).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz1 = v1RequestAdminQuizCreate(registered1.token as string, 'Cool Quiz', 'This is a cool quiz');
    const registered2 = v1RequestAdminAuthRegister('john.wick@gmail.com', '1234567a', 'Wick', 'John');
    expect(() => v1RequestAdminQuizTransfer(registered2.token as string,
        newQuiz1.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizTransfer', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(v2RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toStrictEqual({});
  });

  test('userEmail is not a real user', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[400]);
  });
  test('userEmail is the current logged in user', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizTransfer(registered.token as string, quizId.quizId as number, email)).toThrow(HTTPError[400]);
  });

  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const registered = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    v2RequestAdminQuizCreate(registered.token as string, quizName, 'Bobs New Quiz');
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered1.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizTransfer(registered1.token as string, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizTransfer(invalidToken, quizId.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizTransfer(registered.token as string, invalidQuizId, 'bob.smith@gmail.com')).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz1 = v2RequestAdminQuizCreate(registered1.token as string, 'Cool Quiz', 'This is a cool quiz');
    const registered2 = v1RequestAdminAuthRegister('john.wick@gmail.com', '1234567a', 'Wick', 'John');
    expect(() => v2RequestAdminQuizTransfer(registered2.token as string,
        newQuiz1.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[403]);
  });

  test('Any session for this quiz is not in END state', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const quiz = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quiz.quizId as number, question);
    v1RequestAdminQuizSession(registered.token, quiz.quizId, autoStartNum);
    expect(() => v2RequestAdminQuizTransfer(registered.token as string, quiz.quizId as number, 'bob.smith@gmail.com')).toThrow(HTTPError[400]);
  });
});

// adminQuizViewTrash
describe.skip('adminQuizViewTrash', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName1 = 'lebron my glorious king';
  const quizName2 = 'jo mama';
  const quizDescr1 = 'quiz about my glorious king';
  const quizDescr2 = 'quiz about my mummy';

  test('Valid inputs with one quiz in trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId.jsonBody.quizId as number);
    const response = requestAdminQuizViewTrash(user.jsonBody.token as string);
    expect(response.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId.jsonBody.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Valid inputs with two quiz in trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    const quizId2 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName2, quizDescr2);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId2.jsonBody.quizId as number);
    const response = requestAdminQuizViewTrash(user.jsonBody.token as string);
    expect(response.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId1.jsonBody.quizId as number,
          name: 'lebron my glorious king'
        },
        {
          quizId: quizId2.jsonBody.quizId as number,
          name: 'jo mama'
        }
      ]
    });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v1RequestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const response = requestAdminQuizViewTrash(invalidToken);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// adminQuizTrashEmpty
describe.skip('Test adminQuizTrashEmpty', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz1.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz2.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(register.jsonBody.token as string, [quiz1.jsonBody.quizId as number, quiz2.jsonBody.quizId as number]);
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidQuizIds: [null, 0] },
    { invalidQuizIds: [0, null] },
    { invalidQuizIds: [150, 250] },
  ])("QuizId does not refer to valid quiz: '$invalidQuizIds'", ({ invalidQuizIds }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz1.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz2.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(register.jsonBody.token as string, invalidQuizIds);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz1.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz2.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(invalidToken, [quiz1.jsonBody.quizId as number, quiz2.jsonBody.quizId as number]);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test('QuizId does not refer to valid quiz', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    v1RequestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz3 = v1RequestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz4 = v1RequestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz3.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz4.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(register.jsonBody.token as string, [quiz3.jsonBody.quizId as number, quiz4.jsonBody.quizId as number]);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizSession
describe('V1 - Test adminQuizSession', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Prince Charless',
        correct: false
      }
    ]
  };

  test('Valid inputs', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    expect(v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum)).toMatchObject({ sessionId: expect.any(Number) });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    expect(() => v1RequestAdminQuizSession(invalidToken, quiz.quizId, autoStartNum)).toThrow(HTTPError[401]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, newQuiz.quizId as number, question);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizSession(user2.token as string, newQuiz.quizId, autoStartNum)).toThrow(HTTPError[403]);
  });

  test('AutoStartNum is a number greater than 50', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    expect(() => v1RequestAdminQuizSession(register.token, quiz.quizId, 51)).toThrow(HTTPError[400]);
  });

  test('A maximum of 10 sessions that are not in END state currently exist for this quiz', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    for (let i = 0; i < 10; i++) {
      v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    }
    expect(() => v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum)).toThrow(HTTPError[400]);
  });

  test('The quiz does not have any questions in it', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum)).toThrow(HTTPError[400]);
  });

  test('The quiz is in trash', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    requestAdminQuizRemove(register.token as string, quiz.quizId as number);
    expect(() => v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum)).toThrow(HTTPError[400]);
  });
});
