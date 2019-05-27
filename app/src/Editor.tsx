import * as React from "react";
import {CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";
import {getAPIEndpoint, getLayout} from "./Utiltities";
import {Display, Layout} from "./Models";


interface EditorProps {
    store: GlobalStore;
}

interface EditorState {
    displays: Array<Display>
}

export class Editor extends React.Component<EditorProps, EditorState> {
    state: EditorState = {
        displays: [],
    };

    constructor(props: EditorProps) {
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
            overlays.push(<Overlay store={this.props.store} display={display} viewOnly={false} />);
        }
        return overlays;
    };

    render() {

        return <div>
            <Controls store={this.props.store}/>
            {this.mapDisplaysToOverlays()}
        </div>
    }
}