/**
 * Stores all unique interfaces that maybe used throughout the project
 */

export interface createTokenReturn {
    token: string
}

export interface Question {
    questionId: number,
    name: string,
    answers: string[],
    correctAnswer: string
}

export interface Quiz {
    quizId: number,
    description: string,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    question: Question[]
}

export interface UserSessions {
    userId: number
    sessionId: string
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
    users: User[],
    userSessions: UserSessions[]
    quizzes: Quiz[]
}

export interface ErrorObject {
    error: string;
}

export interface RequestHelperReturnType {
    statusCode: number;
    jsonBody?: Record<string, string | number>;
    error?: string;
  }