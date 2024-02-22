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