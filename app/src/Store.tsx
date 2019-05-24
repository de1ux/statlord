import {createStore, Store} from 'redux';
import {Gauge} from "./Models";

export const
    CONTROL_SELECTED = 'CONTROL_SELECTED',
    CONTROL_DROPPED = 'CONTROL_DROPPED',
    CONTROL_UPDATED = 'CONTROL_UPDATED',
    LOCATE_OVERLAY_CONTROL = 'LOCATE_OVERLAY_CONTROL';

export interface ControlSelectedMessage {
    control: Gauge
}

export interface ControlDroppedMessage {
    control: Gauge
    x: number;
    y: number;
}

export interface ControlUpdatedMessage {
    control: Gauge
}

export interface LocateOverlayControlMessage {
    x: number
    y: number
}

export interface State {
    controlDropped: ControlDroppedMessage;
    controlSelected: ControlSelectedMessage;
    controlUpdated: ControlUpdatedMessage;
    locateOverlayControl: LocateOverlayControlMessage;
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
        case CONTROL_UPDATED:
            return {
                ...state, controlUpdated: action.controlUpdated
            };
        case LOCATE_OVERLAY_CONTROL:
            return {
                ...state, locateOverlayControl: action.locateOverlayControl
            };
        default:
            return state;
    }
}

export type GlobalStore = Store<State>;

export function CreateGlobalStore(): GlobalStore {
    return createStore(reducer);
}
