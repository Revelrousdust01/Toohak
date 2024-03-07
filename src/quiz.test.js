<<<<<<< HEAD
import { adminQuizCreate, adminQuizRemove } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

// Clear before each test
beforeEach(() => {
    clear();
});

const ERROR = { error: expect.any(String) };

describe('Test adminQuizCreate', () => {
    const firstName = 'Jeffery'
    const lastName = 'Zhang'
    const email = 'jeffery.zhang385@gmail.com'
    const password = 'str0ngpassword'
    const quizName = 'New Quiz'
    const quizDescription = 'This is a new quiz'

    test('Valid inputs', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(newQuiz).toStrictEqual({ quizId: expect.any(Number) });
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        expect(adminQuizCreate(invalidId, quizName, quizDescription)).toStrictEqual(ERROR);
    });

    test.each([
        { invalidCharacter: '`' },
        { invalidCharacter: '~' },
        { invalidCharacter: '+' },
        { invalidCharacter: '_' },
        { invalidCharacter: '=' },
        { invalidCharacter: '*' },
        { invalidCharacter: '/' }
        ])("Quiz name contains unwanted character: '$invalidCharacter'", ({ invalidCharacter }) => {
            const admin = adminAuthRegister(email, password, lastName, firstName);
            expect(adminQuizCreate(admin.authUserId, invalidCharacter, quizDescription)).toStrictEqual(ERROR);
        });

    test.each([
        { shortQuizName: '1' },
        { shortQuizName: '12' },
        { shortQuizName: '123' },
        { shortQuizName: '1234' },
        { shortQuizName: '12345' },
        { shortQuizName: '123456' },
        { shortQuizName: '1234567' }
        ])("Quiz name is less than 8 characters: '$shortQuizName'", ({ shortQuizName }) => {
            const admin = adminAuthRegister(email, password, lastName, firstName);
            expect(adminQuizCreate(admin.authUserId, shortQuizName, quizDescription)).toStrictEqual(ERROR);
    });

    test('Quiz name is greater than 30 characters', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        expect(adminQuizCreate(admin.authUserId, 'a'.repeat(31), quizDescription)).toStrictEqual(ERROR);
    });

    test('Name is already used', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizCreate(admin.authUserId, quizName, quizDescription)).toStrictEqual(ERROR);
    });

    test('Description is too long', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        expect(adminQuizCreate(admin.authUserId, quizName, 'a'.repeat(101))).toStrictEqual(ERROR);
    });
});

    
describe('Test adminQuizRemove', () => {
    const firstName = 'Jeffery'
    const lastName = 'Zhang'
    const email = 'jeffery.zhang385@gmail.com'
    const password = 'str0ngpassword'
    const quizName = 'New Quiz'
    const quizDescription = 'This is a new quiz'

    test('Valid inputs', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizRemove(admin.authUserId, quizId.quizId)).toStrictEqual({});
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizRemove(invalidId, quizId)).toStrictEqual(ERROR);
    });

    test.each([
        { invalidQuizId: '-1' },
        { invalidQuizId: 'a' },
        { invalidQuizId: '/' },
    ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        expect(adminQuizRemove(admin.authUserId, invalidQuizId)).toStrictEqual(ERROR);
    });

    test('QuizId does not refer to a quiz that this user owns', () => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const admin1 = adminAuthRegister('bob.smith@gmail.com', '1234', 'Smith', 'Bob');
        const quizId = adminQuizCreate(admin1.authUserId, quizName, quizDescription);
        expect(adminQuizRemove(admin.authUserId, quizId)).toStrictEqual(ERROR);
    });
});
=======
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
>>>>>>> 91e44962374b229b46c606c1de16d55535cd2110
