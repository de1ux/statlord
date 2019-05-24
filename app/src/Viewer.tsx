import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";

const editorStyle = {
    height: "500px",
    width: "500px",
    backgroundColor: "gray"
};


interface ViewerProps {
    name: string
}

export class Viewer extends React.Component<ViewerProps, {}> {
    store: GlobalStore;

    constructor(props: ViewerProps) {
        super(props);

        this.store = CreateGlobalStore();
    }

    render() {
        return <div>
        </div>
    }
}