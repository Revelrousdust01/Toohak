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