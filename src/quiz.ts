import { getData, setData } from './dataStore';
import { type ErrorObject, type Quiz, type createQuizReturn, type QuizArray, type QuestionBody, type Question, type duplicateReturn, type createQuestionReturn, State } from './interfaces';
import { findQuiz, validQuestion, validQuizName, validQuizId, validToken, setupAnswers, validateThumbnail, updateQuestion } from './helper';
import httpError from 'http-errors';
export const timers: ReturnType<typeof setTimeout>[] = [];

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {string} token - ID of user
 * @param {string} name - Name of user
 * @param {string} description - Basic details about new quiz.
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 *  Name contains invalid characters. Valid characters are alphanumeric and spaces
 *  Name is either less than 3 characters long or more than 30 characters long
 *  Name is already used by the current logged in user for another quiz
 *  Description is more than 100 characters in length (note: empty strings are OK)
 *  Token is empty or invalid (does not refer to valid logged in user session)
 *
 * @returns {createQuizReturn} - Returns the quizID of the user.
 */

export function adminQuizCreate(token: string, name: string, description: string): ErrorObject | createQuizReturn {
  const data = getData();

  const checkToken = validToken(token, data);

  validQuizName(name);

  if (description.length > 100) { throw httpError(400, 'Description must be less than 100 charactes.'); }

  const existingQuiz = data.quizzes.find(quiz => quiz.name === name);

  if (existingQuiz) {
    if (checkToken.ownedQuizzes.find(quiz => quiz === existingQuiz.quizId)) { throw httpError(400, 'Name is already used by the current logged in user for another quiz.'); }
  }

  const quizId = data.quizCounter++;

  const newQuiz: Quiz = {
    quizId: quizId,
    questionCounter: 0,
    description: description,
    duration: 0,
    name: name,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
    questions: [],
  };

  data.users.find(user => user.userId === checkToken.userId).ownedQuizzes.push(quizId);

  data.quizzes.push(newQuiz);
  setData(data);

  return { quizId: newQuiz.quizId };
}

/**
  * Update the name of the relevant quiz.
  *
  * @param {string} token - User ID of admin
  * @param {number} quizid - relevant quizID
  * @param {string} description - new description for the relevant quiz
  *
  * @returns {object} - returns an empty object when a quiz description is updated
*/

export function adminQuizDescriptionUpdate(token: string, quizid: number, description: string): ErrorObject | object {
  const data = getData();

  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);

  if (description.length > 100) { throw httpError(400, 'Description must be less than 100 characters.'); }

  data.quizzes.find(quiz => quiz.quizId === quizid).description = description;
  setData(data);
  return { };
}

/**
 * Get all of the relevant information about the current quiz.
 *
 * @param {string} token - User ID of admin
 * @param {number} quizid - quizID of current quiz
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @return {QuizArray} - returns an array of quizzes
 */

export function adminQuizInfo(token: string, quizid: number) {
  const data = getData();

  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);

  const quiz = findQuiz(quizid, data);
  const validQuiz = quiz as Quiz;

  const questionsWithAnswers = validQuiz.questions.map(question => {
    const answers = question.answers.map(answer => ({
      answerId: answer.answerId,
      answer: answer.answer,
      colour: answer.colour,
      correct: answer.correct
    }));

    if (validQuiz.thumbnailUrl) {
      return {
        questionId: question.questionId,
        question: question.question,
        duration: question.duration,
        thumbnailUrl: validQuiz.thumbnailUrl,
        points: question.points,
        answers: answers
      };
    } else {
      return {
        questionId: question.questionId,
        question: question.question,
        duration: question.duration,
        points: question.points,
        answers: answers
      };
    }
  });

  const totalDuration = validQuiz.questions.reduce((acc, question) => acc + question.duration, 0);

  if (validQuiz.thumbnailUrl) {
    return {
      quizId: validQuiz.quizId,
      name: validQuiz.name,
      timeCreated: validQuiz.timeCreated,
      timeLastEdited: validQuiz.timeLastEdited,
      description: validQuiz.description,
      numQuestions: validQuiz.questions.length,
      questions: questionsWithAnswers,
      duration: totalDuration,
      thumbnailUrl: validQuiz.thumbnailUrl,
    };
  } else {
    return {
      quizId: validQuiz.quizId,
      name: validQuiz.name,
      timeCreated: validQuiz.timeCreated,
      timeLastEdited: validQuiz.timeLastEdited,
      description: validQuiz.description,
      numQuestions: validQuiz.questions.length,
      questions: questionsWithAnswers,
      duration: totalDuration,
    };
  }
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {string} token - ID of user
 *
 * @return {ErrorObject} - returns error object based on following conditions:
 *
 * Token is empty or invalid (does not refer to valid logged in user session)
 *
 * @return {QuizArray} - returns an array of quizzes in the list;
 */

export function adminQuizList(token: string): QuizArray {
  const data = getData();

  const checkToken = validToken(token, data);

  const ownedQuizzes = checkToken.ownedQuizzes;
  const quizInTrash = data.trash;
  const quizzes = [];

  if (quizInTrash.length === 0) {
    for (const ownedQuiz of ownedQuizzes) {
      const quizFind = findQuiz(ownedQuiz, data);
      const quiz = {
        quizId: ownedQuiz,
        name: (quizFind as Quiz).name
      };
      quizzes.push(quiz);
    }
  } else {
    for (const ownedQuiz of ownedQuizzes) {
      for (const trashedQuiz of quizInTrash) {
        if (ownedQuiz !== trashedQuiz.quizId) {
          const quizFind = findQuiz(ownedQuiz, data);
          const quiz = {
            quizId: ownedQuiz,
            name: (quizFind as Quiz).name
          };
          quizzes.push(quiz);
        }
      }
    }
  }
  return {
    quizzes: quizzes
  };
}

/**
  * Update the name of the relevant quiz.
  *
  * @param {string} token - User ID of admin
  * @param {number} quizid - relevant quizID
  * @param {string} name - new name for the relevant quiz
  *
  * @returns {object} - returns an empty object when a name is updated
*/

export function adminQuizNameUpdate(token: string, quizid: number, name: string): ErrorObject | object {
  const data = getData();
  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);
  validQuizName(name);

  const existingQuiz = data.quizzes.find(quiz => quiz.name === name);
  if (checkToken.ownedQuizzes.find(quiz => quiz === existingQuiz?.quizId)) {
    throw httpError(400, 'Name is already used by the current logged in user for another quiz.');
  }
  data.quizzes.find(quiz => quiz.quizId === quizid).name = name;
  setData(data);
  return { };
}

/**
  * Create a new Quiz Question.
  *
  * @param {string} token - Token
  * @param {number} quizid - Relevant quizID
  * @param {QuestionBody} questionBody - Question
  *
  * @returns { { error: }  } - Returns object when conditions fail
  * @returns { object } - returns an empty object question is updated.
*/

export function adminQuizQuestionCreate(token: string, quizid: number, questionBody: QuestionBody, version: number): createQuestionReturn {
  const data = getData();
  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);

  const quiz = findQuiz(quizid, data);

  validQuestion(questionBody, quiz as Quiz);
  const validQuiz = quiz as Quiz;
  if (version === 1) {
    let newQuestion: Question = {
      questionId: validQuiz.questionCounter,
      duration: questionBody.duration,
      question: questionBody.question,
      points: questionBody.points,
      answers: []
    };

    newQuestion = setupAnswers(newQuestion, questionBody);

    validQuiz.questionCounter++;

    validQuiz.timeLastEdited = Date.now();

    validQuiz.questions.push(newQuestion);

    setData(data);
    return { questionId: newQuestion.questionId };
  } else {
    validateThumbnail(questionBody.thumbnailUrl);

    let newQuestion: Question = {
      questionId: validQuiz.questionCounter,
      duration: questionBody.duration,
      question: questionBody.question,
      points: questionBody.points,
      answers: [],
      thumbnailUrl: questionBody.thumbnailUrl
    };

    newQuestion = setupAnswers(newQuestion, questionBody);

    validQuiz.questionCounter++;

    validQuiz.timeLastEdited = Date.now();

    validQuiz.questions.push(newQuestion);

    setData(data);
    return { questionId: newQuestion.questionId };
  }
}

/**
 * A particular question gets duplicated to immediately after where the source question is
 *
 * @param {string} token - Token
 * @param {number} quizid - Relevant quizId
 * @param {number} questionid - Relevant questionId
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * Question Id does not refer to a valid question within this quiz
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {duplicateReturn} - returns the new question id when duplicated.
 */

export function adminQuizQuestionDuplicate(token: string, quizid: number, questionid: number): duplicateReturn | ErrorObject {
  const data = getData();

  const checkToken = validToken(token, data);

  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);
  if (!quiz) {
    throw httpError(403, 'Quiz ID does not refer to a valid quiz.');
  }

  if (!checkToken.ownedQuizzes.includes(quizid)) {
    throw httpError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionid);

  if (questionIndex === -1) {
    throw httpError(400, 'Question ID does not refer to a valid question within the quiz.');
  }

  const questionToDuplicate = { ...quiz.questions[questionIndex], questionId: quiz.questionCounter };
  quiz.questions.splice(questionIndex + 1, 0, questionToDuplicate);
  quiz.timeLastEdited = Date.now();
  quiz.questionCounter++;

  setData(data);

  return {
    newQuestionId: questionToDuplicate.questionId
  };
}

/**
  * Delete a Quiz Question.
  *
  * @param {string} token - Token
  * @param {number} quizid - Relevant quizID
  * @param {number} questionid - Relevant questionID
  *
  * @returns { { error: }  } - Returns object when conditions fail
  * @returns { object } - returns an empty object question is updated.
*/

export function adminQuizQuestionDelete(token: string, quizid: number, questionid: number): object | ErrorObject {
  const data = getData();
  const checkToken = validToken(token, data);
  const quizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizid);

  validQuizId(quizid, checkToken, data);

  const questionIndex = data.quizzes[quizIndex].questions.findIndex(question => question.questionId === questionid);

  if (questionIndex === -1) { throw httpError(400, 'Question ID does not refer to a valid question within the quiz.'); }

  if (data.sessions.find(sessions => sessions.state !== State.END && sessions.metadata.quizId === quizid)) {
    throw httpError(400, 'All sessions assosciated to the quiz must not be active to transfer.');
  }

  data.quizzes[quizIndex].questions.splice(questionIndex, 1);
  data.quizzes[quizIndex].timeLastEdited = Date.now();

  setData(data);

  return {};
}

/**
  * Move a Quiz Question.
  *
  * @param {string} token - Token
  * @param {number} quizid - Relevant quizID
  * @param {number} questionid - Relevant questionID
  *
  * @returns { { error: }  } - Returns object when conditions fail
  * @returns { object } - returns an empty object question is moved.
*/

export function adminQuizQuestionMove(token: string, quizid: number, questionid: number, newPosition: number): object | ErrorObject {
  const data = getData();
  const checkToken = validToken(token, data);
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);

  validQuizId(quizid, checkToken, data);

  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionid);
  if (questionIndex === -1) { throw httpError(400, 'Question ID does not refer to a valid question within the quiz.'); }

  if (newPosition < 0 || newPosition >= quiz.questions.length) { throw httpError(400, 'New position is out of valid range.'); }

  if (newPosition === questionIndex) { throw httpError(400, 'New position is the same as the current position of the question.'); }

  const [questionToMove] = quiz.questions.splice(questionIndex, 1);

  quiz.questions.splice(newPosition, 0, questionToMove);

  quiz.timeLastEdited = Date.now();

  setData(data);

  return {};
}

/**
  * Update Quiz Question.
  *
  * @param {string} token - Token
  * @param {number} quizid - Relevant quizID
  * @param {number} questionid - Relevant questionID
  * @param {QuestionBody} questionBody - Question
  *
  * @returns { { error: }  } - Returns object when conditions fail
  * @returns { object } - returns an empty object question is updated.
*/

export function adminQuizQuestionUpdate(token: string, quizid: number, questionid: number, questionBody: QuestionBody, version: number): object {
  const data = getData();
  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);

  const quiz = findQuiz(quizid, data);

  validQuestion(questionBody, quiz as Quiz);
  const validQuiz = quiz as Quiz;
  const question = validQuiz.questions.find(question => question.questionId === questionid);
  if (!question) {
    throw httpError(400, 'Question Id does not refer to a valid question within this quiz.');
  }
  updateQuestion(question, questionBody, version);

  validQuiz.timeLastEdited = Date.now();
  setData(data);
  return { };
}

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {string} token - User ID of admin
 * @param {number} quizid - relevant quizID
 *
 * @returns {object} - returns error object based on following conditions:
 *
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {object} - returns an empty object when a quiz is removed
 */

export function adminQuizRemove(token: string, quizid: number, version: number): object {
  const data = getData();
  const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);

  const checkToken = validToken(token, data);

  validQuizId(quizid, checkToken, data);

  if (data.sessions.find(sessions => sessions.state !== State.END && sessions.metadata.quizId === quizid) &&
  version === 2) {
    throw httpError(400, 'All sessions assosciated to the quiz must not be active to delete.');
  }

  data.quizzes[quizIndex].timeLastEdited = Date.now();

  data.trash.push(data.quizzes[quizIndex]);

  data.quizzes.splice(quizIndex, 1);

  setData(data);

  return { };
}

/**
 * Transfer ownership of a quiz to a different user based on their email.
 *
 * @param {string} token - User ID of admin
 * @param {number} quizid - relevant quizID
 * @param {string} userEmail - Email of user to be transferred
 *
 * userEmail is not a real user
 * userEmail is the current logged in user
 * Quiz ID refers to a quiz that has a name that is already used by the target user
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {object} - returns an empty object when a quiz is transferred
 */

export function adminQuizTransfer(token: string, quizid: number, userEmail: string, version: number): object {
  const data = getData();
  const user = data.users.find(users => users.email === userEmail);
  const checkToken = validToken(token, data);

  if (!user) {
    throw httpError(400, 'userEmail is not a real user.');
  }

  if (userEmail === checkToken.email) { throw httpError(400, 'userEmail is the current logged in user'); }

  const tokenQuiz = findQuiz(checkToken.userId, data);

  for (const quiz in user.ownedQuizzes) {
    const ownedQuiz = user.ownedQuizzes[quiz];
    const userQuiz = findQuiz(ownedQuiz, data);

    if ((tokenQuiz as Quiz).name === (userQuiz as Quiz).name) {
      throw httpError(400, 'Quiz ID refers to a quiz that has a name that is already used by the target user.');
    }
  }

  validQuizId(quizid, checkToken, data);

  if (data.sessions.find(sessions => sessions.state !== State.END && sessions.metadata.quizId === quizid) &&
  version === 2) {
    throw httpError(400, 'All sessions assosciated to the quiz must not be active to transfer.');
  }

  user.ownedQuizzes.push(quizid);

  const ownedQuizIndex = checkToken.ownedQuizzes.indexOf(quizid);

  checkToken.ownedQuizzes.splice(ownedQuizIndex, 1);

  setData(data);

  return { };
}

/**
 * Permanently delete specific quizzes currently sitting in the trash
 *
 * @param {string} token - Session ID of admin
 * @param {array} quizids - JSONified array of quiz id numbers
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * One or more of the Quiz IDs is not currently in the trash
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own
 *
 * @returns {object} - returns an empty object when the trash is emptied
 */

export function adminQuizEmptyTrash(token: string, quizids: number[]): object | ErrorObject {
  const data = getData();

  const checkToken = validToken(token, data);

  for (const quizInTrash of data.trash) {
    const searchTrash = quizids.find(quizid => quizid === quizInTrash.quizId);
    if (!searchTrash) {
      throw httpError(400, 'One or more of the Quiz IDs is not currently in the trash.');
    }
  }

  for (const quiz of quizids) {
    validQuizId(quiz, checkToken, data);
  }
  const filteredTrash = data.trash.filter(trashedQuiz => !quizids.includes(trashedQuiz.quizId));
  data.trash = filteredTrash;
  setData(data);

  return {};
}

/**
 * Restore a particular quiz from the trash back to an active quiz
 *
 * @param {string} token - Session ID of admin
 * @param {number} quizid - relevant quizid
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * Quiz name of the restored quiz is already used by another active quiz
 * Quiz ID refers to a quiz that is not currently in the trash
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {object} - returns an empty object when quiz is restored
 */

export function adminQuizRestore(token: string, quizid: number): object | ErrorObject {
  const data = getData();

  // 401
  const checkToken = validToken(token, data);

  const quizIndex = data.trash.findIndex(trash => trash.quizId === quizid);
  const quizIndex2 = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);
  // 403
  if (quizIndex === -1 && quizIndex2 === -1) {
    throw httpError(403, 'Quiz ID does not refer to a valid quiz.');
  }

  if (!checkToken.ownedQuizzes.includes(quizid)) {
    throw httpError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 400
  if (quizIndex === -1) {
    throw httpError(400, 'Quiz ID refers to a quiz that is not currently in the trash');
  }
  const quiz = data.trash.find(quiz => quiz.quizId === quizid);
  for (const namedQuiz of data.quizzes) {
    if (namedQuiz.name === quiz.name) {
      throw httpError(400, 'Quiz name of the restored quiz is already used by another active quiz');
    }
  }

  data.quizzes.push(data.trash[quizIndex] as Quiz);
  data.quizzes[quizIndex].timeLastEdited = Date.now();
  data.trash.splice(quizIndex, 1);

  setData(data);
  return { };
}

/**
 * View the quizzes that are currently in the trash for the logged in user.
 *
 * @param {string} token - Session ID of admin
 *
 * @return {ErrorObject} - returns error object based on following conditions:
 *
 * Token is empty or invalid (does not refer to valid logged in user session)
 *
 * @return {QuizArray} - returns an array of quizzes in the trash
 */

export function adminQuizViewTrash(token: string): ErrorObject | QuizArray {
  const data = getData();

  const checkToken = validToken(token, data);

  const ownedQuizzes = checkToken.ownedQuizzes;
  const quizInTrash = data.trash;
  const foundTrash = [];

  for (const ownedQuiz of ownedQuizzes) {
    for (const trashedQuiz of quizInTrash) {
      if (ownedQuiz === trashedQuiz.quizId) {
        const quiz = {
          quizId: trashedQuiz.quizId,
          name: trashedQuiz.name
        };
        foundTrash.push(quiz);
      }
    }
  }

  return {
    quizzes: foundTrash
  };
}

export function adminQuizThumbnailUpdate(token: string, quizid: number, imgUrl: string): object {
  const data = getData();

  const checkToken = validToken(token, data);
  validQuizId(quizid, checkToken, data);
  validateThumbnail(imgUrl);

  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);

  quiz.thumbnailUrl = imgUrl;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return { };
}
