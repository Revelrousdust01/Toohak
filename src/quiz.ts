import { getData, setData } from './dataStore';
import type { ErrorObject, Quiz, createQuizReturn } from './interfaces';
import { isError, validQuizName, validToken } from './helper';

let quizCounter = 1;

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

  if (data.quizzes.find(quiz => quiz.name === name)) { return { error: 'Name is already used in another quiz.' }; }

  const quizId = quizCounter++;

  const newQuiz: Quiz = {
    quizId: quizId,
    description: description,
    name: name,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
    question: []
  };

  data.users.find(user => user.userId === checkToken.userId).ownedQuizzes.push(quizId);

  data.quizzes.push(newQuiz);

  setData(data);

  return { quizId: newQuiz.quizId };
}

/**
  * Update the description of the relevant quiz.
  *
  * @param {number} authUserId - user id of admin
  * @param {number} quizId - relevant quiz id
  * @param {string} description - new description for the relevant quiz
  *
  * @returns {} - returns empty array when quiz description is updated
*/

// export function adminQuizDescriptionUpdate(authUserId, quizId, description) {
//   const currentState = getData();

//   const user = currentState.users.find(user => user.userId === authUserId);
//   if (!user) { return { error: 'AuthUserId is not a valid user.' }; }

//   if (!user.ownedQuizzes.includes(quizId)) { return { error: 'Quiz ID does not refer to a valid quiz owned by this user.' }; }

//   if (description.length > 100) { return { error: 'Description is too long.' }; }

//   const quiz = currentState.quizzes.find(quiz => quiz.quizId === quizId);
//   if (quiz) { quiz.description = description; } else { return { error: 'Quiz not found.' }; }

//   setData(currentState);

//   return { };
// }

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
 * @param {number} authUserId - ID of user
 *
 * @returns {array} - Returns array of all quizzes that are owned
 *                    by the currently logged in user.
 */

// export function adminQuizList(authUserId) {
//   const checkAuthUserId = validAuthUserId(authUserId);
//   if (checkAuthUserId.error) {
//     return {
//       error: checkAuthUserId.error
//     };
//   }

//   const data = getData();

//   const user = data.users.find(user => user.userId === authUserId);
//   const ownedQuizzes = user.ownedQuizzes;
//   const quizzes = [];

//   for (const ownedQuiz of ownedQuizzes) {
//     const quiz = {
//       name: data.quizzes.find(quiz => quiz.quizId === ownedQuiz).name,
//       quizId: ownedQuiz
//     };
//     quizzes.push(quiz);
//   }

//   setData(data);

//   return {
//     quizzes: quizzes
//   };
// }

/**
  * Update the name of the relevant quiz.
  *
  * @param {number} authUserId - user id of admin
  * @param {number} quizId - relevant quiz id
  * @param {string} name - new name for the relevant quiz
  *
  * @returns {} - returns empty object when quiz name is updated
*/

// export function adminQuizNameUpdate(authUserId, quizId, name) {
//   const currentState = getData();

//   const user = currentState.users.find(user => user.userId === authUserId);

//   if (!user) { return { error: 'AuthUserId is not a valid user.' }; }

//   if (!user.ownedQuizzes.includes(quizId)) { return { error: 'Quiz ID does not refer to a valid quiz owned by this user.' }; }

//   const checkQuizName = validQuizName(name);
//   if (checkQuizName.error) { return { error: checkQuizName.error }; }

//   const isNameUsed = currentState.quizzes.some(
//     quiz => quiz.name === name &&
//         quiz.quizId !== quizId &&
//         user.ownedQuizzes.includes(quiz.quizId)
//   );

//   if (isNameUsed) { return { error: 'Name is already used by another quiz owned by the user.' }; }

//   const quiz = currentState.quizzes.find(quiz => quiz.quizId === quizId);
//   if (quiz) { quiz.name = name; } else { return { error: 'Quiz not found.' }; }

//   setData(currentState);

//   return { };
// }

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {number} authUserId - User ID of admin
 * @param {number} quizId - relevant quizID
 *
 * @returns {} - returns an empty object when a quiz is removed
 */

// export function adminQuizRemove(authUserId, quizId) {
//   const data = getData();
//   const user = data.users.find(user => user.userId === authUserId);
//   const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizId);

//   if (!user) { return { error: 'AuthUserId is not a valid user.' }; }

//   if (quizIndex === -1) { return { error: 'Quiz ID does not refer to a valid quiz.' }; }

//   if (!user.ownedQuizzes.includes(quizId)) { return { error: 'Quiz ID does not refer to a quiz that this user owns.' }; }

//   data.quizzes.splice(quizIndex, 1);

//   const ownedQuizIndex = user.ownedQuizzes.indexOf(quizId);

//   if (ownedQuizIndex !== -1) { user.ownedQuizzes.splice(ownedQuizIndex, 1); }

//   setData(data);

//   return { };
// }