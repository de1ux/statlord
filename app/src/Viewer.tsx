import * as React from "react";
import {CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";
import {getAPIEndpoint, getLayout} from "./Utiltities";
import {Display, Layout} from "./Models";


interface ViewerState {
    displays: Array<Display>
    layout?: Layout;
}

export class Viewer extends React.Component<{}, ViewerState> {
    state: ViewerState = {
        displays: [],
    };
    store: GlobalStore;

    constructor(props: {}) {
        super(props);

        this.store = CreateGlobalStore();
    }

    componentDidMount(): void {
        getLayout().then((layout: Layout) => {
            if (layout === undefined) {
                fetch(getAPIEndpoint() + "/layouts/default/", {
                    method: 'PUT',
                    body: "",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(data => {
                    this.setState({layout: {data: ""}})
                })
            }
            this.setState({layout: layout})
        });
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
            overlays.push(<Overlay store={this.store} display={display} layout={this.state.layout} viewOnly />);
        }
        return overlays;
    };

    render() {
        if (!this.state.layout) {
            return "Awaiting layout..."
        }

        return <div>
            {this.mapDisplaysToOverlays()}
        </div>
    }
}