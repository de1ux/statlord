import {GlobalStore, SET_DISPLAYS, SET_GAUGES, SET_LAYOUTS} from './Store';
import {getAPIEndpoint} from './Utiltities';
import {Models} from "./Models";

export class ModelsProvider {
    private store: GlobalStore;
    private alive: boolean;

    constructor(store: GlobalStore) {
        this.store = store;
        this.alive = true;
    }

    fetchModels(): void {
        Promise.all([
            fetch(getAPIEndpoint() + '/layouts/')
                .then(data => data.json())
                .then((layouts: Array<Models.Layout>) => {
                    this.store.dispatch({
                        type: SET_LAYOUTS,
                        setLayouts: layouts,
                    })
                }),
            fetch(getAPIEndpoint() + '/displays/')
                .then(data => data.json())
                .then((displays: Array<Models.Display>) => {
                    this.store.dispatch({
                        type: SET_DISPLAYS,
                        setDisplays: displays,
                    })
                }),
            fetch(getAPIEndpoint() + '/gauges/')
                .then(data => data.json())
                .then((gauges: Array<Models.Gauge>) => {
                    this.store.dispatch({
                        type: SET_GAUGES,
                        setGauges: gauges,
                    })
                })])
            .then(() => {
                if (this.alive) {
                    setTimeout(() => this.fetchModels(), 3000)
                }
            })
    }

    destroy() {
        this.alive = false;
    }
}