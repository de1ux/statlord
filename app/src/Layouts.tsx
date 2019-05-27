import * as React from 'react';
import {Controls} from './Controls';
import {Layout} from './Layout';
import {Models} from './Models';
import {GlobalStore} from './Store';
import {getAPIEndpoint} from './Utiltities';


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
                <Layout store={this.props.store} display={display} viewOnly={this.props.viewOnly}/>
            );
        }
        return overlays;
    };

    render() {

        return <div>
            <Controls store={this.props.store}/>
            {this.mapDisplaysToOverlays()}
        </div>;
    }
}