import * as React from 'react';
import {useState} from 'react';
import {defaultTextProperties} from './Utiltities';
import {REQUEST_CANVAS_DELETE_OBJECT, REQUEST_CANVAS_RENDER, State, UpdateSelectedObjectMessage} from "./Store";
import {useDispatch, useSelector} from "react-redux";


export const SelectionControls = () => {
    const dispatch = useDispatch();

    const selected = useSelector<State, UpdateSelectedObjectMessage>(
        state => state.updateSelectedObject
    );

    let [textValues, setTextValues] = useState(defaultTextProperties);

    const changeFontSize = (e: React.FormEvent<HTMLInputElement>) => {
        setTextValues({
            fontSize: parseInt(e.currentTarget.value),
            fontFamily: textValues.fontFamily,
        });

        // TODO - this is bad; direct access to modify the current canvas object
        selected.object.fontSize = e.currentTarget.value;

        dispatch({
            type: REQUEST_CANVAS_RENDER,
            requestCanvasRender: {
                when: (new Date).getTime()
            }
        })
    };

    const changeFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTextValues({
            fontSize: textValues.fontSize,
            fontFamily: e.currentTarget.value,
        });

        // TODO - this is bad; direct access to modify the current canvas object
        selected.object.fontFamily = e.currentTarget.value;

        dispatch({
            type: REQUEST_CANVAS_RENDER,
            requestCanvasRender: {
                when: (new Date).getTime()
            }
        })
    };


    return <div>
        {selected ?
            <p>
                <label>Font size</label>
                <input type='number' value={textValues.fontSize}
                       onChange={changeFontSize}/>
                <br/>

                <label>Font family</label>
                <select value={textValues.fontFamily}
                        onChange={changeFontFamily}>
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
            </p> : <p>Nothing selected</p>
        }
    </div>
};
