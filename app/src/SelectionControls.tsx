import * as React from 'react';
import {defaultTextProperties, TextValues} from './Utiltities';
import {GlobalStore, REQUEST_CANVAS_DELETE_OBJECT, REQUEST_CANVAS_RENDER, State} from "./Store";
import {Unsubscribe} from "redux";


interface SelectionControlsProps {
    store: GlobalStore;
}

interface SelectionControlsState extends TextValues {
    selected?: any
}

export class SelectionControls extends React.Component<SelectionControlsProps, SelectionControlsState> {
    unsubscribe: Unsubscribe;

    constructor(props: SelectionControlsProps) {
        super(props);

        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());
        this.state = defaultTextProperties()
    }

    onStoreTrigger = () => {
        let state: State = this.props.store.getState();
        if (state.updateSelectedObject && this.state.selected != state.updateSelectedObject) {
            this.setState({
                selected: state.updateSelectedObject.object,
            });
        }
    };

    changeFontSize = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState<any>({
            fontSize: e.currentTarget.value,
        });

        // TODO - this is bad
        this.state.selected.fontSize = e.currentTarget.value;

        this.props.store.dispatch({
            type: REQUEST_CANVAS_RENDER,
            requestCanvasRender: {
                when: (new Date).getTime()
            }
        })
    };

    changeFontFamily = (e: React.FormEvent<HTMLSelectElement>) => {
        this.setState<any>({
            fontFamily: e.currentTarget.value,
        });

        // TODO - this is bad
        this.state.selected.fontFamily = e.currentTarget.value;

        this.props.store.dispatch({
            type: REQUEST_CANVAS_RENDER,
            requestCanvasRender: {
                when: (new Date).getTime()
            }
        })
    };

    componentWillUnmount(): void {
        this.unsubscribe();
    }

    render() {
        if (this.state.selected === undefined) {
            return <p>Nothing selected</p>
        }

        return <div>
            <p>
                <label>Font size</label>
                <input type='number' value={this.state.fontSize} onChange={this.changeFontSize}/>
                <br/>

                <label>Font family</label>
                <select value={this.state.fontFamily} onChange={this.changeFontFamily}>
                    <option>Arial</option>
                    <option>Helvetica</option>
                </select>
                <br/>

                <button onClick={(e) => this.props.store.dispatch({
                    type: REQUEST_CANVAS_DELETE_OBJECT,
                    requestCanvasDeleteObject: {when: (new Date).getTime()}
                })}>Delete
                </button>
            </p>
        </div>
    }
}