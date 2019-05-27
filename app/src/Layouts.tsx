import * as React from 'react';
import {Controls} from './Controls';
import {DisplayEditor} from './DisplayEditor';
import {Models} from './Models';
import {SetupWizard} from './SetupWizard';
import {GlobalStore} from './Store';
import {getAPIEndpoint, getLayoutKeyFromURL} from './Utiltities';


interface EditorProps {
    store: GlobalStore;
    viewOnly: boolean;
}

interface EditorState {
    displays: Array<Models.Display>
}

export class Layouts extends React.Component<EditorProps, EditorState> {
    state: EditorState = {
        displays: [],
    };

    constructor(props: EditorProps) {
        super(props);
    }

    componentDidMount(): void {
        this.setFutureDisplaysRefresh();
    }

    setFutureDisplaysRefresh() {
        fetch(getAPIEndpoint() + '/displays/')
            .then(data => data.json())
            .then((displays) => {
                this.setState({
                    displays: displays
                });

                setTimeout(() => this.setFutureDisplaysRefresh(), 3000);
            });
    }

    mapDisplaysToOverlays = () => {
        let overlays = [];
        for (let display of this.state.displays) {
            overlays.push(
                <DisplayEditor store={this.props.store} display={display} viewOnly={this.props.viewOnly}/>
            );
        }
        return overlays;
    };

    render() {
        if (getLayoutKeyFromURL() === null) {
            return <SetupWizard/>;
        }

        return <div>
            {this.props.viewOnly ? <div /> : <Controls store={this.props.store}/>}
            {this.mapDisplaysToOverlays()}
        </div>;
    }
}