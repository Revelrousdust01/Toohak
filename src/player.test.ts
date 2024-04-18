import { QuestionBody } from './interfaces';
import { v1RequestClear, v1RequestAdminAuthRegister, v1RequestAdminPlayerJoin, v1RequestAdminQuizCreate, v1RequestAdminQuizQuestionCreate, v1RequestAdminQuizSession, v1RequestAdminQuizSessionUpdate, v1RequestAdminPlayerSubmission, requestSleepSync } from './requests';
import HTTPError from 'http-errors';
beforeEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
});

describe('V1 - Test adminQuizCreate', () => {
  const playerName = 'Joe Mama';
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
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    expect(v1RequestAdminPlayerJoin(session.sessionId, playerName)).toMatchObject({ playerId: expect.any(Number) });
  });

  test('Name of user entered is not unique (compared to other users who have already joined)', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(session.sessionId, playerName);
    expect(() => v1RequestAdminPlayerJoin(session.sessionId, playerName)).toThrow(HTTPError[400]);
  });

  test('Session Id does not refer to a valid session', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    expect(() => v1RequestAdminPlayerJoin(-1, playerName)).toThrow(HTTPError[400]);
  });

  test('Session is not in LOBBY state', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    expect(() => v1RequestAdminPlayerJoin(session.sessionId, playerName)).toThrow(HTTPError[400]);
  });
});

describe('V1 - Test adminQuizCreate', () => {
  const playerName = 'Joe Mama';
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const answerIds = [1,2];
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
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(v1RequestAdminPlayerSubmission(player.playerId, 0, answerIds)).toMatchObject({ });
  });

  test('If player ID does not exist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(-10, 0, answerIds)).toThrow(HTTPError[400]);;
  });

  test('If question position is not valid for the session this player is in', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, -10, answerIds)).toThrow(HTTPError[400]);;
  });

  test('Session is not in QUESTION_OPEN state', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 0, answerIds)).toThrow(HTTPError[400]);
  });

  test('If session is not yet up to this question', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, answerIds)).toThrow(HTTPError[400]);
  });

  test('Answer IDs are not valid for this particular question', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [10001,10002])).toThrow(HTTPError[400]);
  });

  test('There are duplicate answer IDs provided', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [10001,10001])).toThrow(HTTPError[400]);
  });

  test('Less than 1 answer ID was submitted', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName)
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [])).toThrow(HTTPError[400]);
  });
});