# Environmental Monitoring System (ESP8266 → MQTT → Raspberry Pi)
A fully functional IoT pipeline designed to collect, transmit, store, and serve environmental data in real time.  
This project demonstrates practical experience with microcontrollers, data messaging protocols, back-end automation, and building a live dashboard for sensor visualisation.

---

## 🔧 Project Summary
This system reads **temperature, humidity and atmospheric pressure** from a BMP280 sensor connected to an ESP32.  
The ESP8266 publishes the data over MQTT in JSON format.  

A **Raspberry Pi Zero 2 W** acts as the data hub:
- Subscribes to the MQTT topic  
- Stores incoming readings in a SQLite database  
- Exposes an API endpoint through Flask  
- Feeds a mobile-responsive dashboard via JavaScript auto-refresh

This project was built as a hands-on exploration of the entire IoT pipeline — from sensor data acquisition to front-end presentation.

---

## 🎯 Key Capabilities Demonstrated

### ✔ Hardware & IoT
- Interfacing digital sensors (BMP280) using Arduino  
- Writing reliable publisher–subscriber flows with MQTT  
- Handling timing, communication, and data formatting on microcontrollers  

### ✔ Back-End Engineering
- Building a Flask API to expose real-time sensor readings  
- Writing modular, production-style Python scripts  
- Designing & managing lightweight databases (SQLite)  

### ✔ Systems & Automation
- Configuring Mosquitto MQTT Broker  
- Creating systemd services for automatic background execution  
- Managing persistent logging & resilient data pipelines  

### ✔ Front-End Integration
- Using JavaScript to auto-refresh data on a dashboard  
- Designing a clean, mobile-responsive UI  
- Building a real-time visual layer for sensor monitoring  

---

## 🧩 System Architecture
```
┌────────────────────┐       MQTT Publish       ┌───────────────────────┐
│ ESP8266            │ ───────────────────────► │ Raspberry Pi          │
│ BMP280 Sensor      │                          │ MQTT Subscriber       │
└────────────────────┘                          │ SQLite Data Logging   │
                                                └──────────┬────────────┘
                                                           │
                                                           ▼
                                                     ┌────────────┐
                                                     │ Flask API  │
                                                     └────────────┘
                                                            │
                                                            ▼
                                                    ┌─────────────────┐
                                                    │ Live Dashboard  │
                                                    └─────────────────┘

```
---

## 🛠 Tech Stack

### Firmware / IoT
- Arduino
- ESP8266
- BMP280 Sensor
- DHT22

### Messaging & Protocols
- MQTT (Mosquitto Broker)  

### Backend
- Python  
- Flask  
- SQLite  
- paho-mqtt  

### Automation
- systemd  
- Linux (Raspberry Pi OS)  

### Frontend
- HTML  
- CSS  
- JavaScript (auto-refresh logic)

---

## 📁 Directory Structure

WeatherData/<br/>
├── dashboard<br/>
│   ├── app.py<br/>
│   ├── __pycache__<br/>
│   │   └── app.cpython-39.pyc<br/>
│   ├── static<br/>
│   │   ├── iot.png<br/>
│   │   ├── pressure-gauge.png<br/>
│   │   ├── room-temperature.png<br/>
│   │   ├── script.js<br/>
│   │   └── styles.css<br/>
│   └── templates<br/>
│       └── index.html<br/>
├── data_collection<br/>
│   ├── data_store.py<br/>
│   └── WeatherData.db<br/>
├── esp_weather_data<br/>
│   └── esp_weather_data.ino<br/>
├── README.md<br/>
└── sensor_test<br/>
    └── sensor_test.ino


---

## 🚀 How the System Works

### 1. ESP8266 → BMP280  
Reads sensor values and publishes JSON such as:
```json
{
  "dewPoint_c": 10.68,
  "heatIndex_c": 20.81,
  "heatIndex_f": 69.46,
  "humidity": 50.8,
  "pressure": 1014.49,
  "temperature_c": 21.3,
  "temperature_f": 70.3,
}
```

### 2. Raspberry Pi → MQTT Subscriber

Listens for incoming data and writes it into an SQLite database.

### 3. Flask API

Provides two main endpoints:
▶ `/getCurrentData`

Returns the **latest sensor reading**.Used by the dashboard for live value updates.
▶ `/getData?n=<rows>&offset=<offset>`

Returns **historical sensor records** with pagination support.

This enables:
- Loading previous data for charts
- Implementing scrollable or paginated tables
- Efficient queries without loading the entire database

**Query Parameters**:
- `n` → Number of rows to return (limit)
- `offset` → Number of rows to skip from the newest record

Example Requests:
Get latest 50 rows:
```url
/getData?n=50&offset=0
```

Get next 50 older rows:
```url
/getData?n=50&offset=50
```

**Response Format**:
```json
{
  "data": [
    {
      "id": 727,
      "temp_c": 20.8,
      "pressure": 1018.59,
      "humidity": 71.6,
      "dewPoint_c": 15.47,
      "heatIndex_c": 20.8,
      "timestamp": "2025-12-28 21:52:22"
    }
  ]
}
```
### 4. JavaScript Dashboard

- Periodically fetches `/getCurrentData` to update live cards

- Fetches `/getData` on load to render historical charts

- Can request additional older data using offset when the user scrolls

This allows smooth visualisation of both real-time and past trends.
