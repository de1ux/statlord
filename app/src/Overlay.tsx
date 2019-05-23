import * as React from "react";
import {ControlDroppedMessage, ControlUpdatedMessage, CreateGlobalStore, GlobalStore, State} from "./Store";
import {Unsubscribe} from "redux";
import {CSSProperties, RefObject} from "react";
import {Gauge} from "./Models";

interface Element {
    x: number;
    y: number;
    control: Gauge;
}

const overlayCanvasStyle = {
    height: "500px",
    width: "500px",
};

const overlayStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1,
};

interface OverlayProps {
    store: GlobalStore;
}

export class Overlay extends React.Component<OverlayProps, {}> {
    elements: Map<String, Element> = new Map();
    unsubscribe: Unsubscribe;
    canvasRef: RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;

    lastControlDropped: ControlDroppedMessage;

    constructor(props: OverlayProps) {
        super(props);
        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());
        this.canvasRef = React.createRef<HTMLCanvasElement>()
    }

    onStoreTrigger = () => {
        let state: State = this.props.store.getState();
        if (state.controlDropped && this.lastControlDropped !== state.controlDropped) {
            this.controlDropped(state.controlDropped);
            this.lastControlDropped = state.controlDropped;
        }

        if (state.controlUpdated) {
            this.controlUpdated(state.controlUpdated);
        }
    };

    controlUpdated(message: ControlUpdatedMessage) {
        if (!this.elements[message.control.key]) {
            return
        }

        this.elements[message.control.key].control = message.control;
        this.draw()
    }

    // controlDropped occurs when a control is dropped onto the overlay
    controlDropped(message: ControlDroppedMessage) {
        this.elements[message.control.key] = {
            x: message.x,
            y: message.y,
            control: message.control,
        };

        this.draw();
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 500, 500);

        Object.values(this.elements).map((el: Element) => {
            this.ctx.fillText(el.control.value, el.x, el.y);
        });

        this.ctx.fillText("hi", 10, 10);
        this.ctx.stroke();
    };

    componentDidMount(): void {
        this.ctx = this.canvasRef.current.getContext('2d');
    }

    componentWillUnmount(): void {
        this.unsubscribe()
    }

    render() {
        return <div style={overlayStyle}>
            <canvas {...overlayCanvasStyle} ref={this.canvasRef}>
            </canvas>
        </div>
    }
}