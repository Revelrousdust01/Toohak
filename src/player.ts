import { getData, setData } from './dataStore';
import httpError from 'http-errors';
import { State } from './interfaces';
import { start } from './session';

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

  session.players.push(player);
  setData(data);

  return { playerId: player.playerId };
}

export function adminPlayerSubmission(playerid: number, questionposition: number, answerIds: number[]) {
  const data = getData();
  const session = data.sessions.find(session => session.players.find(player => player.playerId === playerid));
  // console.log(session.metadata.questions.find(question => question.questionId === questionposition));
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
