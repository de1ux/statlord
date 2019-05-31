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
import {defaultTextProperties, getAPIEndpoint, getKeyFromURL} from './Utiltities';
import {Unsubscribe} from 'redux';

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
    displays: Map<String, Array<Number>> = new Map();
    lastRerender: RequestCanvasRenderMessage;
    lastDeleteObject: RequestCanvasDeleteObjectMessage;
    lastControlUpdated: ControlUpdatedMessage;
    lastAddControl: ControlAddedMessage;
    lastAddElement: any;
    unsubscribe: Unsubscribe;

    constructor(props: CanvasProps) {
        super(props);

        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());
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

    writeFutureLayout() {
        if (this.canvas === undefined) {
            setTimeout(() => this.writeFutureLayout(), 1000);
            return;
        }

        let body = JSON.stringify({
            'data': this.canvas.toJSONWithKeys(),
            'display_positions': JSON.stringify(this.displays),
        });

        fetch(getAPIEndpoint() + '/layouts/' + getKeyFromURL() + '/', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => {
            setTimeout(() => this.writeFutureLayout(), 1000);
        });
    }

    renderCanvasFromLayoutData(layout: Models.Layout) {
        let layoutData = JSON.parse(layout.data);
        this.canvas.loadFromJSON(layoutData, () => {
            this.canvas.getObjects().map((object: any) => {
                // TODO - this is a jank way of reinitializing controls
                if (object.key) {
                    this.controls[object.key] = object;
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
            this.renderDisplayBoundaries(this.props.displays, JSON.parse(layout.display_positions));
        }
    }

    renderDisplayBoundaries(displays: Array<Models.Display>, displayPositions?: Map<String, Array<Number>>) {

        let offsetLeft = 0;
        for (let display of displays) {
            let rect = new fabric.Rect(),
                left = offsetLeft,
                top = 0;

            if (displayPositions) {
                left = displayPositions[display.key][0];
                top = displayPositions[display.key][1];
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

            this.displays[display.key] = [left, top];

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

        this.controls[message.control.key] = text;
        this.canvas.add(text);
    }

    controlUpdated(message: ControlUpdatedMessage) {
        if (this.controls[message.control.key] !== undefined) {
            this.controls[message.control.key].text = message.control.value;

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
            this.displays[object.key] = [object.left, object.top];
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
        this.canvas = new fabric.Canvas('overlay');

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

