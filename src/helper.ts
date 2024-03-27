import { getData } from './dataStore';
import type { ErrorObject, User } from './interfaces';
import validator from 'validator';

/**
  * Return the quiz, given the quizId
  *
  * @param {number} quizId - relevent quizId
  *
  * @returns { Name } - Returns the quiz if quiz is found
  * @returns { } - Returns empty object if quiz is not found
*/

export function findQuiz(quizid: number): object {
  const data = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizid);
  if (!quiz) {
    return { };
  }
  return quiz;
}

/**
  * Check whether object is of type ErrorObject or not:
  *
  * @param {unknown} object - Unknown Object
  *
  * @returns { } - Returns the error if it is of the same type.
*/
export function isError(object: unknown): object is ErrorObject {
  return 'error' in (object as ErrorObject);
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
export function validEmail(email: string): object | ErrorObject {
  const data = getData();

  if (data.users.find(user => user.email === email)) { return { error: 'Email address is already used by another user.' }; } else if (!validator.isEmail(email)) { return { error: 'Please enter a valid email.' }; }

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
export function validName(name: string, isFirst: boolean): object | ErrorObject {
  const characterRegex = /^[A-Za-z\s'-]+$/;

  if (!characterRegex.test(name)) { return { error: (isFirst ? 'First' : 'Last').concat(' name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.') }; } else if (name.length < 2 || name.length > 20) { return { error: (isFirst ? 'First' : 'Last').concat(' name must not be less than 2 characters or more than 20 characters.') }; }

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
export function validPassword(password: string): object | ErrorObject {
  const digitsAndLetters = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;

  if (password.length < 8) { return { error: 'Password must contain at least 8 characters.' }; } else if (!digitsAndLetters.test(password)) { return { error: 'Password must contain at least letter and one number.' }; }

  return { };
}

/**
  * Checks for validToken
  *
  * @param {string} token - Token of session
  *
  * @returns { { error: }  } - Returns object with error when token is invalid
  * @returns { User } - Returns the user within the correct session when the token is valid

*/
export function validToken(token: string): User | ErrorObject {
  const data = getData();
  const session = data.userSessions.find(session => session.sessionId === token);
  if (!session) { return { error: 'Token is empty or invalid.' }; }

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

  if (!characterRegex.test(name)) { return { error: ' Name contains characters other than lowercase letters, uppercase letters, numbers or spaces.' }; } else if (name.length < 3 || name.length > 30) { return { error: ' Name must not be less than 3 characters or more than 30 characters.' }; }

  return { };
}
