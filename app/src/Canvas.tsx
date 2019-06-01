import * as React from 'react';
import {Models} from './Models';
import {
    ControlAddedMessage,
    ControlUpdatedMessage,
    ElementAddedMessage,
    GlobalStore,
    RequestCanvasDeleteObjectMessage,
    RequestCanvasRenderMessage,
    State,
    UPDATE_SELECTED_OBJECT
} from './Store';
import {defaultTextProperties, getAPIEndpoint, getKeyFromURL, isEmpty, isWorker} from './Utiltities';
import {Unsubscribe} from 'redux';
import set = Reflect.set;

declare var fabric: any;

interface CanvasProps {
    displays: Array<Models.Display>
    layout: Models.Layout
    store: GlobalStore;
}

interface CanvasState {
    largestDimension: number;
}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    canvas: any;
    controls: Map<String, any> = new Map();
    displays: Map<String, Array<number>> = new Map();
    lastRerender: RequestCanvasRenderMessage;
    lastDeleteObject: RequestCanvasDeleteObjectMessage;
    lastControlUpdated: ControlUpdatedMessage;
    lastAddControl: ControlAddedMessage;
    lastAddElement: any;
    unsubscribe: Unsubscribe;

    constructor(props: CanvasProps) {
        super(props);

        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());

        this.writeFutureCanvasData();
        this.writeFutureLayout();
    }

    onStoreTrigger = () => {
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
    };

    get largestDimension(): number {
        let height = 0,
            width = 0;

        for (let display of this.props.displays) {
            width += display.resolution_x;
            height += display.resolution_y;
        }

        return width > height ? width : height;
    }

    async writeFutureCanvasData() {
        if (this.canvas === undefined) {
            setTimeout(() => this.writeFutureCanvasData(), 500);
            return;
        }

        let puts = [];
        for (let [key, position] of this.displays.entries()) {
            let display = this.props.displays.find((display: Models.Display) => display.key === key),
                x = Math.floor(position[0]),
                y = Math.floor(position[1]),
                w = display.resolution_x,
                h = display.resolution_y;

            console.log(`Snapping ${x}x${y} w=${w} h=${h}`);
            let displayCanvasData = this.canvas.contextContainer.getImageData(x, y, w, h);

            let pixels = [];
            let i = -1;
            for (let pixel of displayCanvasData.data) {
                i++;
                if (i % 4 !== 0) {
                    continue
                }
                if (pixel < 10) {
                    pixels.push(0)
                } else {
                    pixels.push(1);
                }
            }
            display.display_data = JSON.stringify(pixels);

            puts.push(fetch(getAPIEndpoint() + '/displays/' + display.key + '/', {
                method: 'PUT',
                body: JSON.stringify(display),
                headers: {
                    'Content-Type': 'application/json'
                },
            }));
        }

        await Promise.all(puts);
        setTimeout(() => this.writeFutureCanvasData(), 500);
    }

    writeFutureLayout() {
        if (this.canvas === undefined) {
            setTimeout(() => this.writeFutureLayout(), 500);
            return;
        }

        let body = JSON.stringify({
            'data': this.canvas.toJSONWithKeys(),
            'display_positions': JSON.stringify([...this.displays]),
        });

        fetch(getAPIEndpoint() + '/layouts/' + getKeyFromURL() + '/', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => {
            setTimeout(() => this.writeFutureLayout(), 500);
        });
    }

    renderCanvasFromLayoutData(layout: Models.Layout) {
        let layoutData = JSON.parse(layout.data);
        this.canvas.loadFromJSON(layoutData, () => {
            this.canvas.getObjects().map((object: any) => {
                // TODO - this is a jank way of reinitializing controls
                if (object.key) {
                    this.controls.set(object.key, object);
                }
                if (object.type === 'text' || object.type === 'i-text') {
                    this.attachTextEventHandlers(object);
                }

                if (object.type === 'rect') {
                    this.canvas.remove(object);
                }

            });
            this.canvas.renderAll();
        });

        if (layout.display_positions === '') {
            this.renderDisplayBoundaries(this.props.displays);
        } else {
            this.renderDisplayBoundaries(this.props.displays, new Map(JSON.parse(this.props.layout.display_positions)));
        }
    }

    renderDisplayBoundaries(displays: Array<Models.Display>, displayPositions?: Map<String, Array<number>>) {
        if (this.canvas === undefined) {
            return;
        }

        let offsetLeft = 0;
        for (let display of displays) {
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

            this.attatchDisplayEventHandlers(rect);
            this.attachTextEventHandlers(rect);
            this.canvas.add(rect);
            rect.moveTo(-100);

            this.displays.set(display.key, [left, top]);

            offsetLeft += display.resolution_x;
        }
    }

    addControl(message: ControlAddedMessage) {
        if (this.canvas === undefined) {
            return;
        }

        let textProperties = {
            ...defaultTextProperties(),
            left: 10,
            top: 10,
            key: message.control.key,
        };

        let text = new fabric.Text(message.control.value, textProperties);

        this.attachTextEventHandlers(text);

        this.controls.set(message.control.key, text);
        this.canvas.add(text);
        text.moveTo(100);
    }

    controlUpdated(message: ControlUpdatedMessage) {
        if (this.controls.get(message.control.key) !== undefined) {
            this.controls.get(message.control.key).text = message.control.value;

            this.renderCanvas();
        }
    }

    attachTextEventHandlers(object: any) {
        object.on('selected', () => {
            this.props.store.dispatch({
                type: UPDATE_SELECTED_OBJECT,
                updateSelectedObject: {
                    object: object,
                },
            });
        });
        object.on('deselected', () => {
            this.props.store.dispatch({
                type: UPDATE_SELECTED_OBJECT,
                updateSelectedObject: {
                    object: undefined,
                },
            });
        });
    }

    attatchDisplayEventHandlers(object: any) {
        object.on('moved', () => {
            this.displays.set(object.key, [object.left, object.top]);
        });
    }

    addElement(message: ElementAddedMessage) {
        if (this.canvas === undefined) {
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
                this.attachTextEventHandlers(text);

                this.canvas.add(text);
                text.moveTo(100);
                return;
            default:
                alert(`Unrecognized element: ${message.element}`);
        }
    }

    renderCanvas = () => {
        if (!this.canvas) {
            return;
        }
        this.canvas.renderAll();
    };

    componentDidMount(): void {
        this.canvas = new fabric.Canvas('overlay', {enableRetinaScaling: false});

        // add a method to add the "key" property to object output
        this.canvas.toJSONWithKeys = () => {
            let origJSON = this.canvas.toJSON();
            origJSON.objects = this.canvas.getObjects().map((object: any) => {
                let origObjectJSON = object.toJSON();
                origObjectJSON.key = object.key;
                return origObjectJSON;
            });
            return origJSON;
        };


        this.renderCanvasFromLayoutData(this.props.layout);
    }

    render() {
        return <canvas id="overlay"
                       width={`${this.largestDimension}px`}
                       height={`${this.largestDimension}px`}
                       style={{border: '1px solid #aaa'}}>
        </canvas>;
    }
}

