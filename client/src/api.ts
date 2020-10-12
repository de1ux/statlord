import {Display, Gauge, Layout} from "./models";
import {SET_DISPLAYS, SET_GAUGES, SET_LAYOUTS} from "./store";
import {Dispatch} from "redux";


export function getAPIEndpoint(): string {
    return "/api"
}

namespace api {
    export const fetchLayouts = (dispatch: Dispatch<any>) => {
        dispatch({
            type: SET_LAYOUTS,
            setLayouts: {
                state: "loading",
            },
        });

        fetch(getAPIEndpoint() + '/layouts/')
            .then(data => data.json())
            .then((layouts: Array<Layout>) => {
                dispatch({
                    type: SET_LAYOUTS,
                    setLayouts: {
                        state: "success",
                        data: layouts
                    }
                })
            })
    };

    export const fetchDisplays = (dispatch: Dispatch<any>) => {
        dispatch({
            type: SET_DISPLAYS,
            setDisplays: {
                state: "loading",
            },
        });

        fetch(getAPIEndpoint() + '/displays/')
            .then(data => data.json())
            .then((displays: Array<Display>) => {
                dispatch({
                    type: SET_DISPLAYS,
                    setDisplays: {
                        state: "success",
                        data: displays
                    }
                })
            });
    };

    export const fetchGauges = (dispatch: Dispatch<any>) => {
        dispatch({
            type: SET_GAUGES,
            setGauges: {
                state: "loading",
            },
        });

        return fetch(getAPIEndpoint() + "/gauges/")
            .then(data => data.json())
            .then((gauges: Array<Gauge>) => {
                dispatch({
                    type: SET_GAUGES,
                    setGauges: {
                        state: "success",
                        data: gauges
                    }
                })
            });
    };

    export const deleteLayout = (layoutKey: string) => {
        return fetch(getAPIEndpoint() + '/layouts/' + layoutKey + '/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };

    export const deleteDisplay = (displayKey: string) => {
        return fetch(getAPIEndpoint() + '/displays/' + displayKey + '/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };

    export const createLayout = (layout: Layout) => {
        return fetch(getAPIEndpoint() + '/layouts/' + layout.key + '/', {
            method: 'PUT',
            body: JSON.stringify(layout),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };

    export const createOrUpdateDisplay = (display: Display) => {
        return fetch(getAPIEndpoint() + '/displays/' + display.key + '/', {
            method: 'PUT',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };

    export const createNewGauge = (gauge: Gauge) => {
        return fetch(getAPIEndpoint() + '/gauges/' + gauge.key + '/', {
            method: 'PUT',
            body: JSON.stringify({'value': gauge.value}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };
}


export default api;