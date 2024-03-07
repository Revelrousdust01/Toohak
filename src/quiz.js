import { clear } from './other';
import { getData, setData} from './dataStore';
import { validQuizName, validAuthUserId } from './helper';

let quizCounter = 1;

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

function adminQuizDescriptionUpdate( authUserId, quizId, description ) {
    return {
        
    }
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

export function adminQuizList( authUserId ) {
    
    const checkAuthUserId = validAuthUserId(authUserId);
    if(checkAuthUserId.error) 
        return {
            error: checkAuthUserId.error
        }
    
    const data = getData()
    
    const user = data.users.find(user => user.userId === authUserId)
    const ownedQuizzes = user.ownedQuizzes
    const quizzes = []

    for (const ownedQuiz of ownedQuizzes) {
        const quiz = {
            name: data.quizzes.find(quiz => quiz.quizId === ownedQuiz).name,
            quizId: ownedQuiz
        }
        quizzes.push(quiz)
    }

    return { 
       quizzes: quizzes
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

function adminQuizNameUpdate( authUserId, quizId, name ) {
    return {
        
    }
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
