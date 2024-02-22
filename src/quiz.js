/**
  * adminQuizDescriptionUpdate:
  *  
  * Update the description of the relevant quiz.
  * 
  * @param {string} authUserId  - user id of admin
  * @param {string} quizId      - relevant quiz id
  * @param {string} description - new description for the relevant quiz
  * 
  * @returns {}                 - no return
*/

function adminQuizDescriptionUpdate( authUserId, quizId, description ) {
    return {
        
    }

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