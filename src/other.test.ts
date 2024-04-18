import {
  v1RequestAdminAuthRegister, v1RequestAdminQuizCreate, requestAdminQuizRemove, v1RequestClear,
  v1RequestAdminUserDetails, v1RequestAdminQuizList, v1RequestAdminQuizViewTrash, v1RequestAdminQuizSession,
  v1RequestAdminQuizQuestionCreate
} from './requests';
import { QuestionBody } from './interfaces';
import HTTPError from 'http-errors';

beforeEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
});

describe('Iteration 3: Test "clear" function', () => {
  const firstName = 'Leon';
  const lastName = 'Sun';
  const email = 'leonsun@gmail.com';
  const password = 'Leonsunspassword1';
  const quizName = 'The Quiz 1';
  const quizDescription = 'Description for first quiz';
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

  test('Returns empty object from an empty test', () => {
    expect(v1RequestClear()).toMatchObject({ });
  });

  test('Resets users list to empty', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestClear();
    expect(() => v1RequestAdminUserDetails(registered.token as string)).toThrow(HTTPError[401]);
  });

  test('Resets quizzes list to empty', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestClear();
    expect(() => v1RequestAdminQuizList(registered.token as string)).toThrow(HTTPError[401]);
  });

  test('Resets trash list to empty', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    requestAdminQuizRemove(registered.token as string, quizId.quizId as number);
    v1RequestClear();
    expect(() => v1RequestAdminQuizViewTrash(registered.token as string)).toThrow(HTTPError[401]);
  });

  test('Resets quiz counter to 1', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestClear();
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    expect(v1RequestAdminQuizCreate(registered1.token as string, quizName, quizDescription)).toMatchObject({quizId: expect.any(Number)});
  });

  test('Resets user sessions list to empty', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestClear();
    const registered1 = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId1 = v1RequestAdminQuizCreate(registered1.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered1.token as string, quizId1.quizId as number, question);
    expect(v1RequestAdminQuizSession(registered1.token, quizId1.quizId, autoStartNum)).toMatchObject({sessionId: expect.any(Number)})
  });
});
