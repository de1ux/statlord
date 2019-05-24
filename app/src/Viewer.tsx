import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";

const editorStyle = {
    height: "500px",
    width: "500px",
    backgroundColor: "gray"
};

interface ViewerProps {
    width?: number;
    height?: number;
    name?: string;
}

interface ViewerState {
    ready: boolean,
    width: number,
    height: number,
    name: string,
}

export class Viewer extends React.Component<ViewerProps, ViewerState> {
    store: GlobalStore;

    constructor(props: ViewerProps) {
        super(props);

        this.store = CreateGlobalStore();
        this.state = {
            ready: false,
            width: this.props.width === undefined ? 600 : this.props.width,
            height: this.props.height === undefined ? 400 : this.props.height,
            name: this.props.name === undefined ? 'test-display' : this.props.name,
        };
    }

    renderSetup() {
        return <div>
            <label>Name</label>
            <input type='text' value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
            <br/>

            <label>Width</label>
            <input type='number' value={this.state.width} onChange={(e) => this.setState({width: parseInt(e.target.value)})} />
            <br/>

            <label>Height</label>
            <input type='number' value={this.state.height} onChange={(e) => this.setState({height: parseInt(e.target.value)})}/>
            <br/>

            <button onClick={(e) => this.setState({ready: true})}>Create</button>
        </div>
    }

    render() {
        if (!this.state.ready) {
            return this.renderSetup()
        }
        return <div>
        </div>
    }
}