import {getData} from './dataStore';
import {validEmail, validName, validPassword} from './helper';

/**
  * Given a registered user's email and password returns their authUserId value.
  * 
  * @param {string} email - Email of user
  * @param {string} password - Password of user
  * 
  * @returns {number} - Returns authUserId value when account is loged in
*/

function adminAuthLogin( email, password )
{
    return{
        authUserId: 1
    }
}

/**
  * Register a user with an email, password, and names, then returns their authUserId value.
  * 
  * @param {string} email - Email of user
  * @param {string} password - Password of user
  * @param {string} nameFirst - First name of user 
  * @param {string} nameLast - Last Name of user
  * 
  * @returns {number} - Returns authUserId value when account is registered
*/

export function adminAuthRegister( email, password, nameFirst, nameLast )
{   
    const checkEmail = validEmail(email);
    if(checkEmail.error)
        return{
            error: checkEmail.error
        }

    const checkPassword = validPassword(password);
    if(checkPassword.error)
        return{
            error: checkPassword.error
        }

    const checkNameFirst = validName(nameFirst, true);
    if(checkNameFirst.error)
        return{
            error: checkNameFirst.error
        }
    
    const checkNameLast = validName(nameLast, false);
    if(checkNameLast.error)
        return{
            error: checkNameLast.error
        }     

    let data = getData();

    const newUser = {
        userId: data.users.length + 1,
        email: email,
        name: nameFirst.concat(nameLast),
        nameFirst: nameFirst,
        nameLast: nameLast,
        numFailedPasswordsSinceLastLogin: 0,
        numSuccessfulLogins: 1,
        ownedQuizzes: [],
        password: password
    }

    data.users.push(newUser);

    return{ }
}

/**
  * Given an admin user's authUserId, return details about the user.
  * "name" is the first and last name concatenated with a single space between them.
  * 
  * @param {number} authUserId - ID of user
  * 
  * @returns {Object} - Returns an object containing details about the user when the account is logged in.
*/

function adminUserDetails(authUserId) 
{
    return {
    user: {
        userId: 1,
        name: "Hayden Smith",
        email: "hayden.smith@unsw.edu.au",
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 1,
        },
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
 * @returns {} - Returns empty object when admin user details is updated
 */

function adminUserDetailsUpdate( authUserId, email, nameFirst, nameLast ) {
    return {

    }
}

/**
 * Given details relating to a password change, 
 * update the password of a logged in user.
 * 
 * @param {number} authUserId - ID of user
 * @param {string} oldPassword - Old password of user
 * @param {string} newPassword - New password of user
 * 
 * @returns {} - Returns empty object when password is updated.
 */

function adminUserPasswordUpdate( authUserId, oldPassword, newPassword ) {
    return {

    }
}
