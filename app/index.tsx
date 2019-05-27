import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ControlsProvider} from './src/ControlsProvider';
import {Editor} from './src/Editor';
import {CreateGlobalStore} from './src/Store';
import {Viewer} from './src/Viewer';

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

