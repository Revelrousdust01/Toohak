import { getData, setData } from './dataStore';
import httpError from 'http-errors';
import { State } from './interfaces';
import { start } from './session';
import { adminQuizSessionUpdate } from './session'

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
    adminQuizSessionUpdate(registered.token, quizId.quizId, sessionId, 'NEXT_QUESTION');
  }

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
  if (!session.metadata.questions[questionposition - 1].answers.find(answer => answerIds.find(answerid => answer.answerId === answerid))) {
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
