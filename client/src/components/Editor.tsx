import * as React from 'react';
import {GlobalStore, ResourceState, State} from '../store';
import {Display, Layout} from "../models";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import api from "../api";
import {AddControls} from "./AddControls";
import {ModifyControls} from "./ModifyControls";
import {Canvas} from "./Canvas";

interface OverlayProps {
    store: GlobalStore;
    viewDisplayKey?: string;
    layout?: Layout
}


export const Editor = (props: OverlayProps) => {
    let {key} = useParams();

    const layouts = useSelector<State, ResourceState<Array<Layout>>>(
        state => state.layouts
    );
    const displays = useSelector<State, ResourceState<Array<Display>>>(
        state => state.displays
    );

    switch (layouts.state) {
        case "init":
            api.fetchLayouts();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {layouts.reason}</p>;
    }

    switch (displays.state) {
        case "init":
            api.fetchDisplays();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {displays.reason}</p>;
    }

    const layout = layouts.data.find(layout => layout.key === key);
    if (!layout) {
        return <p>Failed to find a layout with key: {key}</p>
    }

    return <div style={{display: 'flex'}}>
        <div>
            <ModifyControls/>
            <AddControls/>
        </div>
        <Canvas displays={displays.data} layout={layout}/>
    </div>
};
