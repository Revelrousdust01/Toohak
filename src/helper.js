import {getData} from './dataStore';
import validator from 'validator';

/**
  * Validates email of certain conditions:
  * - Email address is used by another user.
  * - Email does not satisfy this validator
  * 
  * @param {string} email - Email of user
  * 
  * @returns { } - Returns empty object when name is valid
*/

export function validEmail(email){
    let data = getData();

    if(data.users.find(user => user.email === email))
        return { error: 'Email address is already used by another user.'};
    else if(!validator.isEmail(email))
        return { error: 'Please enter a valid email.' };

    return { }
}

/**
  * Validates First or Last name of certain Conditions
  * - Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  * - Name is less than 2 characters or more than 20 characters.
  * 
  * @param {string} name - First or last name of user
  * @param {boolean} isFirst - First Name bool check
  * 
  * @returns { } - Returns empty object when name is valid
*/

export function validName(name, isFirst) {
    const characterRegex = /^[A-Za-z\s'-]+$/;

    if (!characterRegex.test(name))
        return { error: (isFirst ? 'First' : 'Last').concat(' name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.') };
    else if (name.length < 2 || name.length > 20) 
        return { error: (isFirst ? 'First' : 'Last').concat(' name must not be less than 2 characters or more than 20 characters.') };

    return { };
}

/**
  * Validates password of certain conditions:
  * - Password is less than 8 characters.
  * - Password does not contain at least one number and at least one letter.
  * 
  * @param {string} password - Password of user
  * 
  * @returns { } - Returns empty object when name is valid
*/

export function validPassword(password){
    const digitsAndLetters = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;
    
    if (password.length < 8)
        return { error: 'Password must contain at least 8 characters.' };
    else if(!digitsAndLetters.test(password))
        return { error: 'Password must contain at least letter and one number.' };

    return { }
}

/**
  * Validates Quiz name of certain Conditions
  * - Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  * - Name is less than 3 characters or more than 30 characters.
  * 
  * @param {string} name - Name of quiz
  * 
  * @returns { } - Returns empty object when name is valid
*/

export function validQuizName(name) {
    const characterRegex = /^[A-Za-z\s'-]+$/;

    if (!characterRegex.test(name))
        return { error: ' Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.' };
    else if (name.length < 3 || name.length > 30) 
        return { error: ' Name must not be less than 2 characters or more than 30 characters.' };

    return { };
}

