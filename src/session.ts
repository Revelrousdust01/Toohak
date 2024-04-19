import { getData, setData } from './dataStore';
import { findQuiz, validQuizId, validToken, validAction } from './helper';
import httpError from 'http-errors';
import { type Quiz, type SessionsList, Action, State, SessionStatus } from './interfaces';
export let timers: ReturnType<typeof setTimeout>[] = [];
export let start: number;

/**
 * Creates a new quiz session if conditions permit, including session count and quiz validation. The session starts in the LOBBY state and waits for players.
 *
 * @param token - Authentication token to validate user access.
 * @param quizid - Identifier for the quiz to create a session for.
 * @param autoStartNum - Number of players required for the session to automatically start; must be 50 or less.
 *
 * @returns {object} - Contains the unique session ID for the newly created session.
 * @throws {ErrorObject} - Throws errors for invalid token, quiz in trash, quiz without questions, or exceeding session limit.
 */

export function adminQuizSession(token: string, quizid: number, autoStartNum: number): object {
  const data = getData();
  const checkToken = validToken(token, data);
  if (autoStartNum > 50) {
    throw httpError(400, 'autoStartNum must be 50 or less.');
  }

  const activeSessions = data.sessions.filter(session => session.state !== 'END').slice(0, 10);

  if (activeSessions.length >= 10) {
    throw httpError(400, 'A maximum of 10 sessions that are not in END state currently exist for this quiz.');
  }

  validQuizId(quizid, checkToken, data);

  if (data.trash.find(quiz => quiz.quizId === quizid)) {
    throw httpError(400, 'The quiz must not be in trash.');
  }

  const quiz = findQuiz(quizid, data) as Quiz;

  const newSessionId = Date.now() + Math.floor(Math.random() * 1000);

  if (quiz.questions === null || quiz.questions.length === 0) {
    throw httpError(400, 'Quiz does not have any questions.');
  }
  data.sessions.push({
    metadata: {
      quizId: quizid,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description,
      numQuestions: quiz.questionCounter,
      questions: quiz.questions.map(question => {
        return {
          questionId: question.questionId,
          question: question.question,
          duration: question.duration,
          points: question.points,
          thumbnail: question.thumbnailUrl,
          answers: question.answers,
          averageAnswerTime: 0,
          percentCorrect: 0,
          attempts: []
        };
      }),
      duration: quiz.duration,
      thumbnail: quiz.thumbnailUrl
    },
    quizSessionId: newSessionId,
    state: State.LOBBY,
    autoStartNum: autoStartNum,
    atQuestion: 0,
    messages: [],
    players: []
  });

  setData(data);

  return {
    sessionId: newSessionId,
  };
}

/**
 * Modifies a quiz session's state based on specified actions, verifying all inputs for validity.
 *
 * @param token - Authentication token for user validation.
 * @param quizid - Unique identifier for the target quiz.
 * @param sessionId - Unique identifier for the specific quiz session.
 * @param action - Desired action to execute, defined in the Action enum.
 *
 * @returns {object} - Returns an empty object upon a successful update.
 *
 * @throws {ErrorObject} - Errors occur if the token, quizid, sessionId are invalid, the action is not in the Action enum, or the action is inappropriate for the current session state.
 */

export function adminQuizSessionUpdate(token: string, quizid: number, sessionId: number, action: Action): object {
  const data = getData();
  const checkToken = validToken(token, data);
  validQuizId(quizid, checkToken, data);

  if (!Object.keys(Action).includes(action)) {
    throw httpError(400, 'Invalid Action enum');
  }

  const sessionDetails = data.sessions.find(session => session.quizSessionId === sessionId);
  if (!sessionDetails || sessionDetails.metadata.quizId !== quizid) {
    throw httpError(400, 'Session Id does not refer to a valid session within this quiz');
  }

  const checkAction = validAction(sessionId, action, data);
  const currentState = sessionDetails.state;
  if (!checkAction.valid || (sessionDetails.metadata.questions.length === sessionDetails.atQuestion &&
    (currentState === State.ANSWER_SHOW || currentState === State.QUESTION_CLOSE) &&
    action === Action.NEXT_QUESTION)) {
    throw httpError(400, `action: ${action} cannot be applied in the current state: ${currentState}`);
  }

  if (action === Action.SKIP_COUNTDOWN) {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
    sessionDetails.state = State.QUESTION_OPEN;
    start = Math.floor(Date.now() / 1000);
    const newTimer = setTimeout(() => {
      sessionDetails.state = State.QUESTION_CLOSE;
      setData(data);
    }, sessionDetails.metadata.questions[sessionDetails.atQuestion - 1].duration * 1000);

    timers.push(newTimer);
  }

  if (action === Action.NEXT_QUESTION) {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
    sessionDetails.atQuestion = sessionDetails.atQuestion + 1;

    timers.push(setTimeout(() => {
      sessionDetails.state = State.QUESTION_OPEN;
      start = Math.floor(Date.now() / 1000);

      timers.push(setTimeout(() => {
        sessionDetails.state = State.QUESTION_CLOSE;
      }, sessionDetails.metadata.questions[sessionDetails.atQuestion - 1].duration * 1000));
    }, 3000));
  }

  if (action === Action.GO_TO_FINAL_RESULTS || action === Action.END) {
    sessionDetails.atQuestion = 0;
  }

  sessionDetails.state = checkAction.state;
  setData(data);

  return { };
}

export function setStart(newValue: number) {
  start = newValue;
}

export function resetStart() {
  start = 0;
}

/**
 * Retrieves lists of active and inactive sessions for a specific quiz, differentiated by whether the session state is 'END'.
 *
 * @param token - Authentication token to validate user access.
 * @param quizid - Identifier for the quiz whose sessions are to be viewed.
 *
 * @returns {SessionsList} - Object containing arrays of active and inactive session IDs.
 *
 * @throws {ErrorObject} - Throws errors for invalid token or invalid quiz ID.
 */
export function adminViewQuizSessions(token: string, quizid: number): SessionsList {
  const data = getData();
  const checkToken = validToken(token, data);
  validQuizId(quizid, checkToken, data);

  const sessionsForQuiz = data.sessions.filter(session => session.metadata.quizId === quizid);
  const activeSessions = sessionsForQuiz.filter(session => session.state !== State.END).map(session => session.quizSessionId);
  const inactiveSessions = sessionsForQuiz.filter(session => session.state === State.END).map(session => session.quizSessionId);

  activeSessions.sort((a, b) => a - b);
  inactiveSessions.sort((a, b) => a - b);

  return {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions
  };
}

/**
 * Get the status of a particular quiz session
 * @param token - Authentication token to validate user access.
 * @param quizid - Identifier for the quiz whose sessions are to be viewed.
 * @param sessionid - Unique identifier for the specific quiz session.
 *
 * @returns {SessionStatus} - Object containing arrays of Session info and status of a particular session.
 *
 * @throws {ErrorObject} -Throw errors for invalid token, invalid sessionId, invalid quizid.
 */
export function adminQuizSessionStatus(token: string, quizid: number, sessionid: number): SessionStatus {
  const data = getData();

  const checkToken = validToken(token, data);
  validQuizId(quizid, checkToken, data);

  const sessionDetails = data.sessions.find(session => session.quizSessionId === sessionid);
  if (!sessionDetails || sessionDetails.metadata.quizId !== quizid) {
    throw httpError(400, 'Session Id does not refer to a valid session within this quiz');
  }

  const quiz = findQuiz(quizid, data);
  const validQuiz = quiz as Quiz;

  const foundPlayers = [];
  for (const players of sessionDetails.players) {
    foundPlayers.push(players.playerName);
  }

  const quizQuestions = [];
  const foundAnswers = [];

  for (const questions of validQuiz.questions) {
    for (const seekAnswers of questions.answers) {
      const answers = {
        answerId: seekAnswers.answerId,
        answer: seekAnswers.answer,
        colour: seekAnswers.colour,
        correct: seekAnswers.correct
      };
      foundAnswers.push(answers);
    }
    const foundQuestion = {
      questionId: questions.questionId,
      question: questions.question,
      duration: questions.duration,
      thumbnailUrl: questions.thumbnailUrl,
      points: questions.points,
      answers: foundAnswers
    };
    quizQuestions.push(foundQuestion);
  }

  return {
    state: sessionDetails.state,
    atQuestion: sessionDetails.atQuestion,
    players: foundPlayers,
    metadata: {
      quizId: quizid,
      name: validQuiz.name,
      timeCreated: validQuiz.timeCreated,
      timeLastEdited: validQuiz.timeLastEdited,
      description: validQuiz.description,
      numQuestions: validQuiz.questionCounter,
      questions: quizQuestions,
      duration: validQuiz.duration,
      thumbnailUrl: validQuiz.thumbnailUrl
    }
  };
}
