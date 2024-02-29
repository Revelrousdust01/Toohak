import {dataStore, getData} from './dataStore';
import {isEmail} from 'validator/lib/isEmail';

export function validNameFirst(nameFirst){

}

export function validNameLast(nameLast){

}

export function validEmail(email){
    data = getData();
    if(data.users.find(user => user.email === email))
        return false;
    else if(!email.isEmail)
        return false;
    
    return true
}

export function validPassword(password){
    
}