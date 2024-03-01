import { clear } from './other';
import { adminAuthRegister, adminUserDetails } from './auth';
import { adminQuizCreate, adminQuizList, adminQuizNameUpdate } from './quiz';

// Clear before each test
beforeEach(() => {
    clear();
});

const ERROR = { error: expect.any(String) };

describe('Test adminQuizDescriptionUpdate', () => {
    test('working input, 0 errors expected', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, 
            'This is the new description for the first test quiz')).toStrictEqual({});        
    });

    test('authUserId is not valid', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizDescriptionUpdate(-1, quiz1.quizId,  
            'This is the new description for the first test quiz')).toStrictEqual(ERROR);
    });

    test('quizId does not refer to a valid quiz', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        expect(adminQuizDescriptionUpdate(admin.authUserId, -1,  
            'This is the new description for the first test quiz')).toStrictEqual(ERROR);
    });

    test('quizId does not refer to a quiz that this user owns', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const otherAdmin = adminAuthRegister('johndoe@gmail.com', 'johndoespassword', 'John', 'Doe');
        const quiz1 = adminQuizCreate(otherAdmin.authUserId, 'Quiz 1', 'This is a quiz by another user');
        expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, 'New name')).toStrictEqual(ERROR);
    });

    test('description is too long', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, 'A'.repeat(999))).toStrictEqual(ERROR);
    });
});


describe('Test adminQuizNameUpdate', () => {
    test('working input, 0 errors expected', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizNameUpdate(admin.authUserId, quiz1.quizId, 'New name')).toStrictEqual({});        
    });

    test('authUserId is not valid', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizNameUpdate(-1, quiz1.quizId, 'New name')).toStrictEqual(ERROR);
    });

    test('quizId does not refer to a valid quiz', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        expect(adminQuizNameUpdate(admin.authUserId, -1, 'New name')).toStrictEqual(ERROR);
    });

    test('quizId does not refer to a quiz that this user owns', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const otherAdmin = adminAuthRegister('johndoe@gmail.com', 'johndoespassword', 'John', 'Doe');
        const quiz1 = adminQuizCreate(otherAdmin.authUserId, 'Quiz 1', 'This is a quiz by another user');
        expect(adminQuizNameUpdate(admin.authUserId, quiz1.quizId, 'New name')).toStrictEqual(ERROR);
    });

    test('name contains invalid characters', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizNameUpdate(admin.authUserId, quiz1.quizId, 'Invalid#Name')).toStrictEqual(ERROR);
    });

    test('name is either too short or too long', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizNameUpdate(admin.authUserId, quiz1.quizId, 'AB')).toStrictEqual(ERROR);
        expect(adminQuizNameUpdate(admin.authUserId, quiz1.quizId, 'A'.repeat(31))).toStrictEqual(ERROR);
    });

    test('name is already used by the current logged in user for another quiz', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        const quiz2 = adminQuizCreate(admin.authUserId, 'Quiz 2', 'This is the second test quiz');
        expect(adminQuizNameUpdate(admin.authUserId, quiz2.quizId, 'Quiz 1')).toStrictEqual(ERROR);
    });
});
