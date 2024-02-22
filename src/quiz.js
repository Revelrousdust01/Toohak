/**
 * Given basic details about a new quiz, create one for the logged in user.
 * 
 * @param {int} authUserId - ID of user
 * @param {string} name - Name of user
 * @param {string} description - Basic details about new quiz.
 * 
 * @returns {int} - Returns the quizID of the user.
 */

function adminQuizCreate( authUserId, name, description ) {
	return {
		quizId: 2
	}
}
      

/**
 * Given a particular quiz, permanently remove the quiz.
 * 
 * @param {int} authUserId - User ID of admin
 * @param {int} quizId - relevant quiz ID
 * 
 * @returns {} - no return
 */

function adminQuizRemove( authUserId, quizId ) {
	return {

	}
}
      