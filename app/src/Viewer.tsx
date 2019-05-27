import * as React from "react";
import {CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";
import {getAPIEndpoint, getLayout} from "./Utiltities";
import {Display, Layout} from "./Models";

interface ViewerProps {
    store: GlobalStore;
}

interface ViewerState {
    displays: Array<Display>
}

export class Viewer extends React.Component<ViewerProps, ViewerState> {
    state: ViewerState = {
        displays: [],
    };

    constructor(props: ViewerProps) {
        super(props);
    }

    componentDidMount(): void {
        this.setFutureDisplaysRefresh()
    }

    setFutureDisplaysRefresh() {
        fetch(getAPIEndpoint() + "/displays/")
            .then(data => data.json())
            .then((displays) => {
                this.setState({
                    displays: displays
                });

                setTimeout(() => this.setFutureDisplaysRefresh(), 3000);
            })
    }

    mapDisplaysToOverlays = () => {
        let overlays = [];
        for (let display of this.state.displays) {
            overlays.push(<Overlay store={this.props.store} display={display} viewOnly/>);
        }
        return overlays;
    };

    render() {
        return <div>
            <h1>Viewer</h1>
            {this.mapDisplaysToOverlays()}
        </div>
    }
}