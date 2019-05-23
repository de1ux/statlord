#!/usr/bin/env python
import time

import requests


def main():
    print("PUT'ing mock time gauge...")
    while True:
        req = requests.put("http://0.0.0.0:8000/api/gauges/mocktime/", json={
            "key": "mocktime",
            "value": int(time.time())
        })
        print(f"{req.status_code}: {req.text}")
        time.sleep(3)


if __name__ == "__main__":
    main()