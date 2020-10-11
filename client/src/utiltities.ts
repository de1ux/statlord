import {Display, Layout} from "./models";

export interface TextValues {
    fontFamily: string;
    fontSize: number;
}

export const defaultTextProperties: TextValues = {
    fontFamily: "Arial",
    fontSize: 24,
};

export function getKeyFromURL(): string | null {
    let url = new URL(window.location.href);
    return url.searchParams.get('key');
}

export function getLargestDisplayDimension(displays: Array<Display>): number {
    let height = 0,
        width = 0;

    for (let display of displays) {
        width += display.resolution_x;
        height += display.resolution_y;
    }

    return (width > height ? width : height) + 100;
}

// serializeImageDataToBW returns a string of bits indicating black and white
export function serializeImageDataToBW(imageData: ImageData, display: Display): string {
    return normal(imageData, display);
}

function normal(imageData: ImageData, display: Display): string {
    let pixels = '';
    let i = -1;
    for (let pixel of imageData.data) {
        i++;

        // RGBA
        if (i % 4 !== 0) {
            continue;
        }

        if (pixel < 10) {
            pixels += '0';
        } else {
            pixels += '1';
        }
    }
    return pixels;
}

function fill(imageData: ImageData, display: Display) {
    let pixels = '';
    let i = -1;
    for (let pixel of imageData.data) {
        i++;

        // RGBA
        if (i % 4 !== 0) {
            continue;
        }

        pixels += '1';
    }
    return pixels;
}

function rotate(imageData: ImageData, display: Display): string {
    let pixels = normal(imageData, display);
    let rows = [];
    let x = 0;
    for (let i = 0; i < display.resolution_y; i++) {
        rows.push(pixels.substr(x, display.resolution_x));
        x += display.resolution_x;
    }

    let transfom = '';
    for (let i = 0; i < display.resolution_x; i++) {
        for (let row of rows) {
            transfom += row[i];
        }
    }
    return transfom;
}