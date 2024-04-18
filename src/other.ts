import { setData } from './dataStore';
import { timers } from './quiz';

/**
  * Reset the state of the application back to the start.
  *
  * @param {} - no parameters
  *
  * @returns {} - returns an empty object when resetting the application to the start
*/
export function clear(): object {
  for (const timer of timers) {
    clearTimeout(timer);
  }

  setData({
    users: [],
    quizzes: [],
    userSessions: [],
    trash: [],
    quizCounter: 1,
    sessions: []
  });

  return {};
}
