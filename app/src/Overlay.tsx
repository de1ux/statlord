import * as React from "react";
import {
    AddControlMessage, AddElementMessage,
    ControlUpdatedMessage,
    CreateGlobalStore,
    GlobalStore,
    State
} from "./Store";
import {Unsubscribe} from "redux";
import {CSSProperties, RefObject} from "react";
import {Display, Gauge} from "./Models";
import {SelectionControls} from "./SelectionControls";
import {defaultTextProperties} from "./Utiltities";

declare var fabric: any;

interface Element {
    x: number;
    y: number;
    control: Gauge;
}

const overlayStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: "gray"
};

interface OverlayProps {
    store: GlobalStore;
    display: Display;
}

interface OverlayState {
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

        this.state = {};
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
        };

        let text = new fabric.Text(message.control.value, textProperties);

        text.on('selected', () => {
            this.setState({
                selectedControl: message.control,
                selectedObject: text,
            })
        });
        text.on('deselected', () => {
            this.setState({
                selectedControl: undefined,
                selectedObject: undefined,
            })
        });
        text.on('keypress', () => {console.log('asdf')})

        this.controls[message.control.key] = text;
        this.canvas.add(text);
    }

    addElement(message: AddElementMessage) {
        if (this.canvas === undefined) {
            return;
        }

        switch (message.element) {
            case "itext":
                let textProperties = {
                    ...defaultTextProperties(),
                    left: 10,
                    top: 10,
                };

                let text = new fabric.IText("Text", textProperties);
                text.on('selected', () => {
                    this.setState({
                        selectedControl: undefined,
                        selectedObject: text,
                    })
                });
                text.on('deselected', () => {
                    this.setState({
                        selectedControl: undefined,
                        selectedObject: undefined,
                    })
                });
                this.canvas.add(text);
                return;
            default:
                alert(`Unrecognized element: ${message.element}`)
        }
    }

    controlUpdated(message: ControlUpdatedMessage) {
        if (this.controls[message.control.key] !== undefined) {
            this.controls[message.control.key].text = message.control.value;

            this.renderCanvas();
        }
    }

    componentDidMount(): void {
        this.canvas = new fabric.Canvas("overlay");
    }

    componentWillUnmount(): void {
        this.unsubscribe()
    }

    renderCanvas = () => {
        if (!this.canvas) {
            return;
        }
        this.canvas.renderAll();
    }

    render() {
        return <div style={{display: "flex"}}>
            <div>
                <canvas id="overlay" width={`${this.props.display.resolution_x}px`}
                        height={`${this.props.display.resolution_y}px`} style={{border: "1px solid #aaa"}}>
                </canvas>
            </div>
            <div>
                <SelectionControls object={this.state.selectedObject} selected={this.state.selectedControl}
                                   renderAll={this.renderCanvas} delete={() => this.canvas.remove(this.canvas.getActiveObject())}/>
            </div>
        </div>
    }
}