import * as React from 'react';
import {getAPIEndpoint} from './Utiltities';
import {Display, Gauge, Layout} from "./Models";

interface SetupWizardProps {
}

interface SetupWizardState {
    layouts: Array<Layout>
    displays: Array<Display>
    gauges: Array<Gauge>

    newGauge: Gauge
    newLayout: Layout
    newDisplay: Display
}

export class SetupWizard extends React.Component<SetupWizardProps, SetupWizardState> {
    constructor(props: SetupWizardProps) {
        super(props);

        this.state = {
            layouts: [],
            displays: [],
            gauges: [],
            newGauge: {
                key: 'time',
                value: (new Date).getTime().toString(),
            },
            newLayout: {
                key: 'default',
                data: '',
                display_positions: '',
            },
            newDisplay: {
                key: 'browser-a',
                resolution_x: 400,
                resolution_y: 600,
                available: true,
                display_data: '',
                rotation: 0,
            },
        };
    }

    componentDidMount(): void {
        this.reloadModels();
    }

    reloadModels() {
        fetch(getAPIEndpoint() + '/layouts/')
            .then(data => data.json())
            .then((layouts: Array<Layout>) => {
                this.setState({layouts: layouts});
            });

        fetch(getAPIEndpoint() + '/displays/')
            .then(data => data.json())
            .then((displays: Array<Display>) => {
                this.setState({displays: displays});
            });

        fetch(getAPIEndpoint() + '/gauges/')
            .then(data => data.json())
            .then((gauges: Array<Gauge>) => {
                this.setState({gauges: gauges});
            });
    }

    createNewGauge() {
        fetch(getAPIEndpoint() + '/gauges/' + this.state.newGauge.key + '/', {
            method: 'PUT',
            body: JSON.stringify({'value': this.state.newGauge.value}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.reloadModels();
        });
    }

    createNewDisplay() {
        fetch(getAPIEndpoint() + '/displays/' + this.state.newDisplay.key + '/', {
            method: 'PUT',
            body: JSON.stringify(this.state.newDisplay),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.reloadModels();
        });
    }

    createNewLayout() {
        fetch(getAPIEndpoint() + '/layouts/' + this.state.newLayout.key + '/', {
            method: 'PUT',
            body: JSON.stringify(this.state.newLayout),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.reloadModels();
        });
    }

    render() {
        return <div>
            <h1>Setup</h1>
            <p>
                Need at least one layout, and one display.
            </p>

            <div>
                <div>
                    <h2>Layouts</h2>
                    <ul>
                        {this.state.layouts.map((layout) => {
                            return <li key={layout.key}>{layout.key} (<a href={"/editor/?key=" + layout.key}>editor</a>)</li>;
                        })}
                    </ul>
                    <div>
                        <p>Create a layout:</p>
                        <label>Name</label>
                        <input type={'text'} value={this.state.newLayout.key} onChange={(e) => this.setState({
                            newLayout: {
                                ...this.state.newLayout,
                                key: e.target.value
                            }
                        })}/>
                        <br/>

                        <button onClick={(e) => this.createNewLayout()}>Create</button>
                    </div>
                </div>

                <div>
                    <h2>Displays</h2>
                    <ul>
                        {this.state.displays.map((display) => {
                            return <li key={display.key}>{display.key}</li>;
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
                        <input type={'text'} value={this.state.newDisplay.key} onChange={(e) => this.setState({
                            newDisplay: {
                                ...this.state.newDisplay,
                                key: e.target.value
                            }
                        })}/>
                        <br/>

                        <label>Width (in pixels)</label>
                        <input type={'number'} value={this.state.newDisplay.resolution_x}
                               onChange={(e) => this.setState({
                                   newDisplay: {
                                       ...this.state.newDisplay,
                                       resolution_x: parseInt(e.target.value)
                                   }
                               })}/>
                        <br/>

                        <label>Height (in pixels)</label>
                        <input type={'number'} value={this.state.newDisplay.resolution_y}
                               onChange={(e) => this.setState({
                                   newDisplay: {
                                       ...this.state.newDisplay,
                                       resolution_y: parseInt(e.target.value)
                                   }
                               })}/>
                        <br/>

                        <button onClick={(e) => this.createNewDisplay()}>Create</button>
                    </div>
                </div>

                <div>
                    <h2>Gauges</h2>
                    <ul>
                        {this.state.gauges.map((gauge) => {
                            return <li key={gauge.key}>{gauge.key}</li>;
                        })}
                    </ul>
                    <div>
                        <p>Create a gauge:</p>
                        <label>Key</label>
                        <input type={'text'} value={this.state.newGauge.key} onChange={(e) => this.setState({
                            newGauge: {
                                ...this.state.newGauge,
                                key: e.target.value
                            }
                        })}/>
                        <br/>

                        <label>Value</label>
                        <input type={'text'} value={this.state.newGauge.value} onChange={(e) => this.setState({
                            newGauge: {
                                ...this.state.newGauge,
                                value: e.target.value
                            }
                        })}/>
                        <br/>

                        <button onClick={(e) => this.createNewGauge()}>Create</button>
                    </div>
                </div>
            </div>
        </div>;
    }
}
