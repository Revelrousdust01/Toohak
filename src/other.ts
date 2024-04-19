import { setData } from './dataStore';
import { timers } from './session';
import { startTimer } from './player';


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
  for (const timer of startTimer) {
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
