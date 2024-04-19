import { getData, setData } from './dataStore';
import httpError from 'http-errors';
import { State } from './interfaces';
import { start, setStart } from './session';
export let startTimer: ReturnType<typeof setTimeout>[] = [];

/**
  * Creates a new Guest Player
  *
  * @param {number} sessionId - sessionId of session they want to join
  * @param {string} name - Name of new Player
  *
  * @returns {number} - returns a playerId when player is created
*/
export function adminPlayerJoin(sessionId: number, name: string) {
  const data = getData();
  const session = data.sessions.find(session => session.quizSessionId === sessionId);

  if (!session) {
    throw httpError(400, 'Session Id does not refer to a valid session within this quiz.');
  }
  if (session.players.find(player => player.playerName === name)) {
    throw httpError(400, 'Name of user entered is not unique.');
  }
  if (session.state !== State.LOBBY) {
    throw httpError(400, 'Session must be in the lobby.');
  }

  const player = {
    playerId: session.players.length + 1,
    playerName: name,
    playerScore: 0
  };
  const autoStartNum = session.autoStartNum;

  session.players.push(player);

  setData(data);

  if (session.players.length === autoStartNum) {
    session.state = State.QUESTION_COUNTDOWN;
    startTimer.forEach(timer => clearTimeout(timer));
    startTimer = [];
    session.atQuestion = session.atQuestion + 1;

    startTimer.push(setTimeout(() => {
      session.state = State.QUESTION_OPEN;
      setStart(Math.floor(Date.now() / 1000));
      startTimer.push(setTimeout(() => {
        session.state = State.QUESTION_CLOSE;
      }, session.metadata.questions[session.atQuestion - 1].duration * 1000));
    }, 3000));
  }

  setData(data);

  return { playerId: player.playerId };
}

export function adminPlayerSubmission(playerid: number, questionposition: number, answerIds: number[]) {
  const data = getData();
  const session = data.sessions.find(session => session.players.find(player => player.playerId === playerid));
  if (!session) {
    throw httpError(400, 'Player does not exist.');
  }
  if (session.metadata.numQuestions < questionposition || questionposition < 1) {
    throw httpError(400, 'Question position is invalid.');
  }
  if (session.state !== State.QUESTION_OPEN) {
    throw httpError(400, 'Session must make the question avaliable first.');
  }
  if (session.atQuestion !== questionposition) {
    throw httpError(400, 'Session is not at this question yet.');
  }
  if (answerIds.length < 1) {
    throw httpError(400, 'No answers have been submitted.');
  }
  const questionAnswers = session.metadata.questions[questionposition - 1].answers;
  const isAnswerValid = questionAnswers.some(answer => answerIds.includes(answer.answerId));

  if (!isAnswerValid) {
    throw httpError(400, 'Answer does not exist for this question.');
  }
  if (answerIds.some((item, index) => answerIds.includes(item, index + 1))) {
    throw httpError(400, 'Duplicate answers have been submitted.');
  }

  const player = session.players.find(player => player.playerId === playerid);

  const attempt = {
    playerId: playerid,
    playerName: player.playerName,
    answers: answerIds,
    points: session.metadata.questions[questionposition - 1].points,
    timeTaken: Math.floor(Date.now() / 1000) - start
  };
  session.metadata.questions[questionposition - 1].attempts.push(attempt);
  setData(data);

  return { };
}

/**
 * Retrieves and calculates results for a specific question within a quiz session.
 *
 * @param {number} playerid - ID of the player requesting the results.
 * @param {number} questionposition - The position of the question within the quiz session.
 *
 * @returns {object} - Returns details including question ID, a list of players who answered the last question correctly,
 * average time taken to answer, and the percentage of correct answers.
 *
 * @throws {HttpError} - Throws error if validation fails.
 */

export function adminQuestionResult(playerid: number, questionposition: number) {
  const data = getData();
  const session = data.sessions.find(session => session.players.find(player => player.playerId === playerid));
  if (!session) {
    throw httpError(400, 'Player does not exist.');
  }
  if (session.metadata.numQuestions < questionposition || questionposition < 1) {
    throw httpError(400, 'Question position is invalid.');
  }
  if (session.state !== State.ANSWER_SHOW) {
    throw httpError(400, 'Session must make the question avaliable first.');
  }
  if (session.atQuestion !== questionposition) {
    throw httpError(400, 'Session is not at this question yet.');
  }

  const question = session.metadata.questions[questionposition - 1];
  let totalTime = 0;
  for (const attempt of question.attempts) {
    totalTime += attempt.timeTaken;
  }

  const correctPlayers: string[] = [];

  question.attempts.forEach(attempt => {
    const lastAnswerId = attempt.answers[attempt.answers.length - 1];
    const answerIsCorrect = question.answers.some(answer => answer.answerId === lastAnswerId && answer.correct);
    if (answerIsCorrect) {
      const player = session.players.find(p => p.playerId === attempt.playerId);
      correctPlayers.push(player.playerName);
    }
  });

  question.averageAnswerTime = totalTime / question.attempts.length;
  question.percentCorrect = correctPlayers.length / question.attempts.length;
  setData(data);

  return {
    questionId: question.questionId,
    playersCorrectList: correctPlayers,
    averageAnswerTime: question.averageAnswerTime,
    percentCorrect: question.percentCorrect
  };
}

/**
 * Sends a chat message to all players in the session.
 *
 * @param {number} playerid - ID of the player sending the message.
 * @param {string} messageBody - The chat message content.
 *
 * @returns {object} - An empty object when message is sent.
 *
 * @throws {HttpError} - Throws error if validation fails.
 */

export function playerSendMessage(playerid: number, messageBody: string) {
  const data = getData();

  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerid));

  if (!session) {
    throw httpError(400, 'Player ID does not refer to a valid player in any session.');
  }
  if (messageBody.length < 1 || messageBody.length > 100) {
    throw httpError(400, 'Message body must be between 1 and 100 characters.');
  }

  const player = session.players.find(player => player.playerId === playerid);

  session.messages.push({
    playerId: playerid,
    messageBody: messageBody,
    playerName: player.playerName,
    timeSent: Date.now()
  });

  setData(data);

  return {};
}

/**
 * Sends a chat message to all players in the session.
 *
 * @param {number} playerid - ID of the player sending the message.
 *
 * @returns {Message[]} - Returns an array of all the messages
 *
 * @throws {HttpError} - Throws error if validation fails.
 */

export function playerSessionMessages(playerid: number) {
  const data = getData();

  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerid));

  if (!session) {
    throw httpError(400, 'Player ID does not refer to a valid player in any session.');
  }
  return {
    messages: session.messages.filter(message => message.playerId === playerid).map(message => {
      return {
        messageBody: message.messageBody,
        playerId: message.playerId,
        playerName: message.playerName,
        timeSent: Math.round(message.timeSent / 1000) * 1000
      };
    })
  };
}
