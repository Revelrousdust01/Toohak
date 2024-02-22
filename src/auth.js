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

function adminAuthRegister( email, password, nameFirst, nameLast )
{
    return {
        authUserId: 1
    }
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
 * 
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
