import { QuestionBody } from './interfaces';
import {
  v1RequestClear, v1RequestAdminAuthRegister, v1RequestAdminPlayerJoin,
  v1RequestAdminQuizCreate, v2RequestAdminQuizCreate, v2RequestAdminQuizQuestionCreate, v1RequestAdminQuizQuestionCreate, v1RequestAdminQuizSession,
  v1RequestAdminQuizSessionUpdate, v1RequestAdminPlayerSubmission, v1RequestAdminQuizSessionStatus, v1RequestAdminGuestPlayerStatus,
  v1RequestAdminQuizThumbnailUpdate, requestSleepSync, v1RequestPlayerSendMessage
} from './requests';
import HTTPError from 'http-errors';
beforeEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
});

// adminPlayerJoin
describe('V1 - Test adminPlayerJoin', () => {
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

  test('Quiz autostart from Lobby state', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token, quizId.quizId, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(sessionId.sessionId, 'Leon');
    v1RequestAdminPlayerJoin(sessionId.sessionId, 'Jeffery');
    v1RequestAdminPlayerJoin(sessionId.sessionId, 'Samuel');
    expect(v1RequestAdminQuizSessionStatus(registered.token, quizId.quizId, sessionId.sessionId).state).toStrictEqual('QUESTION_COUNTDOWN');
    requestSleepSync(3000);
    expect(v1RequestAdminQuizSessionStatus(registered.token, quizId.quizId, sessionId.sessionId).state).toStrictEqual('QUESTION_OPEN');
    requestSleepSync(1000);
    expect(v1RequestAdminQuizSessionStatus(registered.token, quizId.quizId, sessionId.sessionId).state).toStrictEqual('QUESTION_CLOSE');
  });
});

// adminPlayerSubmission
describe('V1 - Test adminPlayerSubmission', () => {
  const playerName = 'Joe Mama';
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const answerIds = [0, 1];
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
    question: 'Who is my sunshine?',
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
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(v1RequestAdminPlayerSubmission(player.playerId, 1, answerIds)).toMatchObject({ });
  });

  test('If player ID does not exist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(-10, 1, answerIds)).toThrow(HTTPError[400]);
  });

  test('If question position is not valid for the session this player is in', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, -10, answerIds)).toThrow(HTTPError[400]);
  });

  test('Session is not in QUESTION_OPEN state', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, answerIds)).toThrow(HTTPError[400]);
  });

  test('If session is not yet up to this question', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question2);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 2, answerIds)).toThrow(HTTPError[400]);
  });

  test('Answer IDs are not valid for this particular question', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [10001, 10002])).toThrow(HTTPError[400]);
  });

  test('There are duplicate answer IDs provided', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [1, 1])).toThrow(HTTPError[400]);
  });

  test('Less than 1 answer ID was submitted', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(register.token as string, quiz.quizId as number, session.sessionId, 'SKIP_COUNTDOWN');
    expect(() => v1RequestAdminPlayerSubmission(player.playerId, 1, [])).toThrow(HTTPError[400]);
  });
});

// adminGuestPlayerStatus
describe('V1 - Test adminGuestPlayerStatus', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'You are my sunshine';
  const quizDescription = 'My only sunshine';
  const autoStartNum = 3;
  const playerName = 'THESUN';
  const question1: QuestionBody = {
    question: 'Who is my sunshine?',
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    points: 5,
    answers: [
      {
        answer: 'Lebron James',
        correct: true
      },
      {
        answer: 'Christian Politis',
        correct: false
      }
    ]
  };
  const question2: QuestionBody = {
    question: 'Who makes me happy?',
    duration: 1,
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    points: 5,
    answers: [
      {
        answer: 'Lebron James',
        correct: true
      },
      {
        answer: 'Leon Sun',
        correct: false
      }
    ]
  };

  test('Valid Input - Lobby State', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question1);
    v1RequestAdminQuizThumbnailUpdate(registered.token as string, quizId.quizId as number, 'http://google.com/some/image/path.jpg');
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerId = v1RequestAdminPlayerJoin(sessionId.sessionId, playerName);
    expect(v1RequestAdminGuestPlayerStatus(playerId.playerId)).toMatchObject({
      state: 'LOBBY',
      numQuestions: 1,
      atQuestion: 0
    });
  });

  test('Valid Input - Question Countdown State', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question1);
    v1RequestAdminQuizThumbnailUpdate(registered.token as string, quizId.quizId as number, 'http://google.com/some/image/path.jpg');
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerId = v1RequestAdminPlayerJoin(sessionId.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    expect(v1RequestAdminGuestPlayerStatus(playerId.playerId)).toMatchObject({
      state: 'QUESTION_COUNTDOWN',
      numQuestions: 1,
      atQuestion: 1
    });
  });

  test('Valid Input - Multiple Questions', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question1);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    v1RequestAdminQuizThumbnailUpdate(registered.token as string, quizId.quizId as number, 'http://google.com/some/image/path.jpg');
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerId = v1RequestAdminPlayerJoin(sessionId.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    expect(v1RequestAdminGuestPlayerStatus(playerId.playerId)).toMatchObject({
      state: 'QUESTION_COUNTDOWN',
      numQuestions: 2,
      atQuestion: 2
    });
  });

  test('Valid Input - Multiple Questions but at Question 0', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question1);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    v1RequestAdminQuizThumbnailUpdate(registered.token as string, quizId.quizId as number, 'http://google.com/some/image/path.jpg');
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerId = v1RequestAdminPlayerJoin(sessionId.sessionId, playerName);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'END');
    expect(v1RequestAdminGuestPlayerStatus(playerId.playerId)).toMatchObject({
      state: 'END',
      numQuestions: 2,
      atQuestion: 0
    });
  });

  test.each([
    { invalidPlayerId: -1 },
    { invalidPlayerId: 0 },
    { invalidPlayerId: null },
  ])('Player Id does not exist', ({ invalidPlayerId }) => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v2RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v2RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question1);
    v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    expect(() => v1RequestAdminGuestPlayerStatus(invalidPlayerId)).toThrow(HTTPError[400]);
  });
});

describe('V1 - Test playerSendMessage', () => {
  const playerName = 'Joe Mama';
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const message = 'Hello everyone! Nice to chat.';
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
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    expect(v1RequestPlayerSendMessage(player.playerId, message)).toMatchObject({});
  });

  test('If player ID does not exist', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    v1RequestAdminPlayerJoin(session.sessionId, playerName);
    expect(() => v1RequestPlayerSendMessage(-10, message)).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidMessage: '' },
    { invalidMessage: 'A'.repeat(101) },
  ])("Quiz name is less than 1 character or more than 100 characters: '$invalidMessage'", ({ invalidMessage }) => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
    const player = v1RequestAdminPlayerJoin(session.sessionId, playerName);
    expect(() => v1RequestPlayerSendMessage(player.playerId, invalidMessage)).toThrow(HTTPError[400]);
  });
});
