import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ControlsProvider} from './src/ControlsProvider';
import {CreateGlobalStore} from './src/Store';
import {getKeyFromURL, getLayout} from "./src/Utiltities";
import {SetupWizard} from "./src/SetupWizard";
import {Editor} from "./src/Editor";
import {Models} from "./src/Models";
import {ModelsProvider} from "./src/ModelsProvider";

let store = CreateGlobalStore();

// Providers
new ControlsProvider(store);
new ModelsProvider(store);

if (getKeyFromURL() === null) {
    ReactDOM.render(<SetupWizard />,  document.getElementById('root'));
} else {
    let isViewOnly = window.location.href.indexOf('viewer') > -1;

    getLayout().then((layout: Models.Layout) => {
        ReactDOM.render(
            <Editor store={store} layout={layout} viewOnly={isViewOnly}/>,
            document.getElementById('root')
        );
    });


}
