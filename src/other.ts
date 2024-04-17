import { getData, setData } from './dataStore';
import type { DataStore } from './interfaces';
import { timers } from './quiz';

/**
  * Reset the state of the application back to the start.
  *
  * @param {} - no parameters
  *
  * @returns {} - returns an empty object when resetting the application to the start
*/
export function clear(): object {
  const currentState: DataStore = getData();
  for (const timer of timers) {
    clearTimeout(timer);
  }
  currentState.users = [];
  currentState.quizzes = [];
  currentState.userSessions = [];
  currentState.trash = [];
  currentState.quizCounter = 1;
  currentState.sessions = [];
  setData(currentState);

  return {};
}
