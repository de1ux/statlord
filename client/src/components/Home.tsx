import {GlobalStore, ResourceState, State} from "../store";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Display, Layout} from "../models";
import api from "../api";
import {NavLink} from "react-router-dom";
import {SetupWizard} from "./SetupWizard";

interface HomeProps {
    store: GlobalStore;
}

export const Home = (props: HomeProps) => {
    const dispatch = useDispatch();

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

    return <div>
        <h1>Statlord</h1>
        <SetupWizard/>
    </div>
};