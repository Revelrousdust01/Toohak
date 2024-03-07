import { clear } from './other';
import { getData, setData} from './dataStore';
<<<<<<< HEAD
import { validQuizName } from './helper';

let quizCounter = 1;
=======
>>>>>>> 91e44962374b229b46c606c1de16d55535cd2110

/**
 * Given basic details about a new quiz, create one for the logged in user.
 * 
 * @param {number} authUserId - ID of user
 * @param {string} name - Name of user
 * @param {string} description - Basic details about new quiz.
 * 
 * @returns {number} - Returns the quizID of the user.
 */

export function adminQuizCreate( authUserId, name, description ) {
    let data = getData();
    const user = data.users.find(user => user.userId === authUserId);

    if (!user) 
        return { error: 'AuthUserId is not a valid user.'}
    
    const checkQuizName = validQuizName(name);
    if(checkQuizName.error)
        return{
            error: checkQuizName.error
        }   

    if (description.length > 100) 
        return { error: 'Description must be less than 100 charactes.'}

    if (data.quizzes.find(quiz => quiz.name === name)) 
        return { error: 'Name is already used in another quiz.'}
    
    const quizId = quizCounter++;

    const newQuiz = {
        quizId: quizId,
        description: description,
        name: name,
        timeCreated: Date.now(),
        timeLastEdited: Date.now(),
    }
    data.users.find(user => user.userId === authUserId).ownedQuizzes.push(quizId);

    data.quizzes.push(newQuiz);

    return { quizId: newQuiz.quizId }
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

export function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    // Retrieve the current state of data
    let currentState = getData();

    // Check if authUserId is valid
    const user = currentState.users.find(user => user.userId === authUserId);
    if (!user) {
        return { error: 'AuthUserId is not a valid user.' };
    }

    // Check if quizId is valid and owned by the user
    if (!user.ownedQuizzes.includes(quizId)) {
        return { error: 'Quiz ID does not refer to a valid quiz owned by this user.' };
    }

    // Validate the new description's length
    if (description.length > 100) {
        return { error: 'Description is too long.' };
    }

    // Find the quiz and update its description
    const quiz = currentState.quizzes.find(quiz => quiz.quizId === quizId);
    if (quiz) {
        quiz.description = description;
    } else {
        return { error: 'Quiz not found.' };
    }

    // Save the updated data back
    setData(currentState);

    // If there are no errors, return an empty object
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

function adminQuizInfo( authUserId, quizId ) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    }
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {number} authUserId - ID of user
 * 
 * @returns {array} - Returns array of all quizzes that are owned
 *                    by the currently logged in user.
 */

function adminQuizList( authUserId ) {
    return { 
        quizzes: [
            {
            quizId: 1,
            name: 'My Quiz',
            }
        ]
    }
}

/**
  * Update the name of the relevant quiz.
  * 
  * @param {number} authUserId - user id of admin
  * @param {number} quizId - relevant quiz id
  * @param {string} name - new name for the relevant quiz
  * 
  * @returns {} - returns empty object when quiz name is updated
*/
export function adminQuizNameUpdate(authUserId, quizId, name) {
    // Retrieve the current state of data
    let currentState = getData();

    // Check if authUserId is valid
    const user = currentState.users.find(user => user.userId === authUserId);
    if (!user) {
        return { error: 'AuthUserId is not a valid user.' };
    }

    // Check if quizId is valid and owned by the user
    if (!user.ownedQuizzes.includes(quizId)) {
        return { error: 'Quiz ID does not refer to a valid quiz owned by this user.' };
    }

    // Validate the new name (3 <= name.length <= 30 and valid characters (a-z,A-Z,0-9))
    if (!/^[a-zA-Z0-9 ]{3,30}$/.test(name)) {
        return { error: 'Name contains invalid characters or is out of the allowed length.' };
    }

    // Check if the name is already used by another quiz owned by the user
    const isNameUsed = currentState.quizzes.some(
        quiz => quiz.name === name &&
        quiz.quizId !== quizId && 
        user.ownedQuizzes.includes(quiz.quizId)
    );
    if (isNameUsed) {
        return { error: 'Name is already used by another quiz owned by the user.' };
    }

    // Find the quiz and update its name
    const quiz = currentState.quizzes.find(quiz => quiz.quizId === quizId);
    if (quiz) {
        quiz.name = name;
    } else {
        return { error: 'Quiz not found.' };
    }

    // Save the updated data back
    setData(currentState);

    // If there are no errors, return an empty object
    return {};
}

      
/**
 * Given a particular quiz, permanently remove the quiz.
 * 
 * @param {number} authUserId - User ID of admin
 * @param {number} quizId - relevant quizID
 * 
 * @returns {} - returns an empty object when a quiz is removed
 */

export function adminQuizRemove( authUserId, quizId ) {
    let data = getData();
    const user = data.users.find(user => user.userId === authUserId);
    const quizIndex = data.quizzes.findIndex(quizzes => quizzes.quizId === quizId);
    
    if (!user) 
        return { error: 'AuthUserId is not a valid user.'}

    if (quizIndex === -1)
        return { error: 'Quiz ID does not refer to a valid quiz.'}

    if (!user.ownedQuizzes.includes(quizId)) 
        return { error: 'Quiz ID does not refer to a quiz that this user owns.'}

    data.quizzes.splice(quizIndex, 1);

    const ownedQuizIndex = user.ownedQuizzes.indexOf(quizId);

    if (ownedQuizIndex !== -1) 
        user.ownedQuizzes.splice(ownedQuizIndex, 1);

    setData(data);

    return { };
}
