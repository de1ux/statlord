# statlord

[![Build Status](https://travis-ci.org/de1ux/statlord.svg?branch=master)](https://travis-ci.org/de1ux/statlord)

> Display realtime data on spare OLEDs, e-paper, LCDs, and browsers

![demo](docs/demo.gif)

## Getting started

Install dependencies
```
$ pip install -r requirements.txt
$ ./erase_and_reset.sh

$ cd app && npm i
```

Run backend
```
$ ./manage.py runserver 0.0.0.0:8000
```

Run frontend
```bash
$ cd app && npm run dev
```

Visit the [wizard](http://0.0.0.0:8000/editor/)

## Usage (browser)

Post some data to the API

```bash
$ curl -XPUT -d '{"value": "79F"}' -H "Content-Type: application/json" http://0.0.0.0:8000/api/gauges/temperature/
```

Open the editor [http://0.0.0.0:8000/editor/](http://0.0.0.0:8000/editor/) and follow the wizard.

## Usage (other displays)

Register displays in the API with a unique name and its resolution

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

