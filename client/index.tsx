import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ControlsProvider} from './src/ControlsProvider';
import {CreateGlobalStore} from './src/Store';
import {Editor} from "./src/Editor";
import {ModelsProvider} from "./src/ModelsProvider";
import {Home} from "./src/Home";
import {Provider} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

let store = CreateGlobalStore();

// Providers
new ControlsProvider(store);
new ModelsProvider(store);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/edit/:key" component={Editor}/>
                <Route path="/" component={Home}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);

/*
if (getKeyFromURL() === null) {
    ReactDOM.render(
        <Provider store={store}>
            <Home store={store}/>
        </Provider>,
        document.getElementById('root'));
} else {
    let viewDisplayKey: string | undefined = undefined;
    if (window.location.href.indexOf('viewer') > -1) {
        viewDisplayKey = getKeyFromURL()
    }

    getLayout().then((layout: Layout) => {
        ReactDOM.render(
            <Provider store={store}>
                <Editor store={store} layout={layout} viewDisplayKey={viewDisplayKey}/>
            </Provider>,
    })
}*/