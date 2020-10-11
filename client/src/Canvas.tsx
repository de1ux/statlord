import * as React from 'react';
import {serializeImageDataToBW} from './Serialization';
import {ControlAddedMessage, ControlUpdatedMessage, ElementAddedMessage, UPDATE_SELECTED_OBJECT} from './Store';
import {defaultTextProperties, getAPIEndpoint, getKeyFromURL, getLargestDisplayDimension} from './Utiltities';
import {Display, Layout} from "./Models";
import {useDispatch} from "react-redux";

declare var fabric: any;

interface CanvasProps {
    displays: Array<Display>
    layout: Layout
}

export const Canvas = (props: CanvasProps) => {
    let canvas: any;
    let controls: Map<String, any> = new Map();
    let displays: Map<String, Array<number>> = new Map();

    const writeFutureCanvasData = async () => {
        if (canvas === undefined) {
            setTimeout(() => writeFutureCanvasData(), 500);
            return;
        }

        let fetches = [];
        for (let [key, position] of displays.entries()) {
            let display = props.displays.find((display: Display) => display.key === key),
                x = Math.floor(position[0]),
                y = Math.floor(position[1]),
                w = display.resolution_x,
                h = display.resolution_y;

            let displayData = canvas.contextContainer.getImageData(x, y, w, h);
            display.display_data = serializeImageDataToBW(displayData, display);

            fetches.push(
                fetch(getAPIEndpoint() + '/displays/' + display.key + '/', {
                    method: 'PUT',
                    body: JSON.stringify(display),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
            );
        }

        await Promise.all(fetches);
        setTimeout(() => writeFutureCanvasData(), 1000);
    };

    const writeFutureLayout = async () => {
        if (canvas === undefined) {
            setTimeout(() => writeFutureLayout(), 500);
            return;
        }

        let body = JSON.stringify({
            'data': canvas.toJSONWithKeys(),
            'display_positions': JSON.stringify([...displays]),
        });

        fetch(getAPIEndpoint() + '/layouts/' + getKeyFromURL() + '/', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => {
            setTimeout(() => writeFutureLayout(), 1000);
        });
    };


    const renderDisplayBoundaries = (displayPositions?: Map<String, Array<number>>) => {
        if (canvas === undefined) {
            return;
        }

        let offsetLeft = 0;
        for (let display of props.displays) {
            let rect = new fabric.Rect(),
                left = offsetLeft,
                top = 0;

            if (displayPositions && displayPositions.size > 0) {
                if (displayPositions.get(display.key)) {
                    left = displayPositions.get(display.key)[0];
                    top = displayPositions.get(display.key)[1];
                }
            }

            rect.set({
                width: display.resolution_x,
                height: display.resolution_y,
                fill: 'gray',
                opacity: 0.1,
                top: top,
                left: left,
            });

            // disable resizing
            rect.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                bl: false,
                br: false,
                tl: false,
                tr: false,
                mtr: false,
            });
            rect.key = display.key;

            attatchDisplayEventHandlers(rect);
            attachTextEventHandlers(rect);
            canvas.add(rect);
            rect.moveTo(-100);

            displays.set(display.key, [left, top]);

            offsetLeft += display.resolution_x;
        }
    };

    const renderCanvasFromLayoutData = (layout: Layout) => {
        let layoutData = JSON.parse(layout.data);
        canvas.loadFromJSON(layoutData, () => {
            canvas.getObjects().map((object: any) => {
                // TODO - this is a jank way of reinitializing controls
                if (object.key) {
                    controls.set(object.key, object);
                }
                if (object.type === 'text' || object.type === 'i-text') {
                    attachTextEventHandlers(object);
                }

                if (object.type === 'rect') {
                    canvas.remove(object);
                }

            });
            canvas.renderAll();
        });

        if (layout.display_positions === '') {
            renderDisplayBoundaries();
        } else {
            renderDisplayBoundaries(new Map(JSON.parse(props.layout.display_positions)));
        }
    };


    const controlUpdated = (message: ControlUpdatedMessage) => {
        if (controls.get(message.control.key) === undefined) {
            return;
        }

        controls.get(message.control.key).text = message.control.value;

        if (canvas) {
            canvas.renderAll();
        }
    };

    const attachTextEventHandlers = (object: any) => {
        const dispatch = useDispatch();
        object.on('selected', () => {
            dispatch({
                type: UPDATE_SELECTED_OBJECT,
                updateSelectedObject: {
                    object: object,
                },
            });
        });
        object.on('deselected', () => {
            dispatch({
                type: UPDATE_SELECTED_OBJECT,
                updateSelectedObject: {
                    object: undefined,
                },
            });
        });
    };

    const attatchDisplayEventHandlers = (object: any) => {
        object.on('moved', () => {
            displays.set(object.key, [object.left, object.top]);
        });
    };

    const addControl = (message: ControlAddedMessage) => {
        if (canvas === undefined) {
            return;
        }

        let textProperties = {
            ...defaultTextProperties(),
            left: 10,
            top: 10,
            key: message.control.key,
        };

        let text = new fabric.Text(message.control.value, textProperties);
        attachTextEventHandlers(text);
        canvas.add(text);

        controls.set(message.control.key, text);
        text.moveTo(100);
    };

    const addElement = (message: ElementAddedMessage) => {
        if (canvas === undefined) {
            return;
        }

        switch (message.element) {
            case 'itext':
                let textProperties = {
                    ...defaultTextProperties(),
                    left: 10,
                    top: 10,
                };

                let text = new fabric.IText('Text', textProperties);
                attachTextEventHandlers(text);

                canvas.add(text);
                text.moveTo(100);
                return;
            default:
                alert(`Unrecognized element: ${message.element}`);
        }
    };

    canvas = new fabric.Canvas('overlay', {enableRetinaScaling: false});

    // add a method to add the "key" property to object output
    canvas.toJSONWithKeys = () => {
        let origJSON = canvas.toJSON();
        origJSON.objects = canvas.getObjects().map((object: any) => {
            let origObjectJSON = object.toJSON();
            origObjectJSON.key = object.key;
            return origObjectJSON;
        });
        return origJSON;
    };

    renderCanvasFromLayoutData(props.layout);

    let largestDimension = getLargestDisplayDimension(props.displays);

    return <canvas id="overlay"
                   width={`${largestDimension}px`}
                   height={`${largestDimension}px`}
                   style={{border: '1px solid #aaa'}}>
    </canvas>;
};


/*onStoreTrigger = () => {
    let state: State = this.props.store.getState();
    if (state.requestCanvasRender && this.lastRerender !== state.requestCanvasRender) {
        this.lastRerender = state.requestCanvasRender;
        this.canvas.renderAll();
    }

    if (state.requestCanvasDeleteObject && this.lastDeleteObject !== state.requestCanvasDeleteObject) {
        this.lastDeleteObject = state.requestCanvasDeleteObject;
        this.canvas.remove(this.canvas.getActiveObject());
    }

    if (state.controlUpdated && this.lastControlUpdated !== state.controlUpdated) {
        this.lastControlUpdated = state.controlUpdated;
        this.controlUpdated(state.controlUpdated);
    }

    if (state.elementAdded && this.lastAddElement !== state.elementAdded) {
        this.lastAddElement = state.elementAdded;
        this.addElement(state.elementAdded);
    }

    if (state.controlAdded && this.lastAddControl !== state.controlAdded) {
        this.lastAddControl = state.controlAdded;
        this.addControl(state.controlAdded);
    }
};*/
