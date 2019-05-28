import * as React from "react";
import {Models} from "./Models";
import {
    ControlAddedMessage,
    ControlUpdatedMessage, ElementAddedMessage,
    GlobalStore,
    RequestCanvasRenderMessage,
    State,
    UPDATE_SELECTED_OBJECT
} from "./Store";
import {defaultTextProperties, getAPIEndpoint, getKeyFromURL} from "./Utiltities";
import {Unsubscribe} from "redux";

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
    lastRerender: RequestCanvasRenderMessage;
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

        if (state.controlUpdated && this.lastControlUpdated !== state.controlUpdated) {
            this.lastControlUpdated = state.controlUpdated;
            this.controlUpdated(state.controlUpdated);
        }

        if (state.elementAdded && this.lastAddElement !== state.elementAdded) {
            this.addElement(state.elementAdded);
            this.lastAddElement = state.elementAdded;
        }

        if (state.controlAdded && this.lastAddControl !== state.controlAdded) {
            this.addControl(state.controlAdded);
            this.lastAddControl = state.controlAdded;
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
            setTimeout(() => this.writeFutureLayout(), 3000);
            return;
        }

        let body = JSON.stringify({'data': this.canvas.toJSONWithKeys()});

        fetch(getAPIEndpoint() + '/layouts/' + getKeyFromURL() + '/', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => {
            setTimeout(() => this.writeFutureLayout(), 3000);
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

            });
            this.canvas.renderAll();
        });
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
            })
        });
        object.on('deselected', () => {
            this.props.store.dispatch({
                type: UPDATE_SELECTED_OBJECT,
                updateSelectedObject: {
                    object: undefined,
                },
            })
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
        </canvas>
    }
}

