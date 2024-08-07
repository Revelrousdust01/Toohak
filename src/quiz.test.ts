import {
  v1RequestAdminAuthRegister, v1RequestAdminQuizCreate, v2RequestAdminQuizCreate,
  v1RequestAdminQuizTransfer, v2RequestAdminQuizTransfer, v1RequestAdminQuizTrashEmpty, v2RequestAdminQuizTrashEmpty,
  v1RequestAdminQuizList, v2RequestAdminQuizList, v1RequestAdminQuizInfo, v2RequestAdminQuizInfo, v1RequestClear, v1RequestAdminQuizSession, v1RequestAdminQuizThumbnailUpdate,
  v1RequestAdminQuizDescriptionUpdate, v2RequestAdminQuizDescriptionUpdate, v1RequestAdminQuizRemove, v2RequestAdminQuizRemove, v1RequestAdminQuizNameUpdate, v2RequestAdminQuizNameUpdate,
  v1RequestAdminQuizQuestionCreate, v2RequestAdminQuizQuestionCreate, v1RequestAdminQuizQuestionMove, v2RequestAdminQuizQuestionMove, v1RequestAdminQuizQuestionUpdate,
  v2RequestAdminQuizQuestionUpdate, v1RequestAdminQuizQuestionDelete, v2RequestAdminQuizQuestionDelete, v1RequestAdminQuizRestore, v2RequestAdminQuizRestore,
  v1RequestAdminQuizQuestionDuplicate, v2RequestAdminQuizQuestionDuplicate, v1RequestAdminQuizSessionUpdate, v1RequestAdminQuizViewTrash, v2RequestAdminQuizViewTrash,
} from './requests';
import { QuestionBody } from './interfaces';
import HTTPError from 'http-errors';

beforeEach(() => {
  v1RequestClear();
});

afterEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
});

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
describe('V1 - Test adminQuizDescriptionUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizDescription = 'New Quiz 1 description';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(v1RequestAdminQuizDescriptionUpdate(user.token, newQuiz.quizId, newQuizDescription)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizDescriptionUpdate(invalidToken, newQuiz.quizId, newQuizDescription)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizDescriptionUpdate(user.token, invalidQuizId, newQuizDescription)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizDescriptionUpdate(user2.token, newQuiz.quizId, newQuizDescription)).toThrow(HTTPError[403]);
  });

  test('Quiz description is greater than 100 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizDescriptionUpdate(user.token, newQuiz.quizId, 'A'.repeat(101))).toThrow(HTTPError[400]);
  });
});

describe('V2 - Test adminQuizDescriptionUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizDescription = 'New Quiz 1 description';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(v2RequestAdminQuizDescriptionUpdate(user.token, newQuiz.quizId, newQuizDescription)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizDescriptionUpdate(invalidToken, newQuiz.quizId, newQuizDescription)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizDescriptionUpdate(user.token, invalidQuizId, newQuizDescription)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v2RequestAdminQuizDescriptionUpdate(user2.token, newQuiz.quizId, newQuizDescription)).toThrow(HTTPError[403]);
  });

  test('Quiz description is greater than 100 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizDescriptionUpdate(user.token, newQuiz.quizId, 'A'.repeat(101))).toThrow(HTTPError[400]);
  });
});

// adminQuizRemove
describe('V1 - Test adminQuizRemove', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(v1RequestAdminQuizRemove(registered.token as string, quizId.quizId as number)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizRemove(invalidToken, quizId.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizRemove(registered.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizRemove(registered1.token as string, newQuiz.quizId as number)).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizRemove', () => {
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
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(v2RequestAdminQuizRemove(registered.token as string, quizId.quizId as number)).toMatchObject({});
  });

  test('Valid inputs in End State', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'END');
    expect(v2RequestAdminQuizRemove(registered.token as string, quizId.quizId as number)).toMatchObject({});
  });

  test('Session quiz is not in END state', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizSession(registered.token as string, quizId.quizId as number, autoStartNum);
    expect(() => v2RequestAdminQuizRemove(registered.token as string, quizId.quizId as number)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizRemove(invalidToken, quizId.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizRemove(registered.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v2RequestAdminQuizRemove(registered1.token as string, newQuiz.quizId as number)).toThrow(HTTPError[403]);
  });
});

// adminQuizInfo
describe('V1 - Test adminQuizInfo', () => {
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
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    expect(v1RequestAdminQuizInfo(registered.token as string, quizId.quizId as number)).toMatchObject({
      quizId: quizId.quizId as number,
      name: quizName,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: quizDescription,
      numQuestions: expect.any(Number),
      questions: [
        {
          questionId: questionId.questionId as number,
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
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizInfo(invalidToken, quizId.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v1RequestAdminQuizInfo(registered.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizInfo(registered1.token as string, newQuiz.quizId as number)).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizInfo', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const thumbnailUrl = 'http://google.com/some/image/path.jpg';
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
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizThumbnailUpdate(registered.token, quizId.quizId, thumbnailUrl);
    expect(v1RequestAdminQuizInfo(registered.token as string, quizId.quizId as number)).toMatchObject({
      quizId: quizId.quizId as number,
      name: quizName,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: quizDescription,
      numQuestions: expect.any(Number),
      questions: [
        {
          questionId: questionId.questionId as number,
          question: 'Who is the Monarch of England?',
          duration: 1,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
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
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(() => v2RequestAdminQuizInfo(invalidToken, quizId.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(() => v2RequestAdminQuizInfo(registered.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const registered1 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v2RequestAdminQuizInfo(registered1.token as string, newQuiz.quizId as number)).toThrow(HTTPError[403]);
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
    v1RequestAdminQuizRemove(register.token as string, quizId1.quizId as number);
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
    v2RequestAdminQuizRemove(register.token as string, quizId1.quizId as number);
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
describe('V1 - Test adminQuizNameUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizName = 'New Quiz 1 Name';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(v1RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, newQuizName)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizNameUpdate(invalidToken, newQuiz.quizId, newQuizName)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizNameUpdate(user.token, invalidQuizId, newQuizName)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizNameUpdate(user2.token, newQuiz.quizId, newQuizName)).toThrow(HTTPError[403]);
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
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const invalidQuizName = quizName + invalidCharacter;
    expect(() => v1RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, invalidQuizName)).toThrow(HTTPError[400]);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: $shortQuizName'", ({ shortQuizName }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, shortQuizName)).toThrow(HTTPError[400]);
  });

  test('Quiz name is greater than 30 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v1RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, 'A'.repeat(31))).toThrow(HTTPError[400]);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuiz2 = v1RequestAdminQuizCreate(user.token, 'Quiz 2', 'This is the second test quiz');
    expect(() => v1RequestAdminQuizNameUpdate(user.token, newQuiz2.quizId, quizName)).toThrow(HTTPError[400]);
  });
});

describe('V2 - Test adminQuizNameUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizName = 'New Quiz 1 Name';

  test('Working input, 0 errors expected', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(v2RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, newQuizName)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizNameUpdate(invalidToken, newQuiz.quizId, newQuizName)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizNameUpdate(user.token, invalidQuizId, newQuizName)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v2RequestAdminQuizNameUpdate(user2.token, newQuiz.quizId, newQuizName)).toThrow(HTTPError[403]);
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
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const invalidQuizName = quizName + invalidCharacter;
    expect(() => v2RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, invalidQuizName)).toThrow(HTTPError[400]);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: $shortQuizName'", ({ shortQuizName }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, shortQuizName)).toThrow(HTTPError[400]);
  });

  test('Quiz name is greater than 30 characters', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    expect(() => v2RequestAdminQuizNameUpdate(user.token, newQuiz.quizId, 'A'.repeat(31))).toThrow(HTTPError[400]);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuiz2 = v2RequestAdminQuizCreate(user.token, 'Quiz 2', 'This is the second test quiz');
    expect(() => v2RequestAdminQuizNameUpdate(user.token, newQuiz2.quizId, quizName)).toThrow(HTTPError[400]);
  });
});

// adminQuizRestore
describe('V1 - adminQuizRestore', () => {
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
    const quizId = v1RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId.quizId as number);
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
    expect(v1RequestAdminQuizRestore(user.token as string, quizId.quizId as number)).toStrictEqual({ });
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [

      ]
    });
  });

  test('Valid inputs with two quiz restores', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    const quizId2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v1RequestAdminQuizRemove(user.token as string, quizId2.quizId as number);
    expect(v1RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toStrictEqual({ });
    expect(v1RequestAdminQuizRestore(user.token as string,
      quizId2.quizId as number)).toStrictEqual({ });

    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [

      ]
    });
  });

  test('Quiz name of the restored quiz is already used by another active quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    expect(() => v1RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[400]);
  });

  test('Quiz ID refers to a quiz that is not currently in the trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    expect(() => v1RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v1RequestAdminQuizRestore(invalidToken, quizId1.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v1RequestAdminQuizRestore(user.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    const user2 = v1RequestAdminAuthRegister(email2, password, firstName2, lastName2);
    expect(() => v1RequestAdminQuizRestore(user2.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[403]);
  });
});

describe('V2 - adminQuizRestore', () => {
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
    const quizId = v1RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId.quizId as number);
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
    expect(v2RequestAdminQuizRestore(user.token as string, quizId.quizId as number)).toStrictEqual({ });
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [

      ]
    });
  });

  test('Valid inputs with two quiz restores', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    const quizId2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v2RequestAdminQuizRemove(user.token as string, quizId2.quizId as number);
    expect(v2RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toStrictEqual({ });
    expect(v2RequestAdminQuizRestore(user.token as string,
      quizId2.quizId as number)).toStrictEqual({ });

    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [

      ]
    });
  });

  test('Quiz name of the restored quiz is already used by another active quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    expect(() => v2RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[400]);
  });

  test('Quiz ID refers to a quiz that is not currently in the trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    expect(() => v2RequestAdminQuizRestore(user.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v2RequestAdminQuizRestore(invalidToken, quizId1.quizId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v2RequestAdminQuizRestore(user.token as string, invalidQuizId)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    const user2 = v1RequestAdminAuthRegister(email2, password, firstName2, lastName2);
    expect(() => v2RequestAdminQuizRestore(user2.token as string,
      quizId1.quizId as number)).toThrow(HTTPError[403]);
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
describe('V1 - adminQuizQuestionDuplicate', () => {
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
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
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
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
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
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    expect(v1RequestAdminQuizQuestionDuplicate(user.token as string,
      quiz.quizId as number, question.questionId as number)).toStrictEqual({ newQuestionId: expect.any(Number) });
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const quiz2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz2.quizId as number, question2);
    const questionSecond = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz2.quizId as number, question1);
    expect(() => v1RequestAdminQuizQuestionDuplicate(user.token as string,
      quiz.quizId as number, questionSecond.questionId as number)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    expect(() => v1RequestAdminQuizQuestionDuplicate(invalidToken,
      quiz.quizId as number, question.questionId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      newQuiz.quizId as number, question1);
    expect(() => v1RequestAdminQuizQuestionDuplicate(user.token as string,
      invalidQuizId, question.questionId as number)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this use owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    const user2 = v1RequestAdminAuthRegister('cpolitis@student.unsw.edu.au',
      'ab123bweofljj4', 'Chris', 'Poopy');
    expect(() => v1RequestAdminQuizQuestionDuplicate(user2.token as string,
      quiz.quizId as number, question.questionId as number)).toThrow(HTTPError[403]);
  });
});

describe('V2 - adminQuizQuestionDuplicate', () => {
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
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
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
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
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
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    expect(v2RequestAdminQuizQuestionDuplicate(user.token as string,
      quiz.quizId as number, question.questionId as number)).toStrictEqual({ newQuestionId: expect.any(Number) });
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const quiz2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz2.quizId as number, question2);
    const questionSecond = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz2.quizId as number, question1);
    expect(() => v2RequestAdminQuizQuestionDuplicate(user.token as string,
      quiz.quizId as number, questionSecond.questionId as number)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    expect(() => v2RequestAdminQuizQuestionDuplicate(invalidToken,
      quiz.quizId as number, question.questionId as number)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      newQuiz.quizId as number, question1);
    expect(() => v2RequestAdminQuizQuestionDuplicate(user.token as string,
      invalidQuizId, question.questionId as number)).toThrow(HTTPError[403]);
  });

  test('QuizId does not refer to a quiz that this use owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescr);
    const question = v2RequestAdminQuizQuestionCreate(user.token as string,
      quiz.quizId as number, question1);
    const user2 = v1RequestAdminAuthRegister('cpolitis@student.unsw.edu.au',
      'ab123bweofljj4', 'Chris', 'Poopy');
    expect(() => v2RequestAdminQuizQuestionDuplicate(user2.token as string,
      quiz.quizId as number, question.questionId as number)).toThrow(HTTPError[403]);
  });
});

// adminQuizQuestionDelete
describe('V1 - Test adminQuizQuestionDelete', () => {
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
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(v1RequestAdminQuizQuestionDelete(user.token, newQuiz.quizId, newQuestion.questionId)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionDelete(invalidToken, newQuiz.quizId, newQuestion.questionId)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionDelete(user.token, invalidQuizId, newQuestion.questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: -1 },
    { invalidQuestionId: 150 },
  ])("Question ID does not refer to a valid question within the quiz. '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionDelete(user.token, newQuiz.quizId, invalidQuestionId)).toThrow(HTTPError[400]);
  });
});

describe('V2 - Test adminQuizQuestionDelete', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
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
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(v2RequestAdminQuizQuestionDelete(user.token, newQuiz.quizId, newQuestion.questionId)).toMatchObject({});
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionDelete(invalidToken, newQuiz.quizId, newQuestion.questionId)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionDelete(user.token, invalidQuizId, newQuestion.questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: -1 },
    { invalidQuestionId: 150 },
  ])("Question ID does not refer to a valid question within the quiz. '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionDelete(user.token, newQuiz.quizId, invalidQuestionId)).toThrow(HTTPError[400]);
  });

  test('Any session for this quiz is not in END state', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v1RequestAdminQuizSession(user.token, newQuiz.quizId, autoStartNum);
    expect(() => v2RequestAdminQuizQuestionDelete(user.token, newQuiz.quizId, newQuestion.questionId)).toThrow(HTTPError[400]);
  });
});

// adminQuizQuestionUpdate
describe('V1 - Test adminQuizQuestionUpdate', () => {
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
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(v1RequestAdminQuizQuestionUpdate(user.token, newQuiz.quizId, newQuestion.questionId, updatedQuestion)).toStrictEqual({});
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...updatedQuestion, question: questionString };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token, newQuiz.quizId, newQuestion.questionId, invalidQuestion)).toThrow(HTTPError[400]);
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token, newQuiz.quizId, -20, updatedQuestion)).toThrow(HTTPError[400]);
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
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...updatedQuestion, duration: -1 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...updatedQuestion, duration: 350 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const quiz = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, quiz.questionId as number, question1).toThrow(HTTPError[400]));
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...updatedQuestion, points: invalidPoints };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test.each([
    { questionString: '' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }, { answer: 'Cool', correct: true }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...updatedQuestion, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }, { answer: 'B', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(invalidToken, newQuiz.quizId as number, newQuestion.questionId as number, updatedQuestion)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v1RequestAdminQuizQuestionUpdate(user.token as string, invalidQuizId, newQuestion.questionId as number, updatedQuestion)).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizQuestionUpdate', () => {
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
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
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
    ],
    thumbnailUrl: 'http://google.com/some/images/path.jpg'
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, updatedQuestion)).toStrictEqual({});
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...updatedQuestion, question: questionString };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion)).toThrow(HTTPError[400]);
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
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...updatedQuestion, duration: -1 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...updatedQuestion, duration: 350 };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const quiz = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, quiz.questionId as number, question1).toThrow(HTTPError[400]));
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...updatedQuestion, points: invalidPoints };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test.each([
    { questionString: '' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }, { answer: 'Cool', correct: true }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...updatedQuestion, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }, { answer: 'B', correct: false }] };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token as string, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token as string, newQuiz.quizId as number, newQuestion.questionId as number, invalidQuestion).toThrow(HTTPError[400]));
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId as number, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(invalidToken, newQuiz.quizId as number, newQuestion.questionId as number, updatedQuestion)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token, invalidQuizId, newQuestion.questionId, updatedQuestion)).toThrow(HTTPError[403]);
  });

  test.each([
    { invalidUrl: '' },
    { invalidUrl: 'http://google.com/some/image/' },
    { invalidUrl: 'google.com/some/image/path.jpg' },
  ])("Invalid Url: '$invalidUrl'", ({ invalidUrl }) => {
    const invalidQuestion = { ...question, thumbnailUrl: invalidUrl };
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionUpdate(user.token, newQuiz.quizId, newQuestion.questionId, invalidQuestion).toThrow(HTTPError[400]));
  });
});

// adminQuizQuestionMove
describe('V1 - Test adminQuizQuestionMove', () => {
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
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(v1RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, newQuestion.questionId, 1)).toMatchObject({});
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: 0 },
    { invalidQuestionId: 150 },
  ])("Question ID is invalid or user does not own the quiz '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v1RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, invalidQuestionId, 1)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidNewPosition: -1 },
    { invalidNewPosition: 9999999 },
    { invalidNewPosition: 0 }
  ])("New position is invalid: '$invalidNewPosition'", ({ invalidNewPosition }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v1RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, newQuestion.questionId, invalidNewPosition)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v1RequestAdminQuizQuestionMove(invalidToken, newQuiz.quizId, newQuestion.questionId, 1)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v1RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v1RequestAdminQuizQuestionMove(user.token, invalidQuizId, newQuestion.questionId, 1)).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizQuestionMove', () => {
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
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
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
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };

  test('Valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(v2RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, newQuestion.questionId, 1)).toMatchObject({});
  });

  test.each([
    { invalidQuestionId: null },
    { invalidQuestionId: 0 },
    { invalidQuestionId: 150 },
  ])("Question ID is invalid or user does not own the quiz '$invalidQuestionId'", ({ invalidQuestionId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    expect(() => v2RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, invalidQuestionId, 1)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidNewPosition: -1 },
    { invalidNewPosition: 9999999 },
    { invalidNewPosition: 0 }
  ])("New position is invalid: '$invalidNewPosition'", ({ invalidNewPosition }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v2RequestAdminQuizQuestionMove(user.token, newQuiz.quizId, newQuestion.questionId, invalidNewPosition)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v2RequestAdminQuizQuestionMove(invalidToken, newQuiz.quizId, newQuestion.questionId, 1)).toThrow(HTTPError[401]);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token, quizName, quizDescription);
    const newQuestion = v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, question);
    v2RequestAdminQuizQuestionCreate(user.token, newQuiz.quizId, updatedQuestion);
    expect(() => v2RequestAdminQuizQuestionMove(user.token, invalidQuizId, newQuestion.questionId, 1)).toThrow(HTTPError[403]);
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

  test('Valid inputs in End State', () => {
    v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'END');
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
describe('V1 - adminQuizViewTrash', () => {
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
    const quizId = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v1RequestAdminQuizRemove(user.token as string, quizId.quizId as number);
    expect(v1RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
  });

  test('Valid inputs with two quiz in trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    const quizId2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v1RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v1RequestAdminQuizRemove(user.token as string, quizId2.quizId as number);
    expect(v1RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId1.quizId as number,
          name: 'lebron my glorious king'
        },
        {
          quizId: quizId2.quizId as number,
          name: 'jo mama'
        }
      ]
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v1RequestAdminQuizViewTrash(invalidToken)).toThrow(HTTPError[401]);
  });
});

describe('V2 - adminQuizViewTrash', () => {
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
    const quizId = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId.quizId as number);
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId.quizId as number,
          name: 'lebron my glorious king'
        }
      ]
    });
  });

  test('Valid inputs with two quiz in trash', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    const quizId2 = v2RequestAdminQuizCreate(user.token as string, quizName2, quizDescr2);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    v2RequestAdminQuizRemove(user.token as string, quizId2.quizId as number);
    expect(v2RequestAdminQuizViewTrash(user.token as string)).toMatchObject({
      quizzes: [
        {
          quizId: quizId1.quizId as number,
          name: 'lebron my glorious king'
        },
        {
          quizId: quizId2.quizId as number,
          name: 'jo mama'
        }
      ]
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = v2RequestAdminQuizCreate(user.token as string, quizName1, quizDescr1);
    v2RequestAdminQuizRemove(user.token as string, quizId1.quizId as number);
    expect(() => v2RequestAdminQuizViewTrash(invalidToken)).toThrow(HTTPError[401]);
  });
});

// adminQuizTrashEmpty
describe('V1 - Test adminQuizTrashEmpty', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v1RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v1RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(v1RequestAdminQuizTrashEmpty(register.token as string, [quiz1.quizId as number, quiz2.quizId as number])).toMatchObject({ });
  });

  test.each([
    { invalidQuizIds: [null, 0] },
    { invalidQuizIds: [0, null] },
    { invalidQuizIds: [150, 250] },
  ])("QuizId does not refer to valid quiz: '$invalidQuizIds'", ({ invalidQuizIds }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v1RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v1RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(() => v1RequestAdminQuizTrashEmpty(register.token as string, invalidQuizIds)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v1RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v1RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v1RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(() => v1RequestAdminQuizTrashEmpty(invalidToken, [quiz1.quizId as number, quiz2.quizId as number])).toThrow(HTTPError[401]);
  });

  test('QuizId does not refer to valid quiz', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    const second = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const quiz3 = v1RequestAdminQuizCreate(second.token as string, quizName, quizDescription);
    const quiz4 = v1RequestAdminQuizCreate(second.token as string, 'Special quiz name', quizDescription);
    v1RequestAdminQuizRemove(second.token as string, quiz3.quizId as number);
    v1RequestAdminQuizRemove(second.token as string, quiz4.quizId as number);
    expect(() => v1RequestAdminQuizTrashEmpty(register.token as string, [quiz3.quizId as number, quiz4.quizId as number])).toThrow(HTTPError[403]);
  });
});

describe('V2 - Test adminQuizTrashEmpty', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v2RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v2RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v2RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(v2RequestAdminQuizTrashEmpty(register.token as string, [quiz1.quizId as number, quiz2.quizId as number])).toMatchObject({ });
  });

  test.each([
    { invalidQuizIds: [null, 0] },
    { invalidQuizIds: [0, null] },
    { invalidQuizIds: [150, 250] },
  ])("QuizId does not refer to valid quiz: '$invalidQuizIds'", ({ invalidQuizIds }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v2RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v2RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v2RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(() => v2RequestAdminQuizTrashEmpty(register.token as string, invalidQuizIds)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    const quiz2 = v2RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    v2RequestAdminQuizRemove(register.token as string, quiz1.quizId as number);
    v2RequestAdminQuizRemove(register.token as string, quiz2.quizId as number);
    expect(() => v2RequestAdminQuizTrashEmpty(invalidToken, [quiz1.quizId as number, quiz2.quizId as number])).toThrow(HTTPError[401]);
  });

  test('QuizId does not refer to valid quiz that the owner owns', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v2RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v2RequestAdminQuizCreate(register.token as string, 'Special quiz name', quizDescription);
    const second = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const quiz3 = v2RequestAdminQuizCreate(second.token as string, quizName, quizDescription);
    const quiz4 = v2RequestAdminQuizCreate(second.token as string, 'Special quiz name', quizDescription);
    v2RequestAdminQuizRemove(second.token as string, quiz3.quizId as number);
    v2RequestAdminQuizRemove(second.token as string, quiz4.quizId as number);
    expect(() => v2RequestAdminQuizTrashEmpty(register.token as string, [quiz3.quizId as number, quiz4.quizId as number])).toThrow(HTTPError[403]);
  });
});

// adminQuizThumbnailUpdate
describe('V1 - Test adminQuizThumbnailUpdate', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const thumbnailUrl = 'http://google.com/some/image/path.jpg';

  test('Valid inputs', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    expect(v1RequestAdminQuizThumbnailUpdate(registered.token, quiz.quizId, thumbnailUrl)).toMatchObject({ });
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

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v1RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizThumbnailUpdate(user2.token, newQuiz.quizId, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test.each([
    { invalidUrl: '' },
    { invalidUrl: 'http://google.com/some/image/' },
    { invalidUrl: 'google.com/some/image/path.jpg' },
  ])("Invalid Url: '$invalidUrl'", ({ invalidUrl }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = v2RequestAdminQuizCreate(user.token as string, quizName, quizDescription);
    expect(() => v1RequestAdminQuizThumbnailUpdate(user.token, newQuiz.quizId, invalidUrl)).toThrow(HTTPError[400]);
  });
});
