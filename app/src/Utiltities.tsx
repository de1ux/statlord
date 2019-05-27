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

export function getLayoutKeyFromURL(): string | null {
    let url = new URL(window.location.href);
    return url.searchParams.get('layout');
}

export async function getLayout(key?: string): Promise<Models.Layout> {
    if (key === undefined || key === '') {
        key = getLayoutKeyFromURL();
        if (!key) {
            return Promise.reject("No layout key specified");
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