import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor} from "./src/Editor";
import {Viewer} from "./src/Viewer";


const urlParams = new URLSearchParams(window.location.search);
const viewer = urlParams.get('viewer');
const displayName = urlParams.get('display');
if (displayName && viewer) {
    ReactDOM.render(
        <Viewer name={displayName}/>,
        document.getElementById('root')
    );
} else {
    ReactDOM.render(
        <Editor/>,
        document.getElementById('root')
    );
}

