import { getData, setData } from './dataStore';
import type { ErrorObject, Quiz, createQuizReturn, QuizArray, QuestionBody, Question, Answer, createQuestionReturn } from './interfaces';
import { isError, findQuiz, getColour, validQuestion, validQuizName, validQuizId, validToken } from './helper';

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

  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  const checkQuizName = validQuizName(name);
  if (isError(checkQuizName)) {
    return {
      error: checkQuizName.error
    };
  }

  if (description.length > 100) { return { error: 'Description must be less than 100 charactes.' }; }

  const existingQuiz = data.quizzes.find(quiz => quiz.name === name);

  if (existingQuiz) {
    if (checkToken.ownedQuizzes.find(quiz => quiz === existingQuiz.quizId)) { return { error: 'Name is already used by the current logged in user for another quiz.' }; }
  }

  const quizId = data.quizCounter++;

  const newQuiz: Quiz = {
    quizId: quizId,
    questionCounter: 1,
    description: description,
    name: name,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
    questions: []
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
  const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);
  const checkToken = validToken(token);

  // 401 error
  if (isError(checkToken)) {
    return { error: 'Token is empty or invalid' };
  }

  // 400 error
  if (description.length > 100) { return { error: 'Description must be less than 100 characters.' }; }

  // 403 error
  if (quizIndex === -1) { return { error: 'Quiz ID does not refer to a valid quiz.' }; }

  // 403 error
  if (!checkToken.ownedQuizzes.includes(quizid)) { return { error: 'Quiz ID does not refer to a quiz that this user owns.' }; }

  data.quizzes[quizIndex].description = description;
  setData(data);
  return { };
}

/**
 * Get all of the relevant information about the current quiz.
 *
 * @param {number} authUserId - ID of user
 * @param {number} quizId - quizID of current quiz
 *
 * @returns {Object} - Returns an object when relavent information found.
 */

// export function adminQuizInfo(authUserId, quizId) {
//   const data = getData();
//   const user = data.users.find(user => user.userId === authUserId);
//   const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

//   if (!user) { return { error: 'AuthUserId is not a valid user.' }; }

//   if (!quiz) { return { error: 'Quiz ID does not refer to a valid quiz.' }; }

//   if (!user.ownedQuizzes.includes(quizId)) { return { error: 'Quiz ID does not refer to a quiz that this user owns.' }; }

//   setData(data);

//   return {
//     quizId: quizId,
//     name: quiz.name,
//     timeCreated: quiz.timeCreated,
//     timeLastEdited: quiz.timeLastEdited,
//     description: quiz.description,
//   };
// }

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

export function adminQuizList(token: string): ErrorObject | QuizArray {
  const data = getData();

  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  const ownedQuizzes = checkToken.ownedQuizzes;
  const quizInTrash = data.trash;
  const quizzes = [];

  if (quizInTrash.length === 0) {
    for (const ownedQuiz of ownedQuizzes) {
      const quizFind = findQuiz(ownedQuiz);
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
          const quizFind = findQuiz(ownedQuiz);
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
  const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);
  const checkToken = validToken(token);

  // 401 error
  if (isError(checkToken)) {
    return { error: 'Token is empty or invalid.' };
  }

  // 400 error
  const checkQuizName = validQuizName(name);
  if (isError(checkQuizName)) {
    return { error: 'Quiz name is not valid.' };
  }

  // 400 error
  const existingQuiz = data.quizzes.find(quiz => quiz.name === name);
  if (existingQuiz) {
    if (checkToken.ownedQuizzes.find(quiz => quiz === existingQuiz.quizId)) { return { error: 'Name is already used by the current logged in user for another quiz.' }; }
  }

  // 403 error
  if (quizIndex === -1) { return { error: 'Quiz ID does not refer to a valid quiz.' }; }

  // 403 error
  if (!checkToken.ownedQuizzes.includes(quizid)) { return { error: 'Quiz ID does not refer to a quiz that this user owns.' }; }

  data.quizzes[quizIndex].name = name;
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
export function adminQuizQuestionCreate(token: string, quizid: number, questionBody: QuestionBody): createQuestionReturn | ErrorObject {
  const data = getData();
  const checkToken = validToken(token);

  if (isError(checkToken)) {
    return { error: 'Token is empty or invalid.' };
  }

  const checkQuizId = validQuizId(token, quizid, checkToken);

  if (isError(checkQuizId)) {
    return {
      error: checkQuizId.error
    };
  }

  const quiz = findQuiz(quizid);

  if (quiz != null) {
    const checkQuestion = validQuestion(questionBody, quiz as Quiz);
    if (isError(checkQuestion)) {
      return {
        error: checkQuestion.error
      };
    }
    const validQuiz = quiz as Quiz;
    const newQuestion: Question = {
      questionId: validQuiz.questionCounter,
      duration: questionBody.duration,
      question: questionBody.question,
      points: questionBody.points,
      answers: []
    };
    validQuiz.questionCounter++;
    for (const [index, answer] of questionBody.answers.entries()) {
      const newAnswer: Answer = {
        answerId: index,
        answer: answer.answer,
        colour: getColour(),
        correct: answer.correct
      };
      newQuestion.answers.push(newAnswer);
    }

    validQuiz.timeLastEdited = Date.now();

    validQuiz.questions.push(newQuestion);

    setData(data);

    return { questionId: newQuestion.questionId };
  }
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
export function adminQuizQuestionUpdate(token: string, quizid: number, questionid: number, questionBody: QuestionBody): object | ErrorObject {
  const data = getData();
  const checkToken = validToken(token);

  if (isError(checkToken)) {
    return { error: 'Token is empty or invalid.' };
  }

  const checkQuizId = validQuizId(token, quizid, checkToken);

  if (isError(checkQuizId)) {
    return {
      error: checkQuizId.error
    };
  }

  const quiz = findQuiz(quizid);

  if (quiz != null) {
    const checkQuestion = validQuestion(questionBody, quiz as Quiz);
    if (isError(checkQuestion)) {
      return {
        error: checkQuestion.error
      };
    }
    const validQuiz = quiz as Quiz;
    let checkValidQuestion = false;
    for (const question of validQuiz.questions) {
      if (question.questionId === questionid) {
        checkValidQuestion = true;
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
      }
    }

    if (!checkValidQuestion) {
      return {
        error: 'Question Id does not refer to a valid question within this quiz'
      };
    }

    validQuiz.timeLastEdited = Date.now();

    setData(data);

    return { };
  }
}

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {string} token - User ID of admin
 * @param {number} quizid - relevant quizID
 *
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {object} - returns an empty object when a quiz is removed
 */

export function adminQuizRemove(token: string, quizid: number): object | ErrorObject {
  const data = getData();
  const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizid);
  const checkToken = validToken(token);

  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  const checkQuizId = validQuizId(token, quizid, checkToken);

  if (isError(checkQuizId)) {
    return {
      error: checkQuizId.error
    };
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
 * @returns {ErrorObject} - returns error object based on following conditions:
 *
 * userEmail is not a real user
 * userEmail is the current logged in user
 * Quiz ID refers to a quiz that has a name that is already used by the target user
 * Token is empty or invalid (does not refer to valid logged in user session)
 * Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *
 * @returns {object} - returns an empty object when a quiz is transferred
 */

export function adminQuizTransfer(token: string, quizid: number, userEmail: string): object | ErrorObject {
  const data = getData();
  const user = data.users.find(users => users.email === userEmail);
  const checkToken = validToken(token);

  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  if (!user) {
    return { error: 'userEmail is not a real user.' };
  }

  if (userEmail === checkToken.email) { return { error: 'userEmail is the current logged in user' }; }

  const tokenQuiz = findQuiz(checkToken.userId);

  for (const quiz in user.ownedQuizzes) {
    const ownedQuiz = user.ownedQuizzes[quiz];
    const userQuiz = findQuiz(ownedQuiz);
    if (tokenQuiz != null && userQuiz != null) {
      if ((tokenQuiz as Quiz).name === (userQuiz as Quiz).name) {
        return { error: 'Quiz ID refers to a quiz that has a name that is already used by the target user.' };
      }
    }
  }

  const checkQuizId = validQuizId(token, quizid, checkToken);

  if (isError(checkQuizId)) {
    return {
      error: checkQuizId.error
    };
  }

  user.ownedQuizzes.push(quizid);

  const ownedQuizIndex = checkToken.ownedQuizzes.indexOf(quizid);

  if (ownedQuizIndex !== -1) { checkToken.ownedQuizzes.splice(ownedQuizIndex, 1); }

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

  const checkToken = validToken(token);

  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }
  for (const quizInTrash of data.trash) {
    const searchTrash = quizids.find(quizid => quizid === quizInTrash.quizId);
    if (!searchTrash) {
      return {
        error: 'One or more of the Quiz IDs is not currently in the trash.'
      };
    }
  }

  for (const ownedQuiz of checkToken.ownedQuizzes) {
    const searchOwnedQuizzes = quizids.find(quiz => quiz === ownedQuiz);

    if (!searchOwnedQuizzes) {
      return {
        error: 'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own.'
      };
    }
  }

  for (const quizid of quizids) {
    const removedTrash = data.trash.findIndex(trashedQuiz => trashedQuiz.quizId === quizid);

    if (removedTrash) {
      data.quizzes.splice(removedTrash, 1);
    }
  }
  return {};
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

  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

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
