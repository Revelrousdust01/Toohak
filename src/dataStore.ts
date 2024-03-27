// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import type { DataStore } from './interfaces';

let data: DataStore = {
  /**
   * We want data to store users and quizzes each within their own array.
   * Each one should contain their own specific data as reflected in data.md.
   */
  trash: [

  ],
  users: [

  ],
  userSessions: [

  ],
  quizzes: [

  ]
};

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
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  data = newData;
}

export { getData, setData };
