import * as React from 'react';
import {Canvas} from './Canvas';
import {Controls} from './Controls';
import {Models} from './Models';
import {SelectionControls} from './SelectionControls';
import {GlobalStore} from './Store';
import {getAPIEndpoint} from './Utiltities';
import {ViewOnlyCanvas} from './ViewOnlyCanvas';

interface OverlayProps {
    store: GlobalStore;
    viewDisplayKey?: string;
    layout?: Models.Layout
}

interface OverlayState {
    selectedControl?: Models.Gauge;
    selectedObject?: any;

    displays: Array<Models.Display>;
}

export class Editor extends React.Component<OverlayProps, OverlayState> {
    constructor(props: OverlayProps) {
        super(props);

        this.state = {
            displays: [],
        };
    }

    componentDidMount(): void {
        this.setFutureDisplaysRefresh();
    }

    setFutureDisplaysRefresh() {
        fetch(getAPIEndpoint() + '/displays/')
            .then(data => data.json())
            .then((displays: Array<Models.Display>) => {
                this.setState({
                    displays: displays,
                });

                setTimeout(() => this.setFutureDisplaysRefresh(), 3000);
            });
    }

    render() {
        if (this.state.displays.length === 0) {
            return <p>Must register at least one display to use the editor. <a href="/editor/">Go back?</a></p>;
        }

        return <div style={{display: 'flex'}}>
            {
                this.props.viewDisplayKey ?
                    <div>
                        <ViewOnlyCanvas store={this.props.store}
                                        display={this.state.displays.find((display: Models.Display) => display.key === this.props.viewDisplayKey)}/>
                    </div> :
                    <div>
                        <div>
                            <Controls store={this.props.store}/>
                            <SelectionControls store={this.props.store}/>
                        </div>
                        <Canvas store={this.props.store} displays={this.state.displays} layout={this.props.layout}/>
                    </div>

            }

        </div>;
    }
}