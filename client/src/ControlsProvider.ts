import {CONTROL_UPDATED, GlobalStore} from './Store';
import {getAPIEndpoint} from './Utiltities';

export class ControlsProvider {
    private store: GlobalStore;
    private alive: boolean;

    constructor(store: GlobalStore) {
        this.store = store;
        this.alive = true;
    }

    setFutureGaugesRefresh(): void {
        fetch(getAPIEndpoint() + "/gauges/")
            .then(data => data.json())
            .then((data) => {
                for (let gauge of data) {
                    this.store.dispatch({
                        type: CONTROL_UPDATED,
                        controlUpdated: {
                            control: gauge,
                        },
                    })
                }

                if (this.alive) {
                    setTimeout(() => this.setFutureGaugesRefresh(), 3000);
                }
            })
    }

    destroy() {
        this.alive = false;
    }
}