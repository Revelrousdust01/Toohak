import { adminQuizCreate, adminQuizDescriptionUpdate, adminQuizList, adminQuizNameUpdate, adminQuizRemove } from './quiz.js';
import { adminAuthRegister, adminUserDetails } from './auth.js';
import { clear } from './other.js';

beforeEach(() => {
    clear();
});

const ERROR = { error: expect.any(String) };

// adminQuizCreate
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
        ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
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

// adminQuizDescriptionUpdate
describe('Test adminQuizDescriptionUpdate', () => {
    let nameFirst = 'Leon'
    let nameLast = 'Sun'
    let email = 'leonsun@gmail.com'
    let password = 'qwer88888888'
    const quizName = 'Quiz 1 Name'
    const quizDescription = 'This is the first new quiz'
    const newQuizDescription = 'New Quiz 1 description'

    test('working input, 0 errors expected', () => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const quiz1 = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, newQuizDescription)).toStrictEqual({});        
    });

    test('authUserId is not valid', () => {
        const admin = adminAuthRegister('leonsun@gmail.com', 'leonsunspassword', 'Leon', 'Sun');
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizDescriptionUpdate(-1, quiz1.quizId,  
            'This is the new description for the first test quiz')).toStrictEqual(ERROR);
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizDescriptionUpdate(invalidId, newQuiz.quizId, newQuizDescription)).toStrictEqual(ERROR);
    });

    test.each([
        { invalidQuizId: '-1' },
        { invalidQuizId: 'a' },
        { invalidQuizId: '/' },
    ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizDescriptionUpdate(admin.authUserId, invalidQuizId, newQuizDescription)).toStrictEqual(ERROR);
    });

    test('quizId does not refer to a quiz that this user owns', () => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const otherAdmin = adminAuthRegister('johndoe@gmail.com', 'johndoespassword', 'John', 'Doe');
        const quizId = adminQuizCreate(otherAdmin.authUserId, quizName, quizDescription);
        expect(adminQuizDescriptionUpdate(admin.authUserId, quizId, newQuizDescription)).toStrictEqual(ERROR);
    });

    test('Description length is greater than 100 characters', () => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const quiz1 = adminQuizCreate(admin.authUserId, 'Quiz 1', 'This is the first test quiz');
        expect(adminQuizDescriptionUpdate(admin.authUserId, quiz1.quizId, 'A'.repeat(999))).toStrictEqual(ERROR);
    });
});

// adminQuizList
describe('adminQuizList', () => {
    let firstName = 'Samuel'
    let lastName = 'Huang'
    let email = 'shuang@student.unsw.edu.au'
    let password = 'a1b2c3d4e5f6'

    test('One quiz in quizlist', () => {
        const UserId = adminAuthRegister(email, password, firstName, lastName)
        const quizId1 = adminQuizCreate(UserId.authUserId, 'How to train your dragon', 
                        'Quiz about the movie trivia of How to Train your dragon')
        expect(adminQuizList(UserId.authUserId)).toStrictEqual({
            quizzes: [
                {
                    quizId: quizId1.quizId,
                    name: 'How to train your dragon'
                }
            ]
        });
    });

    test('Multiple quiz in quizlist', () => {
        const UserId = adminAuthRegister(email, password, firstName, lastName)
        const quizId1 = adminQuizCreate(UserId.authUserId, 'How to train your dragon', 
                        'Quiz about the movie trivia of How to Train your dragon')
        const quizId2 = adminQuizCreate(UserId.authUserId, 'Age of Adeline', 
                        'Quiz about the movie trivia of Age of Adeline')
        const quizId3 = adminQuizCreate(UserId.authUserId, 'Kung Fu Panda', 
                        'Quiz about the movie trivia of Kung Fu Panda')
        expect(adminQuizList(UserId.authUserId)).toStrictEqual({
            quizzes: [
                {
                    quizId: quizId1.quizId,
                    name: 'How to train your dragon'
                },
                {
                    quizId: quizId2.quizId,
                    name: 'Age of Adeline'
                },
                {
                    quizId: quizId3.quizId,
                    name: 'Kung Fu Panda'
                }
            ]
        });
    });

    test('No quiz in quizlist', () => {
        const UserId = adminAuthRegister(email, password, firstName, lastName)
        expect(adminQuizList(UserId.authUserId)).toStrictEqual({
            quizzes: [

            ]
        });
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        const admin = adminAuthRegister(email, password, lastName, firstName);
        const quizId = adminQuizCreate(admin.authUserId, 'QuizName', 'QuizDescription');
	expect(adminQuizList(invalidId)).toStrictEqual(ERROR);
    });
});

// adminQuizNameUpdate
describe('Test adminQuizNameUpdate', () => {
    let nameFirst = 'Leon'
    let nameLast = 'Sun'
    let email = 'leonsun@gmail.com'
    let password = 'qwer88888888'
    const quizName = 'Quiz 1 Name'
    const quizDescription = 'This is the first new quiz'
    const newQuizName = 'New Quiz 1 Name'

    test('Working input, 0 errors expected', () => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(admin.authUserId, newQuiz.quizId, newQuizName)).toStrictEqual({});
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(invalidId, newQuiz.quizId, newQuizName)).toStrictEqual(ERROR);
    });

    test.each([
        { invalidQuizId: '-1' },
        { invalidQuizId: 'a' },
        { invalidQuizId: '/' },
    ])("QuizId does not refer to valid quiz: '$invalidQuizId", ({ invalidQuizId }) => {
        const admin = adminAuthRegister(email, password, nameLast, nameFirst);
        const newQuiz = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(admin.authUserId, invalidQuizId, newQuizName)).toStrictEqual(ERROR);
    });

    test('QuizId does not refer to a quiz that this user owns', () => {
        const admin = adminAuthRegister(email, password, nameFirst, nameLast);
        const otherAdmin = adminAuthRegister('johndoe@gmail.com', 'johndoespassword', 'John', 'Doe');
        const quizId = adminQuizCreate(otherAdmin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(admin.authUserId, quizId, newQuizName)).toStrictEqual(ERROR);
    });

    test.each([
        { invalidCharacter: '`' },
        { invalidCharacter: '~' },
        { invalidCharacter: '+' },
        { invalidCharacter: '_' },
        { invalidCharacter: '=' },
        { invalidCharacter: '*' },
        { invalidCharacter: '/' }
    ])("Quiz name contains invalid character(s): '$invalidCharacter'", ({ invalidCharacter }) => {
        const admin = adminAuthRegister(email, password, nameLast, nameFirst);
        const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        let invalidQuizName = quizName + invalidCharacter;
        expect(adminQuizNameUpdate(admin.authUserId, quizId, invalidQuizName)).toStrictEqual(ERROR);
    });

    test.each([
        { shortQuizName: '1' },
        { shortQuizName: '12' },
        { shortQuizName: '123' },
    ])("Quiz name is less than 3 characters: '$shortQuizName'", ({ shortQuizName }) => {
        const admin = adminAuthRegister(email, password, nameLast, nameFirst);
        const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(admin.authUserId, quizId, shortQuizName)).toStrictEqual(ERROR);
    });

    test('Quiz name is greater than 30 characters', () => {
        const admin = adminAuthRegister(email, password, nameLast, nameFirst);
        const quizId = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        expect(adminQuizNameUpdate(admin.authUserId, quizId, 'A'.repeat(31))).toStrictEqual(ERROR);    
    });

    test('name is already used by the current logged in user for another quiz', () => {
        const admin = adminAuthRegister(email, password, nameLast, nameFirst);
        const quiz1 = adminQuizCreate(admin.authUserId, quizName, quizDescription);
        const quiz2 = adminQuizCreate(admin.authUserId, 'Quiz 2', 'This is the second test quiz');
        expect(adminQuizNameUpdate(admin.authUserId, quiz2.quizId, quizName)).toStrictEqual(ERROR);
    });
});

// adminQuizRemove
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