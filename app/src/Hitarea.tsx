import * as React from "react";
import {CONTROL_DROPPED, CreateGlobalStore, GlobalStore, State} from "./Store";
import {CSSProperties} from "react";
import {Unsubscribe} from "redux";
import {Gauge} from "./Models";

const hitareaStyle: CSSProperties = {
    position: "absolute",
    width: "500px",
    height: "500px",
    zIndex: 2
};

interface HitareaProps {
    store: GlobalStore
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

    onMouseUp = (e: React.MouseEvent) => {
        if (this.stagedControl === null) {
            return;
        }
        this.props.store.dispatch({
            type: CONTROL_DROPPED,
            controlDropped: {
                x: e.clientX,
                y: e.clientY,
                control: this.stagedControl,
            },
        });
        this.stagedControl = null;
    };

    render() {
        return <div onMouseUp={this.onMouseUp} style={hitareaStyle}>
            Hitarea
        </div>
    }
}