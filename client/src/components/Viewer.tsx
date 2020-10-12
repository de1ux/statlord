import * as React from 'react';
import {GlobalStore, ResourceState, State} from '../store';
import {Display} from "../models";
import api, {getAPIEndpoint} from "../api";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {useEffect} from "react";

declare var fabric: any;

const readFutureDisplayData = async (canvas: any, display: Display) => {
    fetch(getAPIEndpoint() + '/displays/' + display.key + '/')
        .then(data => data.json())
        .then((display: Display) => {
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
            canvas.contextContainer.putImageData(
                imgData,
                0, 0, 0, 0, display.resolution_x, display.resolution_y);

            setTimeout(() => readFutureDisplayData(canvas, display), 1000);
        });
};


export const Viewer = () => {
    const dispatch = useDispatch();
    let {displayKey} = useParams();

    const [canvas, setCanvas] = useState();
    const [refreshData, setRefreshData] = useState<boolean>(false);

    useEffect(() => {
        if (displays.state !== 'success') {
            // only attach fabricjs once the canvas is rendered
            return
        }
        if (canvas) {
            // already attached, skip
            return;
        }

        const newCanvas = new fabric.Canvas('overlay', {enableRetinaScaling: false});
        setCanvas(newCanvas);
    });

    const displays = useSelector<State, ResourceState<Array<Display>>>(
        state => state.displays
    );

    useEffect(() => {
        if (!canvas) {
            // canvas not ready, wait for it to attach
            return
        }

        // display ready and refresh cycle not started
        if (displays.state === 'success' && !refreshData) {
            const display = displays.data.find((display) => display.key === displayKey);

            readFutureDisplayData(canvas, display);
            setRefreshData(true);
        }
    }, [canvas, displays]);

    switch (displays.state) {
        case "init":
            api.fetchDisplays(dispatch);
            return <p>Loading...</p>;
        case "loading":
            return <p>Loading...</p>;
        case "failed":
            return <p>Failed: {displays.reason}</p>;
    }

    const display = displays.data.find((display) => display.key === displayKey);
    return <canvas id="overlay"
                   width={`${display.resolution_x}px`}
                   height={`${display.resolution_y}px`}
                   style={{border: '1px solid #aaa'}}>
    </canvas>;
};

