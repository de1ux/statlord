import {getAPIEndpoint} from "./Utiltities";
import {Display, Gauge, Layout} from "./Models";
import {GlobalStore, SET_DISPLAYS, SET_GAUGES, SET_LAYOUTS} from "./Store";
import {useDispatch} from "react-redux";

namespace api {
    export const fetchLayouts = () => {
        const dispatch = useDispatch();
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

    export const fetchDisplays = () => {
        const dispatch = useDispatch();
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

    export const fetchGauges = () => {
        const dispatch = useDispatch();

        dispatch({
            type: SET_GAUGES,
            setGauges: {
                state: "loading",
            },
        });

        fetch(getAPIEndpoint() + "/gauges/")
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
    }
}


export default api;