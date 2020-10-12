import * as React from 'react';
import {CONTROL_ADDED, ELEMENT_ADDED, ResourceState, State} from '../store';
import {Gauge} from "../models";
import {useDispatch, useSelector} from "react-redux";
import api from "../api";
import {useEffect} from "react";

export const AddControls = () => {
    const dispatch = useDispatch();
    const gauges = useSelector<State, ResourceState<Array<Gauge>>>(
        state => state.gauges
    );

    switch (gauges.state) {
        case "init":
            api.fetchGauges(dispatch);
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {gauges.reason}</p>;
    }

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
