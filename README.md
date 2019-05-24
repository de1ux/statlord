# statlord

> Display realtime data on spare OLEDs, e-paper, LCDs, and even browser windows

## Getting started

Install dependencies
```
$ pip install -r requirements.txt
$ ./erase_and_reset.sh

$ cd app && npm i
```

Run backend
```
$ ./manage.py runserver 8000
```

Run frontend
```bash
$ cd app && npm run dev
``` 

## Usage (browser)

Post some data to the API

```bash
$ curl -XPUT -d '{"value": "79F"}' -H "Content-Type: application/json" http://0.0.0.0:8000/api/gauges/temperature/
```

Open a couple browser windows (keep them open!)

* [http://0.0.0.0:3000/?viewer=true&key=display1](http://0.0.0.0:3000/?viewer=true&key=display1)
* [http://0.0.0.0:3000/?viewer=true&key=display2](http://0.0.0.0:3000/?viewer=true&key=display2)

Open the editor [http://0.0.0.0:3000](http://0.0.0.0:3000/), and drag and drop the "temperature" gauge onto the displays.

Changes to the "temperature" guage will be reflected in the two browser windows. Try changing the "temperature" value:

```bash
$ curl -XPUT \
    -d '{"value": "60F"}' \
    -H "Content-Type: application/json" \
    http://0.0.0.0:8000/api/gauges/temperature/
```

## Usage (other displays)

Subscribe your other displays to the API with a unique name and the resolution

```bash
$ curl -XPUT \
    -d '{"resolution_x": 212, "resolution_y": 104}' \
    -H "Content-Type: application/json" \
    http://0.0.0.0:8000/api/displays/inkyphat-and-raspberry-pi-zero/
    
{"available":true,"resolution_x":212,"resolution_y":104,"current_layout":null}
    
$ curl -XPUT \
    -d '{"resolution_x": 800, "resolution_y": 480}' \
    -H "Content-Type: application/json" \
    http://0.0.0.0:8000/api/displays/hyperpixel-and-raspberry-pi/
    
{"available":true,"resolution_x":800,"resolution_y":480,"current_layout":null}
```

Open the editor [http://0.0.0.0:3000](http://0.0.0.0:3000/), and drag and drop the "temperature" gauge onto the displays.

