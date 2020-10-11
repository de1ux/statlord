import {GlobalStore, ResourceState, State} from "../store";
import * as React from "react";
import {useSelector} from "react-redux";
import {Layout} from "../models";
import api from "../api";
import {NavLink} from "react-router-dom";

interface HomeProps {
    store: GlobalStore;
}

export const Home = (props: HomeProps) => {
    const layouts = useSelector<State, ResourceState<Array<Layout>>>(
        state => state.layouts
    );

    switch (layouts.state) {
        case "init":
            api.fetchLayouts();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {layouts.reason}</p>;
        case "success":
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
            </div>
    }
};