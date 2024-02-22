/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {int} authUserId              - ID of user
 * 
 * @returns {array}                     - Returns array of all quizzes that are owned
 *                                        by the currently logged in user.
 */

function adminQuizList( authUserId ) {
	return  { quizzes: 
		[
			{
				quizId: 1,
				name: 'My Quiz',
			}
		]
	}
}

/**
 * 
 * 
 * 
 * 
 * 
 */

function adminQuizzInfo( authUserId, quizId ) {
	return {
	quizId: 1,
	name: 'My Quiz',
	timeCreated: 1683125870,
	timeLastEdited: 1683125871,
	description: 'This is my quiz',
	}
}