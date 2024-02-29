import {

  } from './other';

beforeEach(() => {
    clear();
});

describe('Iteration 1: Test "clear" function ', () => {
    test('Returns empty object from an empty test', () => {
        // Expect post clear that there is an empty object
        expect(clear()).toStrictEqual({});
    });

    test('Resets users list to empty', () => {
        // Create an admin user 
        adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');

        // Clear that admin user
        clear();

        // Expect post clear that there is an empty object       
        expect(clear()).toStrictEqual({});
    });

    test('Resets quizzes list to empty', () => {
        // Create an admin user and quiz for that user
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');

        // Clear that admin user and quiz
        clear();

        // Expect post clear that there is an empty object
        expect(clear()).toStrictEqual({});
    });

    test('Ensure that user and quiz creations are independent post-clear', () => {
        // Create an admin user and quiz for that user
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');

        // Clear that admin user and quiz
        clear();

        // Create a second admin user and quiz for that user
        const admin2 = adminAuthRegister('leonsun1@gmail.com', 'leonsunspassword1', 'Leona', 'Sunny');
        adminQuizCreate(admin2.authUserId, 'Quiz 2', 'This is the second test quiz');

        // Test to see if the second admin's details are there
        expect(adminUserDetails(admin2.authUserId)).toStrictEqual({
            userId: expect.any(Number),
            email: expect.any(String),
            name: expect.any(String),
            numFailedPasswordsSinceLastLogin: expect.any(Number),
            numSuccessfulLogins: expect.any(Number),
        })

        // Test to see if the second admin's quizzes are there
        expect(adminQuizList(admin2.authUserId)).toStrictEqual({
            quizId: expect.any(String),
            name: expect.any(String),
        });
    });
});