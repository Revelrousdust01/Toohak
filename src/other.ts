import { getData, setData } from './dataStore';
import type { DataStore } from './interfaces';

/**
  * Reset the state of the application back to the start.
  *
  * @param {} - no parameters
  *
  * @returns {} - returns an empty object when resetting the application to the start
*/
export function clear(): object {
  const currentState: DataStore = getData();

  currentState.users = [];
  currentState.quizzes = [];
  currentState.userSessions = [];
  currentState.trash = [];
  currentState.quizCounter = 1;

  setData(currentState);

  return {};
}
