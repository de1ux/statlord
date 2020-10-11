import {createStore, Store} from 'redux';
import {Display, Gauge, Layout} from "./Models";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";

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
    control: Gauge
}

export interface ControlUpdatedMessage {
    control: Gauge
}

export interface ElementAddedMessage {
    element: string
    when: number
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

export interface SetLayoutsMessage {
    layouts: Array<Layout>
}

export interface SetGaugesMessage {
    gauges: Array<Gauge>
}

export interface SetDisplaysMessage {
    displays: Array<Display>
}

export type ResourceInitialState = {
    state: "init";
};

export type ResourceLoadingState = {
    state: "loading";
};

export type ResourceFailedState = {
    state: "failed";
    reason: string;
};

export type ResourceSuccessState<T> = {
    state: "success";
    data: T;
};

export type ResourceState<T> =
    | ResourceInitialState
    | ResourceLoadingState
    | ResourceFailedState
    | ResourceSuccessState<T>;


export interface State {
    layouts: ResourceState<Array<Layout>>;
    gauges: ResourceState<Array<Gauge>>;
    displays: ResourceState<Array<Display>>;

    elementAdded: ElementAddedMessage;
    controlAdded: ControlAddedMessage;
    controlUpdated: ControlUpdatedMessage;
    requestCanvasRender: RequestCanvasRenderMessage;
    updateSelectedObject: UpdateSelectedObjectMessage;
    requestCanvasDeleteObject: RequestCanvasDeleteObjectMessage;
}

export interface Action extends State {
    type: string;

    setLayouts: SetLayoutsMessage;
    setGauges: SetGaugesMessage;
    setDisplays: SetDisplaysMessage;
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
                ...state, layouts: action.setLayouts,
            };
        case SET_GAUGES:
            return {
                ...state, gauges: action.setGauges,
            };
        case SET_DISPLAYS:
            return {
                ...state, displays: action.setDisplays,
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
    return createStore(reducer, {
        layouts: {
            state: 'init'
        },
        displays: {
            state: 'init'
        },
        gauges: {
            state: 'init'
        }
    });
}
