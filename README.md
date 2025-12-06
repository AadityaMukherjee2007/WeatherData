# Environmental Monitoring System (ESP32 → MQTT → Raspberry Pi)
A fully functional IoT pipeline designed to collect, transmit, store, and serve environmental data in real time.  
This project demonstrates practical experience with microcontrollers, data messaging protocols, back-end automation, and building a live dashboard for sensor visualisation.

---

## 🔧 Project Summary
This system reads **temperature and atmospheric pressure** from a BMP280 sensor connected to an ESP32.  
The ESP32 publishes the data over MQTT in JSON format.  

A **Raspberry Pi Zero 2 W** acts as the data hub:
- Subscribes to the MQTT topic  
- Stores incoming readings in a SQLite database  
- Exposes an API endpoint through Flask  
- Feeds a mobile-responsive dashboard via JavaScript auto-refresh

This project was built as a hands-on exploration of the entire IoT pipeline — from sensor data acquisition to front-end presentation.

---

## 🎯 Key Capabilities Demonstrated

### ✔ Hardware & IoT
- Interfacing digital sensors (BMP280) using MicroPython  
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

┌──────────────────────┐ MQTT Publish ┌────────────────────────┐
│ ESP32 │ ─────────────────────────► │ Raspberry Pi │
│ BMP280 Sensor │ │ MQTT Subscriber │
└──────────────────────┘ │ SQLite Data Logging │
└──────────┬────────────┘
│
▼
┌─────────────────┐
│ Flask API │
└─────────────────┘
│
▼
┌─────────────────┐
│ Live Dashboard │
└─────────────────┘


---

## 🛠 Tech Stack

### Firmware / IoT
- MicroPython  
- ESP32  
- BMP280 Sensor  

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

### 1. ESP32 → BMP280  
Reads sensor values and publishes JSON such as:
```json
{
  "temperature": 28.5,
  "pressure": 1008.1
}
```

### 2. Raspberry Pi → MQTT Subscriber

Listens for incoming data and writes it into an SQLite database.

### 3. Flask API

Provides an endpoint ```/getCurrentData``` returning the newest reading.

### 4. JavaScript Dashboard

Fetches ```/getCurrentData``` periodically and updates the interface in real time.
