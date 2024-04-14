/**
 * Stores all unique interfaces that maybe used throughout the project
 */

export interface Answer {
    answerId: number,
    answer: string,
    colour: string,
    correct: boolean
}

export interface AnswerBody {
    answer: string,
    correct: boolean
}

export interface createTokenReturn {
    token: string
}

export interface createQuestionReturn{
    questionId: number
}

export interface duplicateReturn {
    newQuestionId: number
}

export interface createQuizReturn {
    quizId: number
}

export interface Question {
    questionId: number,
    duration: number,
    points: number
    question: string,
    answers: Answer[],
}

export interface QuestionBody {
    answers: AnswerBody[],
    duration: number,
    points: number
    question: string
}

export interface Payload {
    [key: string]: any;
}

export interface Quiz {
    quizId: number,
    description: string,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    questionCounter: number,
    questions: Question[]
}

export interface QuizArray {
    quizzes: QuizList[]
}

export interface QuizList {
    quizId: number,
    name: string
}

export interface UserSessions {
    userId: number
    sessionId: string
}

export interface ReturnUser {
    user:{
        userId: number,
        name: string,
        email: string,
        numSuccessfulLogins: number,
        numFailedPasswordsSinceLastLogin: number,
    }
}

export interface Trash {
    quizId: number,
    description: string,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    questions: Question[]
}

export interface User {
    userId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    oldPasswords: string[],
    numFailedPasswordsSinceLastLogin: number,
    numSuccessfulLogins: number,
    ownedQuizzes: number[],
    password: string
}

export interface DataStore {
    trash: Trash[],
    users: User[],
    userSessions: UserSessions[]
    quizCounter: number;
    quizzes: Quiz[]
}

export interface ErrorObject {
    error: string;
}

export interface OldRequestHelperReturnType {
    statusCode: number;
    jsonBody?: Record<string, string | number>;
    error?: string;
}

export interface Payload {
    [key: string]: unknown;
}
