import json
import pytz
import time
import requests
import datetime
from PIL import Image, ImageFont, ImageDraw
import numpy as np
from inky import InkyPHAT, InkyWHAT
from font_hanken_grotesk import HankenGroteskBold

colour = 'red'  # black, yellow
inky_display = InkyPHAT(colour)

scale_size = 1
padding = 0

inky_display.set_border(inky_display.RED)

while True:
    res = requests.get("http://192.168.1.41:8000/api/displays/inky/")
    print("Loading json...")
    outer = json.loads(res.content)
    inner = json.loads(outer['display_data'])
    print("Loading json...done")

    img = Image.open("background.png")

    print("Writing...")

    for y in range(0, 104):
        for x in range(0, 212):
            code = inner.pop(0)
            if code:
                img.putpixel((x, y), inky_display.BLACK)
            else:
                img.putpixel((x, y), inky_display.WHITE)
    print("Writing...done")

    print("Displaying img...")
    inky_display.set_image(img)
    inky_display.show()
    print("Displaying img...done")