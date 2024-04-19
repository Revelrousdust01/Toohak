// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import fs from 'fs';
import type { DataStore } from './interfaces';
// import request, { HttpVerb } from 'sync-request';

// const DEPLOYED_URL = "https://1531-24t1-h16a-crunchie.vercel.app"
// const requestHelper = (method: HttpVerb, path: string, payload: object) => {
//   let json = {};
//   let qs = {};
//   if (['POST', 'DELETE'].includes(method)) {
//     qs = payload;
//   } else {
//     json = payload;
//   }
//   const response = request(method, DEPLOYED_URL + path, { qs, json, timeout: 20000 });
//   return JSON.parse(response.body.toString());
// };

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Using Vercel
// function setData(newData: DataStore) {
//   requestHelper('PUT', '/data', { data: newData });
// }

// function loadData(): DataStore{
//   try {
//     const res = requestHelper('GET', '/data', {});
//     return res.data;
//   } catch (e) {
//     return {
//       users: [],
//       quizzes: [],
//       sessions: [],
//       trash: [],
//       userSessions: [],
//       quizCounter: 1
//     };
//   }
// };

let data = loadData();

function getData(): DataStore {
  return data;
}

function loadData(): DataStore {
  const data = fs.readFileSync('./database.json');
  return JSON.parse(data.toString());
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  data = newData;
  const jsonstr = JSON.stringify(newData);
  fs.writeFileSync('./database.json', jsonstr);
}

export { getData, setData };
export type { DataStore };
