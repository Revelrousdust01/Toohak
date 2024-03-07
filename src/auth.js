import {getData} from './dataStore';
import {validAuthUserId, validEmail, validName, validPassword} from './helper';

/**
  * Given a registered user's email and password returns their authUserId value.
  * 
  * @param {string} email - Email of user
  * @param {string} password - Password of user
  * 
  * @returns {number} - Returns authUserId value when account is loged in
*/

export function adminAuthLogin( email, password )
{
    let data = getData();
    const user = data.users.find(users => users.email == email)

    if(!user)
        return { error: "No account found with the provided email address." }
    else if(user.password !== password)
        return { error: "Incorrect password." }

    return{
        authUserId: user.userId
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

    return{ authUserId: newUser.userId }
}

/**
  * Given an admin user's authUserId, return details about the user.
  * "name" is the first and last name concatenated with a single space between them.
  * 
  * @param {number} authUserId - ID of user
  * 
  * @returns {Object} - Returns an object containing details about the user when the account is logged in.
*/

export function adminUserDetails(authUserId) 
{
    const checkAuthUserID = validAuthUserId(authUserId);
    if(checkAuthUserID.error)
        return{
            error: checkAuthUserID.error
        }     

    return {
        user: {
            userId: checkAuthUserID.user.userId,
            name: checkAuthUserID.user.nameFirst.concat(' ', checkAuthUserID.user.nameLast),
            email: checkAuthUserID.user.email,
            numSuccessfulLogins: checkAuthUserID.user.numSuccessfulLogins,
            numFailedPasswordsSinceLastLogin: checkAuthUserID.user.numFailedPasswordsSinceLastLogin,
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

export function adminUserDetailsUpdate( authUserId, email, nameFirst, nameLast ) 
{
    const checkAuthUserId = validAuthUserId(authUserId);
    if(checkAuthUserId.error) 
        return {
            error: checkAuthUserId.error
        }
    
    const checkEmail = validEmail(email);
    if(checkEmail.error)
        return{
            error: checkEmail.error
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
    
    let user = data.users.find(user => user.userId === authUserId);
    user.email = email;
    user.nameFirst = nameFirst;
    user.nameLast = nameLast;

    return { }
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

export function adminUserPasswordUpdate( authUserId, oldPassword, newPassword ) 
{
    let data = getData()

    const checkAuthUserId = validAuthUserId(authUserId);
    if(checkAuthUserId.error) 
        return {
            error: checkAuthUserId.error
        }
    
    let user = data.users.find(user => user.userId === authUserId)

    if (!(user.password === oldPassword)) 
        return {
            error: 'Old Password is not the correct old password'
        }
    
    if (oldPassword === newPassword) 
        return {
            error: 'Old Password and New Password match exactly'
        }
    
    const oldPasswordArray = user.oldPasswords
    for (const oldPasswordUsed of oldPasswordArray) 
        if (oldPasswordUsed === newPassword) 
            return {
                error: 'New Password has already been used before by this user'
            }
        
    const checkPassword = validPassword(newPassword);
    if(checkPassword.error)
        return{
            error: checkPassword.error
        }

    user.oldPasswords.push(oldPassword)
    user.password = newPassword

    return { }
}
