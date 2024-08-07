import { getData } from './dataStore';
import { type ErrorObject, type User, type Quiz, type QuestionBody, type DataStore, type Question, type Answer, State, validActionType, Action, type Session } from './interfaces';
import validator from 'validator';
import httpError from 'http-errors';

/**
  * Return the quiz, given the quizId
  *
  * @param {number} quizId - relevent quizId
  *
  * @returns { Quiz } - Returns the quiz if quiz is found
  * @returns { } - Returns empty object if quiz is not found
*/

export function findQuiz(quizid: number, data: DataStore): object | Quiz {
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);
  if (!quiz) {
    return { };
  }
  return quiz;
}

/**
  * Validates email of certain conditions:
  * - Email address is used by another user.
  * - Email does not satisfy this validator
  *
  * @param {string} email - Email of user
  *
  * @returns { } - Returns empty object when name is valid
*/
export function validEmail(email: string): object {
  const data = getData();
  if (data.users.find(user => user.email === email)) { throw httpError(400, 'Email address is already used by another user.'); } else if (!validator.isEmail(email)) { throw httpError(400, 'Please enter a valid email.'); }

  return { };
}

/**
  * Validates First or Last name of certain Conditions
  * - Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  * - Name is less than 2 characters or more than 20 characters.
  *
  * @param {string} name - First or last name of user
  * @param {boolean} isFirst - First Name bool check
  *
  * @returns { { error: }  } - Returns object with error when name is invalid
  * @returns { } - Returns empty object when name is valid
*/
export function validName(name: string, isFirst: boolean): object {
  const characterRegex = /^[A-Za-z\s'-]+$/;

  if (!characterRegex.test(name)) { throw httpError(400, (isFirst ? 'First' : 'Last').concat(' name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.')); } else if (name.length < 2 || name.length > 20) { throw httpError(400, (isFirst ? 'First' : 'Last').concat(' name must not be less than 2 characters or more than 20 characters.')); }

  return { };
}

/**
  * Validates password of certain conditions:
  * - Password is less than 8 characters.
  * - Password does not contain at least one number and at least one letter.
  *
  * @param {string} password - Password of user
  *
  * @returns { { error: }  } - Returns object with error when password is invalid
  * @returns { } - Returns empty object when name is valid
*/
export function validPassword(password: string): object {
  const digitsAndLetters = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;

  if (password.length < 8) { throw httpError(400, 'Password must contain at least 8 characters.'); } else if (!digitsAndLetters.test(password)) { throw httpError(400, 'Password must contain at least letter and one number.'); }

  return { };
}

/**
  * Retrieves a random colour
  *
  * @returns { string } - Returns a random colour as a string
*/
export function getColour(): string {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  return colors[randomColorIndex];
}

/**
  * Validates Question based on a few conditions:
  * - Question string is less than 5 characters in length or greater than 50 characters in length
  * - The question has more than 6 answers or less than 2 answers
  * - The question duration is not a positive number
  * - The sum of the question durations in the quiz exceeds 3 minutes
  * - The points awarded for the question are less than 1 or greater than 10
  * - The length of any answer is shorter than 1 character long, or longer than 30 characters long
  * - Any answer strings are duplicates of one another (within the same question)
  * - There are no correct answers
  *
  * @param {QuestionBody} questionBody - Question
  * @param {Quiz} quiz -  Assosicated Quiz
  *
  * @returns { { error: }  } - Returns object when conditions fail
  * @returns { } - Returns empty object when it clears all checks
*/
export function validQuestion(questionBody: QuestionBody, quiz: Quiz): object | ErrorObject {
  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw httpError(400, 'Question string is less than 5 characters in length or greater than 50 characters in length.');
  } else if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    throw httpError(400, 'The question has more than 6 answers or less than 2 answers.');
  } else if (questionBody.duration < 1) {
    throw httpError(400, 'The question duration is not a positive number.');
  }
  let counter = 0;
  for (const question of quiz.questions) {
    counter += question.duration;
  }
  if (counter + questionBody.duration > 180) {
    throw httpError(400, 'The sum of the question durations in the quiz exceeds 3 minutes.');
  } else if (questionBody.points < 1 || questionBody.points > 10) {
    throw httpError(400, 'The points awarded for the question are less than 1 or greater than 10.');
  }
  for (const questionAnswer of questionBody.answers) {
    if (questionAnswer.answer.length < 1 || questionAnswer.answer.length > 30) {
      throw httpError(400, 'The length of answer is shorter than 1 character long, or longer than 30 characters long.');
    }
  }
  const hasDuplicateNames = questionBody.answers.some((item, index) => {
    const firstIndex = questionBody.answers.findIndex(a => a.answer === item.answer);
    return firstIndex !== index;
  });
  if (hasDuplicateNames) {
    throw httpError(400, 'Duplicate of answers exist in same question.');
  }
  if (!questionBody.answers.find(answer => answer.correct === true)) {
    throw httpError(400, 'There are no correct answers.');
  }
  return {

  };
}

/**
  * Hashes password
  *
  * @param {string} password - Password to be hashed.
  *
  * @returns { string } - Returns hashed string.
*/

export function setHash(password: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
  * Checks for valid Quiz ID
  *
  * @param {string} token - Token of session
  * @param {number} quizId - Relevent quizId
  *
  * @returns { { error: } } - Returns object with error when quizid is invalid
  * @returns { } - Returns empty object if quizid is valid
*/
export function validQuizId(quizid: number, user: User, data: DataStore): ErrorObject | object {
  const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);
  const trashedQuizIndex = data.trash.findIndex(quizzes => quizzes.quizId === quizid);
  if (quizIndex === -1 && trashedQuizIndex === -1) { throw httpError(403, 'Quiz ID does not refer to a valid quiz.'); }

  if (!user.ownedQuizzes.includes(quizid)) { throw httpError(403, 'Quiz ID does not refer to a quiz that this user owns.'); }

  return { };
}

/**

  * Checks for validToken
  *
  * @param {string} token - Token of session
  * @param {data} DataStore - DataStore
  *
  * @returns { User } - Returns the user within the correct session when the token is valid
*/
export function validToken(token: string, data: DataStore): User {
  const session = data.userSessions.find(session => session.sessionId === token);
  if (!session) { throw httpError(401, 'Token is empty or invalid.'); }

  return data.users.find(user => user.userId === session.userId);
}

/**
  * Validates Quiz name of certain Conditions
  * - Name contains characters other than lowercase letters, uppercase letters, numbers or spaces.
  * - Name is less than 3 characters or more than 30 characters.
  *
  * @param {string} name - Name of quiz
  *
  * @returns { { error: }  } - Returns object with error when quiz name is invalid
  * @returns { } - Returns empty object when name is valid
*/
export function validQuizName(name: string): object | ErrorObject {
  const characterRegex = /^[a-zA-Z0-9 ]+$/;

  if (!characterRegex.test(name)) { throw httpError(400, 'Name contains characters other than lowercase letters, uppercase letters, numbers or spaces.'); } else if (name.length < 3 || name.length > 30) { throw httpError(400, ' Name must not be less than 3 characters or more than 30 characters.'); }

  return { };
}

/**
  * Setup Answers for Questions
  *
  * @param {Question} newQuestion - New Question
  * @param {QuestionBody} questionBody - Body Passed in
  *
  * @returns { Question } - Returns Question with modifications.
*/
export function setupAnswers(newQuestion: Question, questionBody: QuestionBody): Question {
  for (const [index, answer] of questionBody.answers.entries()) {
    const newAnswer: Answer = {
      answerId: index,
      answer: answer.answer,
      colour: getColour(),
      correct: answer.correct
    };
    newQuestion.answers.push(newAnswer);
  }

  return newQuestion;
}

/**
  * Checks Thumnail follows standards
  *
  * @param {QuestionBody} questionBody - Body Passed in
  *
  * @returns { object } - Returns object if passes validation.
*/
export function validateThumbnail(thumbnailUrl: string): object {
  const fileExtensionRegex = /\.(jpg|jpeg|png)$/i;
  switch (true) {
    case thumbnailUrl === '':
      throw httpError(400, 'The thumbnailUrl is an empty string.');
    case !thumbnailUrl.startsWith('http://') && !thumbnailUrl.startsWith('https://'):
      throw httpError(400, "The thumbnailUrl does not begin with 'http://' or 'https://'.");
    case !fileExtensionRegex.test(thumbnailUrl):
      throw httpError(400, 'The thumbnailUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png.');
    default:
      return { };
  }
}

/**
  * Updates the question values
  *
  * @param {Question} question - Question to be modified
  * @param {QuestionBody} questionBody - Body Passed in
  * @param {number} version - Version of endpoint
  *
  * @returns { object } - Returns object if passes validation.
*/
export function updateQuestion(question: Question, questionBody: QuestionBody, version: number): object {
  question.question = questionBody.question;
  question.duration = questionBody.duration;
  question.points = questionBody.points;
  question.answers = [];
  for (const [index, answer] of questionBody.answers.entries()) {
    const newAnswer: Answer = {
      answerId: index,
      answer: answer.answer,
      colour: getColour(),
      correct: answer.correct
    };
    question.answers.push(newAnswer);
  }
  if (version === 2) {
    question.thumbnailUrl = questionBody.thumbnailUrl;
  }
  return { };
}

/**
 * Player validator
 *
 * @param playerid - Player identification of player
 * @param {data} DataStore
 *
 * @returns { { error: } } - Returns object with error when playerId is invalid
 * @returns {Session} - Returns session of player when playerId is valid
 */
export function validPlayer(playerid: number, data: DataStore): Session {
  const session = data.sessions.find(session => session.players.find(player => player.playerId === playerid));
  if (!session) {
    throw httpError(400, 'Player does not exist.');
  }
  return session;
}

/**
  * Passes the specified amount of time
  *
  * @param {number} ms - ms needed to be passed
  *
  * @returns
*/
export function validAction(sessionId: number, action: string, data: DataStore): validActionType {
  const session = data.sessions.find(session => session.quizSessionId === sessionId);
  switch (session.state) {
    case State.LOBBY:
      if (action === Action.NEXT_QUESTION) {
        return {
          valid: true,
          state: State.QUESTION_COUNTDOWN
        };
      } else if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.QUESTION_COUNTDOWN:
      if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else if (action === Action.SKIP_COUNTDOWN) {
        return {
          valid: true,
          state: State.QUESTION_OPEN
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.QUESTION_OPEN:
      if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else if (action === Action.GO_TO_ANSWER) {
        return {
          valid: true,
          state: State.ANSWER_SHOW
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.QUESTION_CLOSE:
      if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else if (action === Action.GO_TO_ANSWER) {
        return {
          valid: true,
          state: State.ANSWER_SHOW
        };
      } else if (action === Action.GO_TO_FINAL_RESULTS) {
        return {
          valid: true,
          state: State.FINAL_RESULTS
        };
      } else if (action === Action.NEXT_QUESTION) {
        return {
          valid: true,
          state: State.QUESTION_COUNTDOWN
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.ANSWER_SHOW:
      if (action === Action.NEXT_QUESTION) {
        return {
          valid: true,
          state: State.QUESTION_COUNTDOWN
        };
      } else if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else if (action === Action.GO_TO_FINAL_RESULTS) {
        return {
          valid: true,
          state: State.FINAL_RESULTS
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.FINAL_RESULTS:
      if (action === Action.END) {
        return {
          valid: true,
          state: State.END
        };
      } else {
        return {
          valid: false,
          state: null
        };
      }
    case State.END:
      return {
        valid: false,
        state: null
      };
  }
}
