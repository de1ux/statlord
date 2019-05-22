import * as React from "react";
import {CreateGlobalStore, GlobalStore} from "./Store";
import {getAPIEndpoint} from "./Utiltities";

interface Guage {
    pk: string;
    key: string;
    value: string;
}

interface ControlsState {
    guages: Array<Guage>;
}

export class Controls extends React.Component<{}, ControlsState> {
    state: ControlsState = {
        guages: [],
    };

    componentDidMount(): void {
        fetch(getAPIEndpoint() + "/guages")
            .then(data => data.json())
            .then((data) => {
                this.setState({
                    guages: data.map((d: any) => {
                        return {
                            pk: d.pk,
                            key: d.fields.key,
                            value: d.fields.value
                        };
                    })
                });
            })
    }

    renderControls() {
        return this.state.guages.map((guage: Guage) =>
            <div draggable style={{cursor: 'move'}}>
                {JSON.stringify(guage)}
            </div>
        );
    }

    render() {
        return <div>
            {this.renderControls()}
        </div>
    }
}