import * as React from "react";
import {
    CONTROL_DROPPED,
    CONTROL_SELECTED,
    CreateGlobalStore,
    GlobalStore,
    LOCATE_OVERLAY_CONTROL,
    State
} from "./Store";
import {CSSProperties} from "react";
import {Unsubscribe} from "redux";
import {Display, Gauge} from "./Models";

let hitareaStyle = (display: Display): CSSProperties => {
    return {
        width: `${display.resolution_x}px`,
        height: `${display.resolution_y}px`,
        position: "absolute",
        zIndex: 2,
    };
};

interface HitareaProps {
    store: GlobalStore
    display: Display
}

export class Hitarea extends React.Component<HitareaProps, {}> {
    stagedControl: Gauge;
    unsubscribe: Unsubscribe;

    constructor(props: HitareaProps) {
        super(props);
        this.unsubscribe = this.props.store.subscribe(() => this.onStoreTrigger());
    }

    componentWillUnmount(): void {
        this.unsubscribe()
    }

    onStoreTrigger = () => {
        let state: State = this.props.store.getState();
        if (state.controlSelected) {
            this.stagedControl = state.controlSelected.control;
        }

    };

    onMouseDown = (e: React.MouseEvent) => {
        let rects = (e.target as HTMLElement).getBoundingClientRect();

        // normalize to canvas position
        let x = e.clientX - rects.left,
            y = e.clientY - rects.top;

        this.props.store.dispatch({
            type: LOCATE_OVERLAY_CONTROL,
            locateOverlayControl: {
                x: x,
                y: y,
            }
        })
    };

    onMouseUp = (e: React.MouseEvent) => {
        if (this.stagedControl === null) {
            return;
        }

        let rects = (e.target as HTMLElement).getBoundingClientRect();

        // normalize to canvas position
        let x = e.clientX - rects.left,
            y = e.clientY - rects.top;


        console.log('hi');

        this.props.store.dispatch({
            type: CONTROL_DROPPED,
            controlDropped: {
                x: x,
                y: y,
                control: this.stagedControl,
            },
        });
        this.props.store.dispatch({
            type: CONTROL_SELECTED,
            controlSelected: {
                control: null,
            },
        });
        this.stagedControl = null;
    };

    render() {
        return <div onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown} style={hitareaStyle(this.props.display)} />
    }
}