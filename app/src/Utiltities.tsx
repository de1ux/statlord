import {Layout} from "./Models";

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

export async function getLayout(): Promise<Layout> {
    let url = new URL(window.location.href);
    let layout = url.searchParams.get('layout');
    if (!layout) {
        return Promise.resolve(undefined);
    }
    return fetch(getAPIEndpoint() + "/layouts/" + layout)
        .then(data => {
            if (data.status !== 200) {
                return Promise.resolve(undefined);
            }
            return data.json();
        })
        .catch((e) => {
            return Promise.resolve(undefined);
        });
}