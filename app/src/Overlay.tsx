import * as React from "react";
import {ControlDroppedMessage, CreateGlobalStore, GlobalStore, State} from "./Store";
import {Unsubscribe} from "redux";
import {CSSProperties, RefObject} from "react";
import {Gauge} from "./Controls";

interface Element {
    x: number;
    y: number;
    control: any;
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
    elements: Array<Element> = [];
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
    };

    controlDropped(message: ControlDroppedMessage) {
        this.elements.push({
            x: message.x,
            y: message.y,
            control: message.control,
        });

        this.draw();
    };

    draw = () => {
        this.ctx.clearRect(0, 0, 500, 500);
        for (let el of this.elements) {
            this.ctx.fillText((el.control as Gauge).value, el.x, el.y);
        }
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