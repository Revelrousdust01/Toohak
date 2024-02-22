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
 * Given basic details about a new quiz, create one for the logged in user.
 * 
 * @param {number} authUserId - ID of user
 * @param {string} name - Name of user
 * @param {string} description - Basic details about new quiz.
 * 
 * @returns {number} - Returns the quizID of the user.
 */

function adminQuizCreate( authUserId, name, description ) {
	return {
		quizId: 2
	}
}
      
/**
 * Given a particular quiz, permanently remove the quiz.
 * 
 * @param {number} authUserId - User ID of admin
 * @param {number} quizId - relevant quizID
 * 
 * @returns {} - no return
 */

function adminQuizRemove( authUserId, quizId ) {
	return {

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
