import * as React from 'react';
import {defaultTextProperties, TextValues} from './Utiltities';
import {REQUEST_CANVAS_DELETE_OBJECT, REQUEST_CANVAS_RENDER} from "./Store";
import {Unsubscribe} from "redux";
import {useDispatch} from "react-redux";


interface SelectionControlsProps {
}

interface SelectionControlsState extends TextValues {
    selected?: any
}

export class SelectionControls extends React.Component<SelectionControlsProps, SelectionControlsState> {
    unsubscribe: Unsubscribe;

    constructor(props: SelectionControlsProps) {
        super(props);

        this.state = defaultTextProperties()
    }

    changeFontSize = (e: React.FormEvent<HTMLInputElement>) => {
        const dispatch = useDispatch();

        this.setState<any>({
            fontSize: e.currentTarget.value,
        });

        // TODO - this is bad
        this.state.selected.fontSize = e.currentTarget.value;

        dispatch({
            type: REQUEST_CANVAS_RENDER,
            requestCanvasRender: {
                when: (new Date).getTime()
            }
        })
    };

    changeFontFamily = (e: React.FormEvent<HTMLSelectElement>) => {
        const dispatch = useDispatch();

        this.setState<any>({
            fontFamily: e.currentTarget.value,
        });

        // TODO - this is bad
        this.state.selected.fontFamily = e.currentTarget.value;

        dispatch({
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
        const dispatch = useDispatch();

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

                <button onClick={(e) => dispatch({
                    type: REQUEST_CANVAS_DELETE_OBJECT,
                    requestCanvasDeleteObject: {
                        when: (new Date).getTime()
                    }
                })}>Delete
                </button>
            </p>
        </div>
    }
}