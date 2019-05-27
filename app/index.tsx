import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ControlsProvider} from './src/ControlsProvider';
import {Layouts} from './src/Layouts';
import {CreateGlobalStore} from './src/Store';

let store = CreateGlobalStore();

// Providers
new ControlsProvider(store);

let isViewOnly = window.location.href.indexOf('viewer') > -1;

ReactDOM.render(
    <Layouts store={store} viewOnly={isViewOnly}/>,
    document.getElementById('root')
);