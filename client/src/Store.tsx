import {createStore, Store} from 'redux';
import {Models} from './Models';

export const
    CONTROL_ADDED = 'CONTROL_ADDED',
    ELEMENT_ADDED = 'ELEMENT_ADDED',
    CONTROL_UPDATED = 'CONTROL_UPDATED',
    SET_LAYOUTS = 'SET_LAYOUT',
    SET_GAUGES = 'SET_GAUGES',
    SET_DISPLAYS = 'SET_DISPLAYS',
    REQUEST_CANVAS_RENDER = 'REQUEST_CANVAS_RENDER',
    UPDATE_SELECTED_OBJECT = 'UPDATE_SELECTED_OBJECT',
    REQUEST_CANVAS_DELETE_OBJECT = 'REQUEST_CANVAS_DELETE_OBJECT';

export interface ControlAddedMessage {
    control: Models.Gauge
}

export interface ControlUpdatedMessage {
    control: Models.Gauge
}

export interface ElementAddedMessage {
    element: string
    when: number
}

export interface SetLayoutsMessage {
    layouts: Array<Models.Layout>
}

export interface SetGaugesMessage {
    gauges: Array<Models.Gauge>
}

export interface SetDisplaysMessage {
    displays: Array<Models.Display>
}

export interface RequestCanvasRenderMessage {
    when: number
}

export interface UpdateSelectedObjectMessage {
    object?: any
}

export interface RequestCanvasDeleteObjectMessage {
    when: number
}

export interface State {
    elementAdded: ElementAddedMessage;
    controlAdded: ControlAddedMessage;
    controlUpdated: ControlUpdatedMessage;
    setLayouts: SetLayoutsMessage;
    setGauges: SetGaugesMessage;
    setDisplays: SetDisplaysMessage;
    requestCanvasRender: RequestCanvasRenderMessage;
    updateSelectedObject: UpdateSelectedObjectMessage;
    requestCanvasDeleteObject: RequestCanvasDeleteObjectMessage;
}

export interface Action extends State {
    type: string;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case CONTROL_ADDED:
            return {
                ...state, controlAdded: action.controlAdded
            };
        case CONTROL_UPDATED:
            return {
                ...state, controlUpdated: action.controlUpdated
            };
        case ELEMENT_ADDED:
            return {
                ...state, elementAdded: action.elementAdded
            };
        case SET_LAYOUTS:
            return {
                ...state, setLayouts: action.setLayouts,
            };
        case SET_GAUGES:
            return {
                ...state, setGagues: action.setGauges,
            };
        case SET_DISPLAYS:
            return {
                ...state, setDisplays: action.setDisplays,
            };
        case REQUEST_CANVAS_RENDER:
            return {
                ...state, requestCanvasRender: action.requestCanvasRender,
            };
        case UPDATE_SELECTED_OBJECT:
            return {
                ...state, updateSelectedObject: action.updateSelectedObject,
            };
        case REQUEST_CANVAS_DELETE_OBJECT:
            return {
                ...state, requestCanvasDeleteObject: action.requestCanvasDeleteObject,
            };

        default:
            return state;
    }
}

export type GlobalStore = Store<State>;

export function CreateGlobalStore(): GlobalStore {
    return createStore(reducer);
}
