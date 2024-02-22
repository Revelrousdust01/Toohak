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
 * Given a particular quiz, permanently remove the quiz.
 * 
 * @param {number} authUserId - User ID of admin
 * @param {number} quizId - relevant quiz ID
 * 
 * @returns {} - returns empty object when removing quiz
 */

function adminQuizRemove( authUserId, quizId ) {
	return {

	}
}