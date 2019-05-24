import * as React from "react";
import {CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {Hitarea} from "./Hitarea";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";
import {getAPIEndpoint} from "./Utiltities";
import {Display} from "./Models";


interface EditorState {
    displays: Array<Display>
}

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
        displays: [],
    };
    store: GlobalStore;

    constructor(props: {}) {
        super(props);

        this.store = CreateGlobalStore();
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
            overlays.push(<Overlay store={this.store} display={display}/>);
        }
        return overlays;
    }

    render() {
        return <div>
            <Controls store={this.store}/>
            {this.mapDisplaysToOverlays()}
        </div>
    }
}