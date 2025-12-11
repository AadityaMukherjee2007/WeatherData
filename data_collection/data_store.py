import sqlite3, json
import paho.mqtt.client as mqtt
import os
from datetime import datetime
import pytz

basedir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(basedir, "WeatherData.db")

con = sqlite3.connect(db_path)
cur = con.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        temperature_c REAL,
        temperature_f REAL, 
        humidity REAL, 
        heatIndex_c REAL, 
        heatIndex_f REAL, 
        dewPoint_c REAL, 
        pressure REAL
    )
''')
con.commit()



def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")
    client.subscribe("sensor/data")
    

def on_message(client, userdata, msg):
    try: 
        json_data = json.loads(msg.payload)
        temp_c = json_data["temperature_c"]
        temp_f = json_data["temperature_f"] 
        humidity = json_data["humidity"]
        heatIndex_c = json_data["heatIndex_c"]
        heatIndex_f = json_data["heatIndex_f"]
        pressure = json_data["pressure"]
        dewPoint_c = json_data["dewPoint_c"]

        print(json_data)

        ist = pytz.timezone('Asia/Kolkata')
        timestamp = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

        cur.execute('INSERT INTO data (timestamp, temperature_c, temperature_f, humidity, heatIndex_c, heatIndex_f, pressure, dewPoint_c) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', (timestamp, temp_c, temp_f, humidity, heatIndex_c, heatIndex_f, pressure, dewPoint_c))
        con.commit()

        cur.execute('SELECT * FROM data ORDER BY timestamp DESC LIMIT 1')
        print(cur.fetchone())
    except Exception as e:
        print("Error processing message:", e)



mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("localhost", 1883, 60)

mqttc.loop_forever()
