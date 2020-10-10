import {Models} from './Models';

export function getAPIEndpoint(): string {
    return "/api"
}

export interface TextValues {
    fontFamily: string;
    fontSize: number;
}

export function defaultTextProperties(): TextValues {
    return {
        fontFamily: "Arial",
        fontSize: 24,
    }
}

export function getKeyFromURL(): string | null {
    let url = new URL(window.location.href);
    return url.searchParams.get('key');
}

export function isWorker(): boolean {
    let url = new URL(window.location.href);
    return url.searchParams.get('worker') === "true";
}


export async function getLayout(key?: string): Promise<Models.Layout> {
    if (key === undefined || key === '') {
        key = getKeyFromURL();
        if (!key) {
            return Promise.reject("No key specified");
        }
    }

    return fetch(getAPIEndpoint() + "/layouts/" + key)
        .then(data => {
            if (data.status !== 200) {
                return Promise.reject("No layout");
            }
            return data.json();
        })
        .catch((e) => {
            return Promise.reject("No layout");
        });
}

export function getLargestDisplayDimension(displays: Array<Models.Display>): number {
        let height = 0,
            width = 0;

        for (let display of displays) {
            width += display.resolution_x;
            height += display.resolution_y;
        }

        return (width > height ? width : height) + 100;
    }