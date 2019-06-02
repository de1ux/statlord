import json
import requests
from PIL import Image
from inky import InkyPHAT

inky_display = InkyPHAT('red')

while True:
    res = requests.get("http://192.168.1.41:8000/api/displays/inky/")
    print("Loading json...")
    outer = json.loads(res.content)
    display_data = outer['display_data']
    print("Loading json...done")

    img = Image.open("background.png")

    print("Writing...")
    i = -1
    for y in range(0, 104):
        for x in range(0, 212):
            i += 1
            code = display_data[i]
            if code == "0":
                img.putpixel((x, y), inky_display.BLACK)
            else:
                img.putpixel((x, y), inky_display.WHITE)
    print("Writing...done")

    print("Displaying img...")
    inky_display.set_image(img)
    inky_display.show()
    print("Displaying img...done")