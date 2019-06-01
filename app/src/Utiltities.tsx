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

export function isEmpty(obj: any) {
    let hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}