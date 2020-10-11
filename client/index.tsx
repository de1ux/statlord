import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ControlsProvider} from './src/ControlsProvider';
import {CreateGlobalStore} from './src/Store';
import {getKeyFromURL, getLayout} from "./src/Utiltities";
import {SetupWizard} from "./src/SetupWizard";
import {Editor} from "./src/Editor";
import {ModelsProvider} from "./src/ModelsProvider";
import {Home} from "./src/Home";
import {Layout} from "./src/Models";

let store = CreateGlobalStore();

// Providers
new ControlsProvider(store);
new ModelsProvider(store);

if (getKeyFromURL() === null) {
    ReactDOM.render(<Home store={store}/>, document.getElementById('root'));
} else {
    let viewDisplayKey: string | undefined = undefined;
    if (window.location.href.indexOf('viewer') > -1) {
        viewDisplayKey = getKeyFromURL()
    }

    getLayout().then((layout: Layout) => {
        ReactDOM.render(
            <Editor store={store} layout={layout} viewDisplayKey={viewDisplayKey}/>,
            document.getElementById('root')
        );
    }).catch((e) => {
        ReactDOM.render(
            <Editor store={store} layout={undefined} viewDisplayKey={viewDisplayKey}/>,
            document.getElementById('root')
        );
    })
}
