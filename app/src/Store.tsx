import {createStore, Store} from 'redux';
import {Gauge} from "./Models";

export const
    ADD_CONTROL = 'ADD_CONTROL',
    ADD_ELEMENT = 'ADD_ELEMENT',
    CONTROL_UPDATED = 'CONTROL_UPDATED';


export interface AddControlMessage {
    control: Gauge
}

export interface ControlUpdatedMessage {
    control: Gauge
}

export interface AddElementMessage {
    element: string
    when: number
}

export interface State {
    addElement: AddElementMessage;
    addControl: AddControlMessage;
    controlUpdated: ControlUpdatedMessage;
}

export interface Action extends State {
    type: string;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case ADD_CONTROL:
            return {
                ...state, addControl: action.addControl
            };
        case CONTROL_UPDATED:
            return {
                ...state, controlUpdated: action.controlUpdated
            };
        case ADD_ELEMENT:
            return {
                ...state, addElement: action.addElement
            };
        default:
            return state;
    }
}

export type GlobalStore = Store<State>;

export function CreateGlobalStore(): GlobalStore {
    return createStore(reducer);
}
