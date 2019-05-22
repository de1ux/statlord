import { createStore, Store } from 'redux';

export const
  GLOBAL_MESSAGE = 'GLOBAL_MESSAGE',
  REFRESH_JOBS = 'REFRESH_JOBS';

export interface GlobalMessage {
  message: string;
  time: string;
}

export interface RefreshJobs {
  time: string;
}

export interface State {
  globalMessage: GlobalMessage;
  refreshJobs: RefreshJobs;
}

export interface Action {
  type: string;
  globalMessage: GlobalMessage;
  refreshJobs: RefreshJobs;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case GLOBAL_MESSAGE:
      return {
        ...state, globalMessage: action.globalMessage
      };
    case REFRESH_JOBS:
      return {
        ...state, refreshJobs: action.refreshJobs
      };
    default:
      return state;
  }
}

export type GlobalStore = Store<State>;

export function CreateGlobalStore(): GlobalStore {
  return createStore(reducer);
}
