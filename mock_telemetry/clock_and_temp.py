#!/usr/bin/env python
import time
from random import randint

import requests


def main():
    print("PUT'ing mock time gauge...")
    while True:
        ts = time.localtime()
        req = requests.put("http://0.0.0.0:8000/api/gauges/mocktime/", json={
            "value": time.strftime("%I:%M:%S %p", ts)
        })
        print(f"{req.status_code}: {req.text}")
        req = requests.put("http://0.0.0.0:8000/api/gauges/mocktimestamp/", json={
            "value": int(time.time())
        })
        print(f"{req.status_code}: {req.text}")
        req = requests.put("http://0.0.0.0:8000/api/gauges/mocktemp/", json={
            "value": randint(0, 100)
        })
        print(f"{req.status_code}: {req.text}")
        time.sleep(3)


if __name__ == "__main__":
    main()