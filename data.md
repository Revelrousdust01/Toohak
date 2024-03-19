```javascript
let data = {
    users:[
        {
         userId: 1,
         email: 'hayden.smith@unsw.edu.au',
         nameFirst: 'Hayden',
         nameLast: 'Smith',
         oldPasswords: ['firstPassword1', 'secondPassword2', 'thirdPassword3'],
         numFailedPasswordsSinceLastLogin: 1,
         numSuccessfulLogins: 3,
         ownedQuizzes: [1,2,3],
         password: 'hayden1!'
         sessions: [{sessionId: '1'}, {sessionId: '2'}]
        }
    ]
    quizzes: [
        {
         quizId: 1,
         description: 'This is my quiz',
         name: 'My Quiz',
         timeCreated: 1683125870,
         timeLastEdited: 1683125871,
         question: [
            {
                questionId: 1,
                name: 'On the scale from 1 through to 10 how silly is Willy?'
                answers: ['0/10', '4/10', '7/10', '10/10'],
                correctAnswer: '0/10'
            },
            {
                questionId: 2,
                name: 'Is Willy silly?'
                answers: ['Yes', 'No'],
                correctAnswer: 'Yes'
            }
        ]}   
    ]
}
```
[Optional] short description: 
