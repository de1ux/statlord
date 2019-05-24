import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor} from "./src/Editor";
import {Viewer} from "./src/Viewer";

if (window.location.search.indexOf("viewer=true") === -1) {
    ReactDOM.render(
        <Editor/>,
        document.getElementById('root')
    );
} else {
    ReactDOM.render(
        <Viewer />,
        document.getElementById('root')
    );
}

