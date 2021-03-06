import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    ControlAddedMessage,
    ControlUpdatedMessage,
    ElementAddedMessage,
    RequestCanvasRenderMessage, ResourceState,
    State,
    UPDATE_SELECTED_OBJECT
} from '../store';

import {defaultTextProperties, getKeyFromURL, getLargestDisplayDimension, serializeImageDataToBW} from '../utiltities';
import {Display, Gauge, Layout} from "../models";
import {useDispatch, useSelector} from "react-redux";
import api, {getAPIEndpoint} from "../api";

declare var fabric: any;

interface CanvasProps {
    displays: Array<Display>
    layout: Layout
}

export const Canvas = (props: CanvasProps) => {
    const dispatch = useDispatch();
    const [canvas, setCanvas] = useState();

    const [controls, setControls] = useState(new Map());
    const [displays, setDisplays] = useState(new Map());

    const controlAdded = useSelector<State, ControlAddedMessage>(
        state => state.controlAdded
    );
    const elementAdded = useSelector<State, ElementAddedMessage>(
        state => state.elementAdded
    );
    const requestCanvasRender = useSelector<State, RequestCanvasRenderMessage>(
        state => state.requestCanvasRender
    );
    const gauges = useSelector<State, ResourceState<Array<Gauge>>>(
        state => state.gauges
    );
    const [runningCanvasWriteLoops, setRunningCanvasWriteLoops] = useState<boolean>(false);

    useEffect(() => {
        if (!controlAdded) {
            return;
        }
        addControl(controlAdded);
    }, [controlAdded]);

    useEffect(() => {
        if (!elementAdded) {
            return;
        }
        addElement(elementAdded);
    }, [elementAdded]);

    useEffect(() => {
        if (!requestCanvasRender) {
            return;
        }
        if (!canvas) {
            return;
        }
        canvas.renderAll();
    }, [requestCanvasRender]);

    useEffect(() => {
        // when the HTML5 canvas element mounts, and fabricjs canvas isn't mounted
        // create a fabricjs canvas and attach a method for exporing object to json (layout)
        if (canvas) {
            return;
        }
        const newCanvas = new fabric.Canvas('overlay', {enableRetinaScaling: false});

        // add a method to add the "key" property to object output
        newCanvas.toJSONWithKeys = () => {
            let origJSON = newCanvas.toJSON();
            origJSON.objects = newCanvas.getObjects().map((object: any) => {
                let origObjectJSON = object.toJSON();
                origObjectJSON.key = object.key;
                return origObjectJSON;
            });
            return origJSON;
        };

        setCanvas(newCanvas);
    });

    const controlUpdated = (gauge: Gauge) => {
        if (controls.get(gauge.key) === undefined) {
            return;
        }

        controls.get(gauge.key).text = gauge.value;
    };

    useEffect(() => {
        // when gauges change, incrementally feed changes into underlying fabricjs objects
        if (!canvas) {
            return;
        }
        if (gauges.state !== 'success') {
            return;
        }

        for (let gauge of gauges.data) {
            controlUpdated(gauge);
        }
        canvas.renderAll();
    }, [gauges]);

    const writeFutureCanvasData = async () => {
        let fetches = [];
        for (let [key, position] of displays.entries()) {
            let display = props.displays.find((display: Display) => display.key === key),
                x = Math.floor(position[0]),
                y = Math.floor(position[1]),
                w = display.resolution_x,
                h = display.resolution_y;

            let displayData = canvas.contextContainer.getImageData(x, y, w, h);
            display.display_data = serializeImageDataToBW(displayData, display);

            fetches.push(api.createOrUpdateDisplay(display));
        }

        await Promise.all(fetches);
        setTimeout(() => writeFutureCanvasData(), 1000);
    };

    useEffect(() => {
        // when canvas becomes ready
        // 1) render any preexisting layout data from the server
        // 2) start a loop to push layout/display data to the server
        if (!canvas) {
            return;
        }

        renderCanvasFromLayoutData(canvas, props.layout);

        if (!runningCanvasWriteLoops) {
            writeFutureCanvasData();
            writeFutureLayout();
            setRunningCanvasWriteLoops(true);
        }
    }, [canvas]);

    const writeFutureLayout = async () => {
        let body = JSON.stringify({
            'data': canvas.toJSONWithKeys(),
            'display_positions': JSON.stringify([...displays]),
        });

        fetch(getAPIEndpoint() + '/layouts/' + props.layout.key + '/', {
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

            // push to the background now (controls should always be on "top"),
            // and whenever focus lost
            rect.moveTo(-100);
            rect.on('deselected', () => {
                rect.moveTo(-100);
            });

            displays.set(display.key, [left, top]);
            offsetLeft += display.resolution_x;
        }
    };

    const renderCanvasFromLayoutData = (canvas: any, layout: Layout) => {
        let layoutData = JSON.parse(layout.data);
        canvas.loadFromJSON(layoutData, () => {
            canvas.getObjects().map((object: any) => {
                if (object.key) {
                    setControls(new Map(controls.set(object.key, object)))
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

    const attachTextEventHandlers = (object: any) => {
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
            ...defaultTextProperties,
            left: 10,
            top: 10,
            key: message.control.key,
        };

        let text = new fabric.Text(message.control.value, textProperties);
        attachTextEventHandlers(text);
        canvas.add(text);

        // TODO - clunky immutable ES6 map set
        setControls(new Map(controls.set(message.control.key, text)));
        text.moveTo(100);
    };

    const addElement = (message: ElementAddedMessage) => {
        if (canvas === undefined) {
            return;
        }

        switch (message.element) {
            case 'itext':
                let textProperties = {
                    ...defaultTextProperties,
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
