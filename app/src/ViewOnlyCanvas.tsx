import * as React from 'react';
import {Unsubscribe} from 'redux';
import {Models} from './Models';
import {GlobalStore, State} from './Store';
import {getAPIEndpoint} from './Utiltities';

declare var fabric: any;

interface ViewOnlyCanvasProps {
    display: Models.Display
    store: GlobalStore;
}

interface ViewOnlyCanvasState {
    largestDimension: number;
}

export class ViewOnlyCanvas extends React.Component<ViewOnlyCanvasProps, ViewOnlyCanvasState> {
    canvas: any;

    constructor(props: ViewOnlyCanvasProps) {
        super(props);

        this.readFutureDisplayData();
    }

    async readFutureDisplayData() {
        if (this.canvas === undefined) {
            setTimeout(() => this.readFutureDisplayData(), 1000);
            return;
        }

        fetch(getAPIEndpoint() + '/displays/' + this.props.display.key + '/')
            .then(data => data.json())
            .then((display: Models.Display) => {
                let parsed = JSON.parse(display.display_data);
                let pixels: Array<number> = [];
                for (let i in parsed) {
                    pixels.push(parsed[i] as number);
                }

                let pixelArray = new Uint8ClampedArray(pixels);
                let imgData = new ImageData(pixelArray, display.resolution_x, display.resolution_y);
                this.canvas.contextContainer.putImageData(
                    imgData,
                    0, 0, 0, 0, display.resolution_x, display.resolution_y);
                console.log("Rendered to canvas from display");

                setTimeout(() => this.readFutureDisplayData(), 3000);
            });
    }

    componentDidMount(): void {
        this.canvas = new fabric.Canvas('overlay');

    }

    render() {
        console.log('rendering read only');
        return <canvas id="overlay"
                       width={`${this.props.display.resolution_x}px`}
                       height={`${this.props.display.resolution_y}px`}
                       style={{border: '1px solid #aaa'}}>
        </canvas>;
    }
}

