#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp;

const char* WIFI_SSID = "i=q/t#Current";
const char* WIFI_PASS = "2022#ElectronFlow";

const char* MQTT_SERVER = "192.168.0.191"; 
const int MQTT_PORT = 1883;
const char* MQTT_TOPIC = "sensor/data";

const unsigned long PUBLISH_INTERVAL = 900000;


WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastPublish = 0;


void setupWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}


void mqttReconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 2 seconds");
      delay(2000);
    }
  }
}


void publishData() {
  float temp = bmp.readTemperature();
  float pressure = bmp.readPressure() / 100.0F;
  
  StaticJsonDocument<200> doc;

  doc["temperature"] = temp;
  doc["pressure"] = pressure;

  char buffer[200];
  serializeJson(doc, buffer);

  client.publish(MQTT_TOPIC, buffer);
  Serial.print("Published: ");
  Serial.println(buffer);
}


void setup() {
  Serial.begin(115200);
  setupWiFi();

  if (!bmp.begin(0x76)) {  
    Serial.println("Could not find BMP280 sensor at 0x76!");
    while (1);  
  } 
  else {
    Serial.println("BMP280 initialized!");
  }

  client.setServer(MQTT_SERVER, MQTT_PORT);
}


void loop() {
  if (!client.connected()) {
    mqttReconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastPublish >= PUBLISH_INTERVAL) {
    lastPublish = now;
    publishData();
  }
}
