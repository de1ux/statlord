import * as React from 'react';
import {CONTROL_ADDED, CONTROL_UPDATED, ELEMENT_ADDED, GlobalStore} from './Store';
import {getAPIEndpoint} from './Utiltities';
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
            type: CONTROL_ADDED,
            controlAdded: {
                control: gauge,
            },
        });
    };

    addItext = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.store.dispatch({
            type: ELEMENT_ADDED,
            elementAdded: {
                element: 'itext',
                when: (new Date).getTime()
            }
        })
    };

    renderControls = () => {
        return this.state.guages.map((gauge: Gauge) =>
            <tr key={gauge.key}>
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
                <tr key={"insert-text"}>
                    <td>Insert text</td>
                    <td></td>
                    <td>
                        <button onClick={this.addItext}>Add</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    }
}