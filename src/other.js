import { getData, setData } from './dataStore';
/**
  * Reset the state of the application back to the start.
  *
  * @param {} - no parameters
  *
  * @returns {} - returns an empty object when resetting the application to the start
*/
export function clear() {
  const currentState = getData();

  currentState.users = [];
  currentState.quizzes = [];

  setData(currentState);

  return {};
}
