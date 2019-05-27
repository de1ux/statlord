import * as React from 'react';
import {CreateGlobalStore, GlobalStore} from './Store';


const editorStyle = {
    height: "500px",
    width: "500px",
    backgroundColor: "gray"
};

export class Debugger extends React.Component<{}, {}> {
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