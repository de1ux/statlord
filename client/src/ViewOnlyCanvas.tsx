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
            setTimeout(() => this.readFutureDisplayData(), 500);
            return;
        }

        fetch(getAPIEndpoint() + '/displays/' + this.props.display.key + '/')
            .then(data => data.json())
            .then((display: Models.Display) => {
                let pixels: Array<number> = [];
                for (let i = 0; i < display.display_data.length; i++) {
                    let code = display.display_data[i];
                    if (code === "0") {
                        pixels.push(255); // R
                        pixels.push(255); // G
                        pixels.push(255); // B
                    } else {
                        pixels.push(0); // R
                        pixels.push(0); // G
                        pixels.push(0); // B
                    }
                    pixels.push(255); // A
                }

                let pixelArray = new Uint8ClampedArray(pixels);
                let imgData = new ImageData(pixelArray, display.resolution_x, display.resolution_y);
                this.canvas.contextContainer.putImageData(
                    imgData,
                    0, 0, 0, 0, display.resolution_x, display.resolution_y);
                console.log('Rendered to canvas from display');

                setTimeout(() => this.readFutureDisplayData(), 500);
            });
    }

    componentDidMount(): void {
        this.canvas = new fabric.Canvas('overlay', {enableRetinaScaling: false});

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

