// serializeImageDataToBW returns a string of bits indicating black and white
export function serializeImageDataToBW(imageData: ImageData): string {
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