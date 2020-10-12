import * as React from 'react';
import {CONTROL_UPDATED, ResourceState, State} from '../store';
import {Display, Layout} from "../models";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import api, {getAPIEndpoint} from "../api";
import {AddControls} from "./AddControls";
import {ModifyControls} from "./ModifyControls";
import {Canvas} from "./Canvas";
import {useEffect, useState} from "react";


export const Editor = () => {
    const dispatch = useDispatch();
    let {layoutKey} = useParams();

    const [runningGaugeRefreshLoop, setRunningGaugeRefreshLoop] = useState(false);

    const layouts = useSelector<State, ResourceState<Array<Layout>>>(
        state => state.layouts
    );
    const displays = useSelector<State, ResourceState<Array<Display>>>(
        state => state.displays
    );

    const setFutureGaugesRefresh = () => {
        fetch(getAPIEndpoint() + "/gauges/")
            .then(data => data.json())
            .then((data) => {
                for (let gauge of data) {
                    dispatch({
                        type: CONTROL_UPDATED,
                        controlUpdated: {
                            control: gauge,
                        },
                    })
                }

                setTimeout(() => setFutureGaugesRefresh(), 1000);
            })
    };

    useEffect(() => {
        if (!runningGaugeRefreshLoop) {
            setFutureGaugesRefresh();
            setRunningGaugeRefreshLoop(true);
        }
    });

    switch (layouts.state) {
        case "init":
            api.fetchLayouts(dispatch);
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {layouts.reason}</p>;
    }

    switch (displays.state) {
        case "init":
            api.fetchDisplays(dispatch);
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {displays.reason}</p>;
    }

    const layout = layouts.data.find(layout => layout.key === layoutKey);
    if (!layout) {
        return <p>Failed to find a layout with key: {layoutKey}</p>
    }

    return <div style={{display: 'flex'}}>
        <div>
            <ModifyControls/>
            <AddControls/>
        </div>
        <Canvas displays={displays.data} layout={layout}/>
    </div>
};
