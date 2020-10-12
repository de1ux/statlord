import * as React from 'react';
import {ResourceState, State} from '../store';
import {Display, Layout} from "../models";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import api from "../api";
import {AddControls} from "./AddControls";
import {ModifyControls} from "./ModifyControls";
import {Canvas} from "./Canvas";


export const Editor = () => {
    const dispatch = useDispatch();
    let {layoutKey} = useParams();

    const layouts = useSelector<State, ResourceState<Array<Layout>>>(
        state => state.layouts
    );
    const displays = useSelector<State, ResourceState<Array<Display>>>(
        state => state.displays
    );

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
