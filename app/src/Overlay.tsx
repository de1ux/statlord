import * as React from "react";
import {ControlDroppedMessage, ControlUpdatedMessage, CreateGlobalStore, GlobalStore, State} from "./Store";
import {Unsubscribe} from "redux";
import {CSSProperties, RefObject} from "react";
import {Display, Gauge} from "./Models";
import {Hitarea} from "./Hitarea";

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
        this.ctx.fillStyle = 'black';
        this.ctx.font = '24px sans-serif';

        Object.values(this.elements).map((el: Element) => {
            this.ctx.fillText(el.control.value, el.x, el.y);
        });

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
            <Hitarea store={this.props.store} display={this.props.display}/>
            <canvas width={`${this.props.display.resolution_x}px`} height={`${this.props.display.resolution_y}px`}
                    ref={this.canvasRef}>
            </canvas>
        </div>
    }
}