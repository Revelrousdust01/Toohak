// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import fs from 'fs';
import type { DataStore } from './interfaces';

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

// Use get() to access the data
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
