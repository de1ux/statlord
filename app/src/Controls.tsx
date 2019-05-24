import * as React from "react";
import {ADD_CONTROL, ADD_ELEMENT, CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
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
        this.setFutureGaugesRefresh()
    }

    setFutureGaugesRefresh(): void {
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

                setTimeout(() => this.setFutureGaugesRefresh(), 3000);
            })
    }

    addControl = (gauge: Gauge) => (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.store.dispatch({
            type: ADD_CONTROL,
            addControl: {
                control: gauge,
            },
        });
    };

    addItext = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.store.dispatch({
            type: ADD_ELEMENT,
            addElement: {
                element: 'itext',
                when: (new Date).getTime()
            }
        })
    }

    renderControls = () => {
        return this.state.guages.map((gauge: Gauge) =>
            <tr>
                <td>{gauge.key}</td>
                <td>{gauge.value}</td>
                <td>
                    <button onClick={this.addControl(gauge)}>
                        Add
                    </button>
                </td>
            </tr>
        );
    };

    render() {
        return <div>
            <table>
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.renderControls()}
                <tr>
                    <td>Insert text</td>
                    <td></td>
                    <td><button onClick={this.addItext}>Add</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    }
}