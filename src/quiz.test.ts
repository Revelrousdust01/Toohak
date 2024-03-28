import {
  requestAdminAuthLogin, requestAdminAuthRegister, requestAdminQuizCreate, 
  requestAdminQuizDescriptionUpdate, requestAdminQuizList, requestAdminQuizNameUpdate, 
  requestAdminQuizRemove, requestAdminQuizQuestionCreate, requestAdminQuizTransfer, 
  requestAdminQuizTrashEmpty, requestClear, requestAdminQuizViewTrash,
} from './requests';
import { ErrorObject, QuestionBody } from './interfaces';

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
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
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
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, invalidCharacter, quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test.each([
    { shortQuizName: '1' },
    { shortQuizName: '12' },
  ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, shortQuizName, quizDescription);
    requestAdminAuthRegister(email, password, lastName, firstName);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Quiz name is greater than 30 characters', () => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, 'a'.repeat(31), quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    requestAdminAuthRegister(email, password, lastName, firstName);
    const login = requestAdminAuthLogin(email, password);
    requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    const newQuiz = requestAdminQuizCreate(login.jsonBody.token as string, quizName, quizDescription);
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });

  test('Description is too long', () => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, 'a'.repeat(101));
    expect(newQuiz.jsonBody).toStrictEqual(ERROR);
    expect(newQuiz.statusCode).toStrictEqual(400);
  });
});

// adminQuizDescriptionUpdate
describe('Test adminQuizDescriptionUpdate', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'qwer88888888';
  const quizName = 'Quiz 1 Name';
  const quizDescription = 'This is the first new quiz';
  const newQuizDescription = 'New Quiz 1 description';

  test('Working input, 0 errors expected', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
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
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(invalidToken, newQuiz.jsonBody.quizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(user.jsonBody.token as string, invalidQuizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const user2 = requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizDescriptionUpdate(user2.jsonBody.token as string, newQuiz.jsonBody.quizId as number, newQuizDescription);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('Quiz description is greater than 100 characters', () => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizDescriptionUpdate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, 'A'.repeat(101));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
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
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizRemove(invalidToken, quizId.jsonBody.quizid as number);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestAdminQuizRemove(registered.jsonBody.token as string, invalidQuizId);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const registered1 = requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const response = requestAdminQuizRemove(registered1.jsonBody.token as string, newQuiz.jsonBody.quizId as number);
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
describe('adminQuizList', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'How to train your dragon';
  const quizDescription = 'Quiz about the movie trivia of How to Train your dragon';

  test('One quiz in quizlist', () => {
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizList(register.jsonBody.token as string);
    expect(response.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId.jsonBody.quizId as number,
          name: quizName
        }
      ]
    });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Multiple quiz in quizlist', () => {
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quizId1 = requestAdminQuizCreate(register.jsonBody.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    const response = requestAdminQuizList(register.jsonBody.token as string);
    expect(response.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId.jsonBody.quizId as number,
          name: quizName
        },
        {
          quizId: quizId1.jsonBody.quizId as number,
          name: 'Age of Adeline'
        }
      ]
    });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Multiple quizzes with one quiz in trash', () => {
    const register = requestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quizId1 = requestAdminQuizCreate(register.jsonBody.token as string, 'Age of Adeline',
      'Quiz about the movie trivia of Age of Adeline');
    requestAdminQuizRemove(register.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const response = requestAdminQuizList(register.jsonBody.token as string);
    expect(response.jsonBody).toMatchObject({
      quizzes: [
        {
          quizId: quizId.jsonBody.quizId as number,
          name: quizName
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
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const response = requestAdminQuizList(invalidToken);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// adminQuizNameUpdate
describe('Test adminQuizNameUpdate', () => {
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
  ])('QuizId does not refer to valid quiz: $invalidQuizId', ({ invalidQuizId }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
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
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const newQuiz2 = requestAdminQuizCreate(user.jsonBody.token as string, 'Quiz 2', 'This is the second test quiz');
    const response = requestAdminQuizNameUpdate(user.jsonBody.token as string, newQuiz2.jsonBody.quizId as number, quizName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });
});

// adminQuizQuestionCreate
describe('Test adminQuizQuestionCreate', () => {
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
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question);
    expect(response.jsonBody).toStrictEqual({ questionId: expect.any(Number) });
    expect(response.statusCode).toStrictEqual(200);
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Invalid question string length '$questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, question: questionString };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toBe(400);
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
    const invalidQuestion = { ...question, answers: invalidAnswers };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('Question duration is not a positive number', () => {
    const invalidQuestion = { ...question, duration: -1 };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const question1 = { ...question, duration: 150 };
    const question2 = { ...question, duration: 151 };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question1);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, question2);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidPoints: 0 },
    { invalidPoints: 11 },
  ])('Points awarded for the question are less than 1 or greater than 10', ({ invalidPoints }) => {
    const invalidQuestion = { ...question, points: invalidPoints };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { questionString: 'A' },
    { questionString: 'A'.repeat(55) },
  ])("Length of any answer is shorter than 1 character long, or longer than 30 characters long $'questionString'", ({ questionString }) => {
    const invalidQuestion = { ...question, answers: [{ answer: questionString, correct: true }] };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: true }, { answer: 'A', correct: false }] };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test('There are no correct answers', () => {
    const invalidQuestion = { ...question, answers: [{ answer: 'A', correct: false }] };
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, newQuiz.jsonBody.quizId as number, invalidQuestion);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz = requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(invalidToken, newQuiz.jsonBody.quizId as number, question);
    expect(response.statusCode).toStrictEqual(401);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("Quiz ID is invalid or user does not own the quiz '$invalidQuizId'", ({ invalidQuizId }) => {
    const user = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(user.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizQuestionCreate(user.jsonBody.token as string, invalidQuizId, question);
    expect(response.statusCode).toStrictEqual(403);
    expect(response.jsonBody).toStrictEqual(ERROR);
  });
});

// adminQuizTransfer
describe('Test adminQuizTransfer', () => {
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizTransfer(registered.jsonBody.token as string, quizId.jsonBody.quizId as number, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });

  test('userEmail is not a real user', () => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizTransfer(registered.jsonBody.token as string, quizId.jsonBody.quizId as number, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('userEmail is the current logged in user', () => {
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizTransfer(registered.jsonBody.token as string, quizId.jsonBody.quizId as number, email);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const registered = requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    requestAdminQuizCreate(registered.jsonBody.token as string, quizName, 'Bobs New Quiz');
    const registered1 = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered1.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizTransfer(registered1.jsonBody.token as string, quizId.jsonBody.quizId as number, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const response = requestAdminQuizTransfer(invalidToken, quizId.jsonBody.quizId as number, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test.each([
    { invalidQuizId: null },
    { invalidQuizId: 0 },
    { invalidQuizId: 150 },
  ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
    requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    const registered = requestAdminAuthRegister(email, password, lastName, firstName);
    const response = requestAdminQuizTransfer(registered.jsonBody.token as string, invalidQuizId, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = requestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    requestAdminQuizCreate(registered.jsonBody.token as string, quizName, quizDescription);
    const registered1 = requestAdminAuthRegister(email, password, lastName, firstName);
    const newQuiz1 = requestAdminQuizCreate(registered1.jsonBody.token as string, 'Cool Quiz', 'This is a cool quiz');
    const registered2 = requestAdminAuthRegister('john.wick@gmail.com', '1234567a', 'Wick', 'John');
    const response = requestAdminQuizTransfer(registered2.jsonBody.token as string,
                                              newQuiz1.jsonBody.quizId as number, 'bob.smith@gmail.com');
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});

// adminQuizViewTrash
describe('adminQuizViewTrash', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName1 = 'lebron my glorious king';
  const quizName2 = 'jo mama';
  const quizDescr1 = 'quiz about my glorious king';
  const quizDescr2 = 'quiz about my mummy';

  test('Valid inputs with one quiz in trash', () => {
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const quizId = requestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
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
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = requestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    const quizId2 = requestAdminQuizCreate(user.jsonBody.token as string, quizName2, quizDescr2);
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
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const quizId1 = requestAdminQuizCreate(user.jsonBody.token as string, quizName1, quizDescr1);
    requestAdminQuizRemove(user.jsonBody.token as string, quizId1.jsonBody.quizId as number);
    const response = requestAdminQuizViewTrash(invalidToken);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// adminQuizTrashEmpty
describe('Test adminQuizTrashEmpty', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';

  test('Valid inputs', () => {
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = requestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
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
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = requestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
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
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    const quiz1 = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz2 = requestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz1.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz2.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(invalidToken, [quiz1.jsonBody.quizId as number, quiz2.jsonBody.quizId as number]);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });

  test('QuizId does not refer to valid quiz', () => {
    const register = requestAdminAuthRegister(email, password, lastName, firstName);
    requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    requestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminAuthRegister(email, password, lastName, firstName);
    const quiz3 = requestAdminQuizCreate(register.jsonBody.token as string, quizName, quizDescription);
    const quiz4 = requestAdminQuizCreate(register.jsonBody.token as string, 'Special quiz name', quizDescription);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz3.jsonBody.quizId as number);
    requestAdminQuizRemove(register.jsonBody.token as string, quiz4.jsonBody.quizId as number);
    const response = requestAdminQuizTrashEmpty(register.jsonBody.token as string, [quiz3.jsonBody.quizId as number, quiz4.jsonBody.quizId as number]);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(403);
  });
});
