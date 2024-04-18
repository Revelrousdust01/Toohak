import { getData, setData } from './dataStore';
import { findQuiz, validQuizId, validToken, validAction, clearTimer } from './helper';
import httpError from 'http-errors';
import { type Quiz, Action, State } from './interfaces';
export let timers: ReturnType<typeof setTimeout>[] = [];

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
 * Updates the session state of a quiz based on the provided action. This function ensures the action is applicable and makes changes to the state accordingly.
 *
 * @param {string} token - Authentication token to validate user session.
 * @param {number} quizid - Unique identifier for the quiz whose session is being updated.
 * @param {number} sessionId - Unique identifier for the session within the quiz to be updated.
 * @param {Action} action - Action to be performed on the session. Valid actions are defined in the Action enum.
 *
 * @returns {object} - Returns an empty object upon successful update.
 *
 * @throws {ErrorObject} - Errors may be thrown based on the following conditions:
 *   - Token is invalid or does not refer to a valid logged-in user session.
 *   - Quiz ID does not match any existing quizzes accessible by the token's user.
 *   - Session ID does not refer to a valid session within the specified quiz.
 *   - Action provided does not exist within the Action enum.
 *   - Action cannot be applied in the current state of the session, such as attempting to move to the next question when no more questions are available, or the session has ended.
 *   - Skipping countdown or moving to the next question in inappropriate session states.
 *
 * The function first validates the token and quiz ID. It then checks the validity of the session ID and the action.
 * If the action is valid, it updates the session state accordingly. For actions that influence timing (like skipping countdowns or moving to next questions),
 * it adjusts timers. If the session has reached its final state, it resets relevant session parameters. All updates are persisted to the data storage.
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

      timers.push(setTimeout(() => {
        sessionDetails.state = State.QUESTION_CLOSE;
      }, sessionDetails.metadata.questions[sessionDetails.atQuestion - 1].duration * 1000));
    }, 3000));
  }

  if (sessionDetails.state === State.FINAL_RESULTS || sessionDetails.state === State.END) {
    sessionDetails.atQuestion = 0;
  }

  sessionDetails.state = checkAction.state;
  setData(data);

  return { };
}
