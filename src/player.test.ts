import { QuestionBody } from "./interfaces";
import { requestClear, v1RequestAdminAuthRegister, v1RequestAdminPlayerJoin, v1RequestAdminQuizCreate, v1RequestAdminQuizQuestionCreate, v1RequestAdminQuizSession, v1RequestAdminQuizSessionUpdate } from "./requests";
import HTTPError from 'http-errors';
beforeEach(() => {
	requestClear();
});

afterAll(() => {
	requestClear();
});

describe('V1 - Test adminQuizCreate', () => {
	const playerName = 'Joe Mama'
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
		expect(v1RequestAdminPlayerJoin(session.sessionId, playerName)).toMatchObject({ sessionId: expect.any(Number) });
  });

	test('Name of user entered is not unique (compared to other users who have already joined', () => {
    const register = v1RequestAdminAuthRegister(email, password, lastName, firstName);
    const quiz = v1RequestAdminQuizCreate(register.token as string, quizName, quizDescription);
    v1RequestAdminQuizQuestionCreate(register.token as string, quiz.quizId as number, question);
    const session = v1RequestAdminQuizSession(register.token, quiz.quizId, autoStartNum);
		v1RequestAdminPlayerJoin(session.sessionId, playerName)
		expect(() => v1RequestAdminPlayerJoin(session.sessionId, "Dankster")).toThrow(HTTPError[400]);
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
    v1RequestAdminQuizSessionUpdate(register.token, quiz.quizId, session.sessionId, 'NEXT_QUESTION')
		expect(() => v1RequestAdminPlayerJoin(session.sessionId, playerName)).toThrow(HTTPError[400]);
  });

});