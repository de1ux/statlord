import {createStore, Store} from 'redux';

export const
    CONTROL_SELECTED = 'CONTROL_SELECTED',
    CONTROL_DROPPED = 'CONTROL_DROPPED';

export interface ControlSelectedMessage {
    control: any
}

export interface ControlDroppedMessage {
    control: any
    x: number;
    y: number;
}

export interface State {
    controlDropped: ControlDroppedMessage;
    controlSelected: ControlSelectedMessage;
}

export interface Action extends State {
    type: string;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case CONTROL_DROPPED:
            return {
                ...state, controlDropped: action.controlDropped
            };
        case CONTROL_SELECTED:
            return {
                ...state, controlSelected: action.controlSelected
            };
        default:
            return state;
    }
}

export type GlobalStore = Store<State>;

export function CreateGlobalStore(): GlobalStore {
    return createStore(reducer);
}
