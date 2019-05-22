import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";
import {CSSProperties} from "react";

const hitareaStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%"
};

export class Hitarea extends React.Component<{}, {}> {
    onMouseUp = (e) => {
        console.log("yes");
    };

    render() {
        return <div onMouseUp={this.onMouseUp} style={hitareaStyle}>
            Hitarea
        </div>
    }
}