import * as React from "react";
import {CONTROL_SELECTED, CreateGlobalStore, GlobalStore} from "./Store";
import {getAPIEndpoint} from "./Utiltities";

export interface Gauge {
    pk: string;
    key: string;
    value: string;
}

interface ControlsProps {
    store: GlobalStore
}

interface ControlsState {
    guages: Array<Gauge>;
}

export class Controls extends React.Component<ControlsProps, ControlsState> {
    state: ControlsState = {
        guages: [],
    };

    componentDidMount(): void {
        fetch(getAPIEndpoint() + "/gauges")
            .then(data => data.json())
            .then((data) => {
                this.setState({
                    guages: data.map((d: any) => {
                        return {
                            pk: d.pk,
                            key: d.fields.key,
                            value: d.fields.value
                        };
                    })
                });
            })
    }

    renderControls = () => {
        return this.state.guages.map((gauge: Gauge) =>
            <div style={{cursor: 'move'}} onMouseDown={(e) => {
                e.preventDefault();
                this.props.store.dispatch({
                    type: CONTROL_SELECTED,
                    controlSelected: {
                        control: gauge,
                    },
                });
            }}>
                {JSON.stringify(gauge)}
            </div>
        );
    }

    render() {
        return <div>
            {this.renderControls()}
        </div>
    }
}