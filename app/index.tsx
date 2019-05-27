import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor} from "./src/Editor";
import {Viewer} from "./src/Viewer";
import {ControlsProvider} from "./src/ControlsProvider";
import {CreateGlobalStore} from "./src/Store";

let store = CreateGlobalStore();

// Providers
new ControlsProvider(store);

if (window.location.href.indexOf("viewer") === -1) {
    ReactDOM.render(
        <Editor store={store}/>,
        document.getElementById('root')
    );
} else {
    ReactDOM.render(
        <Viewer store={store}/>,
        document.getElementById('root')
    );
}

