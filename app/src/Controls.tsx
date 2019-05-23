import * as React from "react";
import {CONTROL_SELECTED, CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {getAPIEndpoint} from "./Utiltities";
import {Gauge} from "./Models";

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
        this.setFutureGaugeRefresh()
    }

    setFutureGaugeRefresh(): void {
        fetch(getAPIEndpoint() + "/gauges/")
            .then(data => data.json())
            .then((data) => {
                this.setState({
                    guages: data.map((d: any) => {
                        return {
                            key: d.key,
                            value: d.value
                        };
                    })
                });

                for (let gauge of data) {
                    this.props.store.dispatch({
                        type: CONTROL_UPDATED,
                        controlUpdated: {
                            control: gauge,
                        },
                    })
                }

                setTimeout(() => this.setFutureGaugeRefresh(), 3000);
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