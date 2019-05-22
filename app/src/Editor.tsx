import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";
import {Hitarea} from "./Hitarea";
import {Overlay} from "./Overlay";
import {Controls} from "./Controls";

export class Editor extends React.Component<{}, {}> {
    store: GlobalStore;

    constructor(props: {}) {
        super(props);

        this.store = CreateGlobalStore();
    }

    render() {
        return <div>
            <Hitarea />
            <Controls />
            <Overlay />
        </div>
    }
}