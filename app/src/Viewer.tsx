import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";
import {Hitarea} from "./Hitarea";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";


const editorStyle = {
    height: "500px",
    width: "500px",
    backgroundColor: "gray"
};

export class Viewer extends React.Component<{}, {}> {
    store: GlobalStore;

    constructor(props: {}) {
        super(props);

        this.store = CreateGlobalStore();
    }

    render() {
        return <div>
        </div>
    }
}