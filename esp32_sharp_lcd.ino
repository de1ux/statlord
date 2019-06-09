#include <ArduinoJson.h>
#include <WiFi.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SharpMem.h>

// any pins can be used
#define SHARP_SCK  18
#define SHARP_MOSI 23
#define SHARP_SS   5

// Set the size of the display here, e.g. 144x168!
Adafruit_SharpMem display(SHARP_SCK, SHARP_MOSI, SHARP_SS, 144, 168);
// The currently-available SHARP Memory Display (144x168 pixels)
// requires > 4K of microcontroller RAM; it WILL NOT WORK on Arduino Uno
// or other <4K "classic" devices!  The original display (96x96 pixels)
// does work there, but is no longer produced.

#define BLACK 0
#define WHITE 1

const char* ssid     = "ssid";
const char* password = "password";

const char* host = path/to/statlord;
const char* streamId   = "....................";
const char* privateKey = "....................";

void setup()
{
    Serial.begin(115200);
    delay(10);

    // We start by connecting to a WiFi network

    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    display.begin();
}

int value = 0;

void loop()
{
    delay(1000);
    ++value;

    Serial.print("connecting to ");
    Serial.println(host);

    // Use WiFiClient class to create TCP connections
    WiFiClient client;
    const int httpPort = 8000;
    if (!client.connect(host, httpPort)) {
        Serial.println("connection failed");
        return;
    }

    // We now create a URI for the request
    String url = "/api/displays/sharp-display/";

    Serial.print("Requesting URL: ");
    Serial.println(url);

    // This will send the request to the server
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");
    unsigned long timeout = millis();
    while (client.available() == 0) {
        if (millis() - timeout > 5000) {
            Serial.println(">>> Client Timeout !");
            client.stop();
            return;
        }
    }

    // Read all the lines of the reply from server and print them to Serial

    String line;
    while(client.available()) {
        line = client.readStringUntil('\r');
    }

    // WARNING - this is an arbitrary number. Memory consumption could be reduced
    // by measuring the exact payload expected for this device's resolution
    DynamicJsonDocument doc(40720);
    auto error = deserializeJson(doc, line);
    if (error) {
      Serial.println("Parsing failed");
      Serial.println(error.c_str());
    } else {
      Serial.println("Parsing worked!");
    }

    const char* display_data = doc["display_data"];

    display.clearDisplay();
    int i = -1;
    for (int y = 0; y < 144; y++) {
      for (int x = 0; x < 168; x++) {
        i++;
        if (display_data[i] == '0') {
          continue;
        }
        display.drawPixel(x, y, BLACK);
      }
    }
    display.refresh();
    Serial.println("closing connection");
}
