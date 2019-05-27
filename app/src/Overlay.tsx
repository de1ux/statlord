import * as React from 'react';
import {CSSProperties} from 'react';
import {Unsubscribe} from 'redux';
import {Display, Gauge, Layout} from './Models';
import {SelectionControls} from './SelectionControls';
import {AddControlMessage, AddElementMessage, ControlUpdatedMessage, GlobalStore, State} from './Store';
import {defaultTextProperties, getAPIEndpoint, getLayout, getLayoutKeyFromURL} from './Utiltities';

declare var fabric: any;

interface Element {
    x: number;
    y: number;
    control: Gauge;
}

const overlayStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'gray'
};

interface OverlayProps {
    store: GlobalStore;
    display: Display;
    viewOnly: boolean;
}

interface OverlayState {
    layout?: Layout
    selectedControl?: Gauge;
    selectedObject?: any;
}

export class Overlay extends React.Component<OverlayProps, OverlayState> {
    controls: Map<String, any> = new Map();
    unsubscribe: Unsubscribe;
    canvas: any;

    lastAddControl: AddControlMessage;
    lastAddElement: AddElementMessage;


    constructor(props: OverlayProps) {
        super(props);
        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());

        if (this.props.viewOnly) {
            this.renderFutureLayout();
        } else {
            this.setFutureLayout();
        }

        this.state = {};
    }

    renderFutureLayout() {
        if (this.canvas === undefined) {
            setTimeout(() => this.renderFutureLayout(), 3000);
            return;
        }

        getLayout().then((layout: Layout) => {
            this.renderCanvasFromLayoutData(layout);
            setTimeout(() => this.renderFutureLayout(), 3000);
        }).catch((e) => {

        });
    }

    setFutureLayout() {
        if (this.canvas === undefined) {
            setTimeout(() => this.setFutureLayout(), 3000);
            return;
        }

        let body = JSON.stringify({'data': this.canvas.toJSONWithKeys()});

        fetch(getAPIEndpoint() + '/layouts/' + getLayoutKeyFromURL() + '/', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => {
            setTimeout(() => this.setFutureLayout(), 3000);
        });
    }

    onStoreTrigger = () => {
        let state: State = this.props.store.getState();
        if (state.addControl && this.lastAddControl !== state.addControl) {
            this.addControl(state.addControl);
            this.lastAddControl = state.addControl;
        }

        if (state.controlUpdated) {
            this.controlUpdated(state.controlUpdated);
        }

        if (state.addElement && this.lastAddElement !== state.addElement) {
            this.addElement(state.addElement);
            this.lastAddElement = state.addElement;
        }
    };

    addControl(message: AddControlMessage) {
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

    attachTextEventHandlers(object: any) {

        object.on('selected', () => {
            this.setState({
                selectedObject: object,
            });
        });
        object.on('deselected', () => {
            this.setState({
                selectedObject: undefined,
            });
        });
    }

    addElement(message: AddElementMessage) {
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

    controlUpdated(message: ControlUpdatedMessage) {
        if (this.controls[message.control.key] !== undefined) {
            this.controls[message.control.key].text = message.control.value;

            this.renderCanvas();
        }
    }

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

        getLayout().then((layout) => {
            this.renderCanvasFromLayoutData(layout);
        });
    }

    renderCanvasFromLayoutData(layout: Layout) {
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

    componentWillUnmount(): void {
        this.unsubscribe();
    }

    renderCanvas = () => {
        if (!this.canvas) {
            return;
        }
        this.canvas.renderAll();
    };

    render() {
        return <div style={{display: 'flex'}}>
            <div>
                <canvas id="overlay" width={`${this.props.display.resolution_x}px`}
                        height={`${this.props.display.resolution_y}px`} style={{border: '1px solid #aaa'}}>
                </canvas>
            </div>
            <div>
                {this.props.viewOnly ? <div/> : <SelectionControls object={this.state.selectedObject}
                                                                   renderAll={this.renderCanvas}
                                                                   delete={() => this.canvas.remove(this.canvas.getActiveObject())}/>}
            </div>
        </div>;
    }
}