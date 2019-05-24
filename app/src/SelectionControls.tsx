import * as React from "react";
import {CONTROL_UPDATED, CreateGlobalStore, GlobalStore} from "./Store";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";
import {defaultTextProperties, getAPIEndpoint, TextValues} from "./Utiltities";
import {Display, Gauge} from "./Models";


interface SelectionControlsProps {
    selected?: Gauge
    object: any
    renderAll: () => void
    delete: () => void
}

interface SelectionControlsState extends TextValues {
}

export class SelectionControls extends React.Component<SelectionControlsProps, SelectionControlsState> {


    constructor(props: SelectionControlsProps) {
        super(props);

        this.state = defaultTextProperties()
    }

    changeFontSize = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState<any>({
            fontSize: e.currentTarget.value,
        });
        this.props.object.fontSize = e.currentTarget.value;
        this.props.renderAll()
    };

    changeFontFamily = (e: React.FormEvent<HTMLSelectElement>) => {
        this.setState<any>({
            fontFamily: e.currentTarget.value,
        });
        console.log(this.props.object.fontFamily);
        this.props.object.fontFamily = e.currentTarget.value;
        console.log(this.props.object.fontFamily);
        this.props.renderAll()
    };

    render() {
        if (this.props.object === undefined) {
            return <p>Nothing selected</p>
        }

        return <div>
            <button onClick={(e) => this.props.delete()}>Delete</button>
            <br/>
            <label>Font size</label>
            <input type='number' value={this.state.fontSize} onChange={this.changeFontSize}/>
            <br/>

            <label>Font family</label>
            <select value={this.state.fontFamily} onChange={this.changeFontFamily}>
                <option>Arial</option>
                <option>Helvetica</option>
            </select>
        </div>
    }
}