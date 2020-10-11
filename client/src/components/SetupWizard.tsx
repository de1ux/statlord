import * as React from 'react';
import {Display, Gauge, Layout} from "../models";
import api, {getAPIEndpoint} from "../api";
import {useSelector} from "react-redux";
import {ResourceState, State} from "../store";
import {useState} from "react";
import {NavLink} from "react-router-dom";

export const SetupWizard = () => {
    const [newLayout, setNewLayout] = useState({
        key: 'default',
        data: '',
        display_positions: '',

    });
    const [newDisplay, setNewDisplay] = useState({
        key: 'browser-a',
        resolution_x: 400,
        resolution_y: 600,
        available: true,
        display_data: '',
        rotation: 0,

    });
    const [newGauge, setNewGauge] = useState({
        key: 'time',
        value: (new Date).getTime().toString(),
    });

    const layouts = useSelector<State, ResourceState<Array<Layout>>>(
        state => state.layouts
    );
    const displays = useSelector<State, ResourceState<Array<Display>>>(
        state => state.displays
    );
    const gauges = useSelector<State, ResourceState<Array<Gauge>>>(
        state => state.gauges
    );

    switch (layouts.state) {
        case "init":
            api.fetchLayouts();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {layouts.reason}</p>;
    }

    switch (displays.state) {
        case "init":
            api.fetchDisplays();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {displays.reason}</p>;
    }

    switch (gauges.state) {
        case "init":
            api.fetchGauges();
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {gauges.reason}</p>;
    }

    const reloadModels = () => {
        api.fetchGauges();
        api.fetchDisplays();
        api.fetchLayouts();
    }

    const createNewGauge = () => {
        fetch(getAPIEndpoint() + '/gauges/' + newGauge.key + '/', {
            method: 'PUT',
            body: JSON.stringify({'value': newGauge.value}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            reloadModels();
        });
    };

    const createNewDisplay = () => {
        fetch(getAPIEndpoint() + '/displays/' + newDisplay.key + '/', {
            method: 'PUT',
            body: JSON.stringify(newDisplay),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            reloadModels();
        });
    };

    const createNewLayout = () => {
        fetch(getAPIEndpoint() + '/layouts/' + newLayout.key + '/', {
            method: 'PUT',
            body: JSON.stringify(newLayout),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            reloadModels();
        });
    };

    return <div>
        <h2>Setup</h2>
        <p>
            Need at least one layout, and one display.
        </p>

        <div>
            <div>
                <h3>Layouts</h3>
                <ul>
                    {layouts.data.map((layout) => {
                        return <li key={layout.key}>
                            {layout.key} (<NavLink to={`/edit/${layout.key}`}>edit</NavLink>)
                        </li>;
                    })}
                </ul>
                <div>
                    <p>Create a layout:</p>
                    <label>Name</label>
                    <input type={'text'} value={newLayout.key} onChange={(e) => setNewLayout({
                        ...newLayout,
                        key: e.target.value
                    })}/>
                    <br/>

                    <button onClick={(e) => createNewLayout()}>Create</button>
                </div>
            </div>

            <div>
                <h3>Displays</h3>
                <ul>
                    {displays.data.map((display) => {
                        return <li key={display.key}>
                            <NavLink to={`/view/${display.key}`}>{display.key}</NavLink>
                        </li>;
                    })}
                </ul>
                <div>
                    <p>Common displays:</p>
                    <ul>
                        <li>Adafruit Sharp Memory LCD: 168x144</li>
                        <li>Pimoroni Inky Phat: 104x212</li>
                        <li>Pimoroni Hyperpixel: 800x480</li>
                    </ul>
                    <p>Create a display:</p>
                    <label>Name</label>
                    <input type={'text'} value={newDisplay.key} onChange={(e) => setNewDisplay({
                        ...newDisplay,
                        key: e.target.value
                    })}/>
                    <br/>

                    <label>Width (in pixels)</label>
                    <input type={'number'} value={newDisplay.resolution_x}
                           onChange={(e) => setNewDisplay({
                               ...newDisplay,
                               resolution_x: parseInt(e.target.value)
                           })}/>
                    <br/>

                    <label>Height (in pixels)</label>
                    <input type={'number'} value={newDisplay.resolution_y}
                           onChange={(e) => setNewDisplay({
                               ...newDisplay,
                               resolution_y: parseInt(e.target.value)
                           })}/>
                    <br/>

                    <button onClick={(e) => createNewDisplay()}>Create</button>
                </div>
            </div>

            <div>
                <h3>Gauges</h3>
                <ul>
                    {gauges.data.map((gauge) => {
                        return <li key={gauge.key}>{gauge.key}</li>;
                    })}
                </ul>
                <div>
                    <p>Create a gauge:</p>
                    <label>Key</label>
                    <input type={'text'} value={newGauge.key} onChange={(e) => setNewGauge({
                        ...newGauge,
                        key: e.target.value
                    })}/>
                    <br/>

                    <label>Value</label>
                    <input type={'text'} value={newGauge.value} onChange={(e) => setNewGauge({
                        ...newGauge,
                        value: e.target.value
                    })}/>
                    <br/>

                    <button onClick={(e) => createNewGauge()}>Create</button>
                </div>
            </div>
        </div>
    </div>;

};