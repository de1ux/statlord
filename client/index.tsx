import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CreateGlobalStore} from './src/store';
import {Editor} from "./src/components/Editor";
import {Home} from "./src/components/Home";
import {Provider} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Viewer} from "./src/components/Viewer";

let store = CreateGlobalStore();

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/edit/:layoutKey" component={Editor}/>
                <Route path="/view/:displayKey" component={Viewer}/>
                <Route path="/" component={Home}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);
