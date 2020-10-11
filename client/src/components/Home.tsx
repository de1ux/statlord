import {GlobalStore, ResourceState, State} from "../store";
import * as React from "react";
import {useSelector} from "react-redux";
import {Display, Layout} from "../models";
import api from "../api";
import {NavLink} from "react-router-dom";

interface HomeProps {
    store: GlobalStore;
}

export const Home = (props: HomeProps) => {
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

    return <div>
        <h1>Statlord</h1>
        <h2>Layouts</h2>
        <ul>
            {layouts.data.map(layout =>
                <li key={layout.key}>
                    <NavLink to={`/edit/${layout.key}`}>{layout.key}</NavLink>
                </li>
            )}
        </ul>
        <h2>Displays</h2>
        <ul>
            {displays.data.map(display =>
                <li key={display.key}>
                    <NavLink to={`/view/${display.key}`}>{display.key}</NavLink>
                </li>
            )}
        </ul>
    </div>
};