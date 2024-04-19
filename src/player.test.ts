import { QuestionBody } from './interfaces';
import {
  v1RequestClear, v1RequestAdminAuthRegister, v1RequestAdminPlayerJoin, v1RequestAdminQuizCreate, v1RequestAdminQuizQuestionCreate,
  v1RequestAdminQuizSession, v1RequestAdminQuizSessionUpdate, v1RequestAdminPlayerSubmission, v1RequestAdminQuestionResult,
  v1RequestAdminQuizSessionStatus, requestSleepSync, v1RequestPlayerSendMessage
} from './requests';
import HTTPError from 'http-errors';
beforeEach(() => {
  v1RequestClear();
});

afterAll(() => {
  v1RequestClear();
});

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

// adminQuestionResult
describe('V1 - Test adminQuestionResult', () => {
  const player1 = 'player1';
  const player2 = 'player2';
  const player3 = 'player3';
  const firstName = 'Jeffery';
  const lastName = 'Zhang';
  const email = 'jeffery.zhang385@gmail.com';
  const password = 'str0ngpassword';
  const quizName = 'New Quiz';
  const quizDescription = 'This is a new quiz';
  const autoStartNum = 3;
  const question: QuestionBody = {
    question: 'Who is the Monarch of England?',
    duration: 2,
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
    duration: 2,
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

  test('Valid inputs for all correct for question 1', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    const playerTwo = v1RequestAdminPlayerJoin(sessionId.sessionId, player2);
    const playerThree = v1RequestAdminPlayerJoin(sessionId.sessionId, player3);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [1, 0]);
    v1RequestAdminPlayerSubmission(playerTwo.playerId, 1, [0]);
    v1RequestAdminPlayerSubmission(playerThree.playerId, 1, [1, 0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuestionResult(playerOne.playerId, 1)).toMatchObject(
      {
        questionId: questionId.questionId,
        playersCorrectList: [
          'player1',
          'player2',
          'player3'
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number)
      }
    );
  });

  test('Valid inputs for all incorrect for question 1', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    const playerTwo = v1RequestAdminPlayerJoin(sessionId.sessionId, player2);
    const playerThree = v1RequestAdminPlayerJoin(sessionId.sessionId, player3);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [1]);
    v1RequestAdminPlayerSubmission(playerTwo.playerId, 1, [0, 1]);
    v1RequestAdminPlayerSubmission(playerThree.playerId, 1, [1]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuestionResult(playerTwo.playerId, 1)).toMatchObject(
      {
        questionId: questionId.questionId,
        playersCorrectList: [
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number)
      }
    );
  });

  test('Valid inputs for mixed correct/incorrect for question 1', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    const playerTwo = v1RequestAdminPlayerJoin(sessionId.sessionId, player2);
    const playerThree = v1RequestAdminPlayerJoin(sessionId.sessionId, player3);
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [0]);
    v1RequestAdminPlayerSubmission(playerTwo.playerId, 1, [1]);
    v1RequestAdminPlayerSubmission(playerThree.playerId, 1, [1, 0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuestionResult(playerThree.playerId, 1)).toMatchObject(
      {
        questionId: questionId.questionId,
        playersCorrectList: [
          'player1',
          'player3'
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number)
      }
    );
  });

  test('Valid inputs for multiple questions and testing NEXT_QUESTION action', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const questionId = v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question2);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    requestSleepSync(1000);
    v1RequestAdminPlayerSubmission(playerOne.playerId, 2, [1, 0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(v1RequestAdminQuestionResult(playerOne.playerId, 2)).toMatchObject(
      {
        questionId: questionId.questionId,
        playersCorrectList: [
          'player1',
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number)
      }
    );
  });

  test('If player ID does not exist', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(() => v1RequestAdminQuestionResult(-10, 1)).toThrow(HTTPError[400]);
  });

  test('If question position is not valid for the session this player is in', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [1, 0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(() => v1RequestAdminQuestionResult(playerOne.playerId, -10)).toThrow(HTTPError[400]);
  });

  test('Session is not in ANSWER_SHOW state', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [0]);
    expect(() => v1RequestAdminQuestionResult(playerOne.playerId, 1)).toThrow(HTTPError[400]);
  });

  test('If session is not yet up to this question', () => {
    const registered = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quizId = v1RequestAdminQuizCreate(registered.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(registered.token as string, quizId.quizId as number, question);
    const sessionId = v1RequestAdminQuizSession(registered.token, quizId.quizId, autoStartNum);
    const playerOne = v1RequestAdminPlayerJoin(sessionId.sessionId, player1);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    v1RequestAdminQuizSessionUpdate(registered.token as string, quizId.quizId as number, sessionId.sessionId, 'SKIP_COUNTDOWN');
    v1RequestAdminPlayerSubmission(playerOne.playerId, 1, [1, 0]);
    v1RequestAdminQuizSessionUpdate(registered.token, quizId.quizId, sessionId.sessionId, 'GO_TO_ANSWER');
    expect(() => v1RequestAdminQuestionResult(playerOne.playerId, 2)).toThrow(HTTPError[400]);
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
