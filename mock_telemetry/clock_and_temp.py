#!/usr/bin/env python
import time
import requests
from random import randint


def main():
    print("PUT'ing mock time gauge...")
    while True:
        req = requests.put("http://0.0.0.0:8000/api/gauges/mocktime/", json={
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