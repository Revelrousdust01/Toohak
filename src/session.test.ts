import { QuestionBody } from './interfaces';
import {
  v1RequestClear, v1RequestAdminAuthRegister, v1RequestAdminQuizCreate, v1RequestAdminQuizQuestionCreate,
  v1RequestAdminQuizSession, v1RequestAdminQuizSessionUpdate, v1RequestAdminQuizRemove, v1RequestAdminViewQuizSessions,
  v1RequestAdminPlayerJoin
} from './requests';
import HTTPError from 'http-errors';
import { requestSleepSync } from './requests';

beforeEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
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
    v1RequestAdminQuizRemove(register.token as string, quiz.quizId as number);
    expect(() => v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum)).toThrow(HTTPError[400]);
  });
});

// adminQuizSessionUpdate
describe('V1 - Test adminQuizSessionUpdate', () => {
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

  const question2: QuestionBody = {
    question: 'Who is the Monarch of England1?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles1',
        correct: true
      },
      {
        answer: 'Prince Charless1',
        correct: false
      }
    ],
  };

  test.only('Quiz autostart from Lobby state', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(sessionId.sessionId, "Leon");
    v1RequestAdminPlayerJoin(sessionId.sessionId, "Jeffery");
    v1RequestAdminPlayerJoin(sessionId.sessionId, "Samuel");
    expect(v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'SKIP_COUNTDOWN')).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'END' },
    { validActionEnum: 'NEXT_QUESTION' },
  ])("Valid Action enum for Lobby state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'END' },
    { validActionEnum: 'SKIP_COUNTDOWN' },
  ])("Valid Action enum for Question countdown state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    expect(v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'GO_TO_ANSWER' },
    { validActionEnum: 'END' },
  ])("Valid Action enum for Question Open state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'GO_TO_ANSWER' },
    { validActionEnum: 'END' },
  ])("Valid Action enum for Question Open state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    requestSleepSync(3000);
    requestSleepSync(1000);
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'GO_TO_FINAL_RESULTS' },
    { validActionEnum: 'GO_TO_ANSWER' },
    { validActionEnum: 'END' },
    { validActionEnum: 'NEXT_QUESTION' }
  ])("Valid Action enum for Question Close state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'GO_TO_FINAL_RESULTS' },
    { validActionEnum: 'END' },
    { validActionEnum: 'NEXT_QUESTION' },
  ])("Valid Action enum for Answer Show state from Question Opened: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'GO_TO_FINAL_RESULTS' },
    { validActionEnum: 'END' },
    { validActionEnum: 'NEXT_QUESTION' },
  ])("Valid Action enum for Answer Show state from Question Closed: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { validActionEnum: 'END' },
  ])("Valid Action enum for Final Results state: '$validActionEnum", ({ validActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_FINAL_RESULTS');
    expect(v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, validActionEnum)).toMatchObject({ });
  });

  test.each([
    { invalidActionEnum: 'FINAL_RESULTS_GO_TO_NOW' },
    { invalidActionEnum: 'SKIP_ANSWER' },
    { invalidActionEnum: 'HIHI_PLEASEFAILTESTTEEHEE' },
  ])("invalid Action enum: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidSessionId: -1 },
    { invalidSessionId: 0 },
    { invalidSessionId: null },
  ])("invalid Action enum: '$invalidSessionId", ({ invalidSessionId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, invalidSessionId, 'END')).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
  ])("invalid Action enum for Lobby state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
  ])("invalid Action enum for Question Countdown state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
  ])("invalid Action enum for Question Open state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'SKIP_COUNTDOWN' }
  ])("invalid Action enum for Question Close state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
  ])("invalid Action enum for Answer Show state from Question Opened: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
  ])("invalid Action enum for Answer Show state from Question Closed: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
  ])("invalid Action enum for Final Result state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_FINAL_RESULTS');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
  ])("invalid Action enum for Final Result state from Question Open: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_FINAL_RESULTS');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
  ])("invalid Action enum for Final Result state from Question Closed: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_ANSWER');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'GO_TO_FINAL_RESULTS');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidActionEnum: 'SKIP_COUNTDOWN' },
    { invalidActionEnum: 'GO_TO_ANSWER' },
    { invalidActionEnum: 'NEXT_QUESTION' },
    { invalidActionEnum: 'GO_TO_FINAL_RESULTS' },
    { invalidActionEnum: 'END' },
  ])("invalid Action enum for End state: '$invalidActionEnum", ({ invalidActionEnum }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'END');
    expect(() => v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, invalidActionEnum)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminQuizSessionUpdate(invalidToken, quizId.quizId as number, sessionId.sessionId, 'NEXT_QUESTION')).toThrow(HTTPError[401]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const registered2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminQuizSessionUpdate(registered2.token as string, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
});

describe('V1 - Test adminViewQuizSessions', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz 1';
  const quizDescription = 'This is the first new quiz';
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
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, quizId.quizId, question);
    const sessionId1 = v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(user.token, quizId.quizId, sessionId1.sessionId, 'END');
    const sessionId2 = v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    expect(v1RequestAdminViewQuizSessions(user.token, quizId.quizId)).toMatchObject({
      activeSessions: [sessionId2.sessionId],
      inactiveSessions: [sessionId1.sessionId]
    });
  });

  test('Multiple sessions - valid inputs', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, quizId.quizId, question);

    const sessionId1 = v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(user.token, quizId.quizId, sessionId1.sessionId, 'END');
    v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    const sessionId3 = v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(user.token, quizId.quizId, sessionId3.sessionId, 'END');
    v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);

    expect(v1RequestAdminViewQuizSessions(user.token, quizId.quizId)).toMatchObject({
      activeSessions: [expect.any(Number), expect.any(Number)],
      inactiveSessions: [expect.any(Number), expect.any(Number)]
    });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, quizId.quizId, question);
    v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminViewQuizSessions(invalidToken, quizId.quizId)).toThrow(HTTPError[401]);
  });

  test('QuizId does not refer to a quiz that this user owns', () => {
    const user = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(user.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(user.token, quizId.quizId, question);
    v1RequestAdminQuizSession(user.token, quizId.quizId, autoStartNum);
    const user2 = v1RequestAdminAuthRegister('bob.smith@gmail.com', 'a1234567', 'Smith', 'Bob');
    expect(() => v1RequestAdminViewQuizSessions(user2.token, quizId.quizId)).toThrow(HTTPError[403]);
  });
});
