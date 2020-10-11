import * as React from 'react';
import {CONTROL_ADDED, ELEMENT_ADDED, ResourceState, State} from './Store';
import {Gauge} from "./Models";
import {useDispatch, useSelector} from "react-redux";

export const Controls = () => {
    const dispatch = useDispatch();
    const gauges = useSelector<State, ResourceState<Array<Gauge>>>(
        state => state.gauges
    );

    const addControl = (gauge: Gauge) => (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch({
            type: CONTROL_ADDED,
            controlAdded: {
                control: gauge,
            },
        });
    };

    const addItext = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch({
            type: ELEMENT_ADDED,
            elementAdded: {
                element: 'itext',
                when: (new Date).getTime()
            }
        })
    };

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
            {
                gauges.state === 'success' ? gauges.data.map((gauge: Gauge) =>
                    <tr key={gauge.key}>
                        <td>{gauge.key}</td>
                        <td>{gauge.value}</td>
                        <td>
                            <button onClick={addControl(gauge)}>
                                Add
                            </button>
                        </td>
                    </tr>
                ) : null
            }
            <tr key={"insert-text"}>
                <td>Insert text</td>
                <td></td>
                <td>
                    <button onClick={addItext}>Add</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>;
};
