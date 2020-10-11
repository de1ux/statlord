import {GlobalStore, State} from "./Store";
import * as React from "react";

interface HomeProps {
    store: GlobalStore;
}

interface HomeState {}

export class Home extends React.Component<HomeProps, HomeState> {
    render() {

        let state: State = this.props.store.getState();
        return <div>
            <h1>Statlord</h1>
            <h2>Layouts</h2>
            <ul>

            </ul>
        </div>
    }
}