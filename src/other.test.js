import { clear } from './other';
import { adminAuthRegister, adminUserDetails } from './auth';
import { adminQuizCreate, adminQuizList } from './quiz';

beforeEach(() => {
    clear();
});

describe('Iteration 1: Test "clear" function ', () => {
    test('Returns empty object from an empty test', () => {
        expect(clear()).toStrictEqual({});
    });

    test('Resets users list to empty', () => {
        adminAuthRegister('leonsun@gmail.com', 'Leonsunspassword1', 'Leon', 'Sun');
        clear();
        expect(clear()).toStrictEqual({});
    });

    test('Resets quizzes list to empty', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'Leonsunspassword1', 'Leon', 'Sun');
        adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        clear();
        expect(clear()).toStrictEqual({});
    });
    
    test('Resets both quizzes list and users list to empty', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'Leonsunspassword1', 'Leon', 'Sun');
        adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        clear();
        expect(clear()).toStrictEqual({});
        
    });

    test('Ensure that user and quiz creations are independent post-clear', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'Leonsunspassword1', 'Leon', 'Sun');
        adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        clear();
        const admin2 = adminAuthRegister('leonsun1@gmail.com', 'Leonsunspassword1', 'Leona', 'Sunny');
        adminQuizCreate(admin2.authUserId, 'Quiz 2', 'This is the second test quiz');
        expect(adminUserDetails(admin2.authUserId)).toStrictEqual({
            userId: expect.any(Number),
            email: expect.any(String),
            nameFirst: expect.any(String),
            namelast: expect.any(String),
            numFailedPasswordsSinceLastLogin: expect.any(Number),
            numSuccessfulLogins: expect.any(Number),
        });
        expect(adminQuizList(admin2.authUserId)).toStrictEqual({
            quizId: expect.any(String),
            name: expect.any(String),
        });
    });
});