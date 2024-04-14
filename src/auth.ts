import { Guid } from 'guid-typescript';
import { getData, setData } from './dataStore';
import type { createTokenReturn, ErrorObject, ReturnUser, User, UserSessions } from './interfaces';
import { isError, validEmail, validName, validPassword, validToken } from './helper';
import httpError from 'http-errors';

/**
  * Given a registered user's email and password returns their authUserId value.
  *
  * @param {string} email - Email of user
  * @param {string} password - Password of user
  *
  * @returns {ErrorObject} - when criteria is not met:
  *
  * Email address does not exist
  * Password is not correct for the given email
  *
  * @returns {createTokenReturn} - Returns authUserId value when account is loged in
*/

export function adminAuthLogin(email: string, password: string): createTokenReturn | ErrorObject {
  const data = getData();
  const user = data.users.find(users => users.email === email);
  if (!user) {
    throw httpError(400, 'No account found with the provided email address.');
  } else if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin++;
    setData(data);
    throw httpError(400, 'Incorrect password.');
  } else {
    user.numSuccessfulLogins++;
    user.numFailedPasswordsSinceLastLogin = 0;
  }

  const userSession: UserSessions = {
    userId: user.userId,
    sessionId: Guid.create().toString()
  };

  data.userSessions.push(userSession);

  setData(data);

  return {
    token: userSession.sessionId
  };
}

/**
  * Given a valid token returns logs out the assosciated user.
  *
  * @param {string} token - Token of session
  *
  * @returns {ErrorObject} - when criteria is not met:
  *
  * Invalid or blank email
  *
  * @returns {object} - Returns Blank object upon valid token
*/

export function adminAuthLogout(token: string): object | ErrorObject {
  const data = getData();
  const index = data.userSessions.findIndex(session => session.sessionId === token);
  if (index > -1) {
    data.userSessions.splice(index, 1);
  } else {
    return { error: 'Token is empty or invalid.' };
  }

  setData(data);

  return { };
}

/**
  * Register a user with an email, password, and names, then returns their authUserId value.
  *
  * @param {string} email - Email of user
  * @param {string} password - Password of user
  * @param {string} nameFirst - First name of user
  * @param {string} nameLast - Last Name of user
  *
  * @returns {ErrorObject} when criteria is not met:
  *
  * Email address is used by another user.
  * Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail function).
  * NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  * NameFirst is less than 2 characters or more than 20 characters.
  * NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  * NameLast is less than 2 characters or more than 20 characters.
  * Password is less than 8 characters.
  * Password does not contain at least one number and at least one letter.
  *
  * @returns {adminAuthRegisterReturn} - Returns token value when account is registered
*/

export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): createTokenReturn | ErrorObject {
  const checkEmail = validEmail(email);
  if (isError(checkEmail)) {
    return {
      error: checkEmail.error
    };
  }

  const checkPassword = validPassword(password);
  if (isError(checkPassword)) {
    return {
      error: checkPassword.error
    };
  }

  const checkNameFirst = validName(nameFirst, true);
  if (isError(checkNameFirst)) {
    return {
      error: checkNameFirst.error
    };
  }

  const checkNameLast = validName(nameLast, false);
  if (isError(checkNameLast)) {
    return {
      error: checkNameLast.error
    };
  }

  const data = getData();

  const newUser: User = {
    userId: data.users.length + 1,
    email: email,
    nameFirst: nameFirst,
    nameLast: nameLast,
    numFailedPasswordsSinceLastLogin: 0,
    numSuccessfulLogins: 1,
    oldPasswords: [],
    ownedQuizzes: [],
    password: password,
  };

  data.users.push(newUser);

  const userSession: UserSessions = {
    userId: newUser.userId,
    sessionId: Guid.create().toString()
  };
  data.userSessions.push(userSession);

  setData(data);

  return { token: userSession.sessionId };
}

/**
  * Given an admin user's authUserId, return details about the user.
  *
  * @param {string} token - token of session
  *
  * @returns {ReturnUser} - Returns an object containing details about the user when the account is logged in.
*/

export function adminUserDetails(token: string): ReturnUser | ErrorObject {
  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  return {
    user: {
      userId: checkToken.userId,
      name: checkToken.nameFirst.concat(' ', checkToken.nameLast),
      email: checkToken.email,
      numSuccessfulLogins: checkToken.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: checkToken.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
 * Given an admin user's authUserId and a set of properties,
 * update the properties of this logged in admin user.
 * @param {number} authUserId - user ID
 * @param {string} email - email of user
 * @param {string} nameFirst - first name of user
 * @param {string} nameLast - last name of user
 *
 * @returns {ErrorObject} when criteria is not met:
 *
 * Email address is used by another user.
 * Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail)
 * NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
 * NameFirst is less than 2 characters or more than 20 characters
 * NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
 * NameLast is less than 2 characters or more than 20 characters
 *
 * @returns {object} - Returns empty object when admin user details is updated
 */

export function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): ErrorObject | object {
  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  const checkEmail = validEmail(email);
  if (isError(checkEmail)) {
    return {
      error: checkEmail.error
    };
  }

  const checkNameFirst = validName(nameFirst, true);
  if (isError(checkNameFirst)) {
    return {
      error: checkNameFirst.error
    };
  }

  const checkNameLast = validName(nameLast, false);
  if (isError(checkNameLast)) {
    return {
      error: checkNameLast.error
    };
  }

  const data = getData();

  checkToken.email = email;
  checkToken.nameFirst = nameFirst;
  checkToken.nameLast = nameLast;

  setData(data);

  return { };
}

/**
 * Given details relating to a password change,
 * update the password of a logged in user.
 *
 * @param {number} authUserId - ID of user
 * @param {string} oldPassword - Old password of user
 * @param {string} newPassword - New password of user
 *
 * @returns {ErrorObject} when criteria is not met:
 *
 * Old Password is not the correct old password
 * Old Password and New Password match exactly
 * New Password has already been used before by this user
 * New Password is less than 8 characters
 * New Password does not contain at least one number and at least one letter
 *
 * @returns {} - Returns empty object when password is updated.
 */

export function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): ErrorObject | object {
  const data = getData();

  const checkToken = validToken(token);
  if (isError(checkToken)) {
    return {
      error: checkToken.error
    };
  }

  if (!(checkToken.password === oldPassword)) {
    return {
      error: 'Old Password is not the correct old password'
    };
  }

  if (oldPassword === newPassword) {
    return {
      error: 'Old Password and New Password match exactly'
    };
  }

  const oldPasswordArray = checkToken.oldPasswords;
  for (const oldPasswordUsed of oldPasswordArray) {
    if (oldPasswordUsed === newPassword) {
      return {
        error: 'New Password has already been used before by this user'
      };
    }
  }

  const checkPassword = validPassword(newPassword);
  if (isError(checkPassword)) {
    return {
      error: checkPassword.error
    };
  }

  checkToken.oldPasswords.push(oldPassword);
  checkToken.password = newPassword;

  setData(data);

  return { };
}
