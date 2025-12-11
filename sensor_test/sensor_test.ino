#include <Adafruit_BMP280.h>
#include <DHT.h>

Adafruit_BMP280 bmp; 

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastRead = 0;
const long readInterval = 1000; 

void setup() {
  Serial.begin(115200);
  dht.begin();

  if (!bmp.begin(0x76)) { // I2C address for BMP280
    Serial.println("BMP280 not found at 0x76!");
    while (1);
  }
  Serial.println("Sensors initialized!");
}

void loop() {
  unsigned long now = millis();
  if (now - lastRead > readInterval) {
    lastRead = now;

    // Read sensors
    float bmpTemp = bmp.readTemperature();            // Temperature from BMP280
    float pressure = bmp.readPressure() / 100.0F;     // Pressure in hPa
    float humidity = dht.readHumidity();              // Humidity from DHT22
    float dhtTemp = dht.readTemperature();            // Temperature from DHT22

    // Check for reading errors
//    if (isnan(humidity) || isnan(bmpTemp) || isnan(pressure)) {
//      Serial.println("Failed to read from sensors!");
//      return;
//    }

    // Print values
    Serial.print("Temperature (BMP280): ");
    Serial.print(bmpTemp);
    Serial.println(" °C");

    Serial.print("Pressure (BMP280): ");
    Serial.print(pressure);
    Serial.println(" hPa");

    Serial.print("Temperature (DHT22): ");
    Serial.print(dhtTemp);
    Serial.println(" °C");

    Serial.print("Humidity (DHT22): ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.println("----------------------");
  }
}
