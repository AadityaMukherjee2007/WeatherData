import sqlite3, random, json
import paho.mqtt.client as mqtt
import os

basedir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(basedir, "WeatherData.db")

con = sqlite3.connect(db_path)
cur = con.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        temperature REAL,
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
        temperature = json_data["temperature"]
        pressure = json_data["pressure"]

        print(json_data)

        cur.execute('INSERT INTO data (temperature, pressure) VALUES (?, ?)', (temperature, pressure))
        con.commit()

        cur.execute('SELECT * FROM data ORDER BY timestamp DESC LIMIT 1')
        output = cur.fetchone()
        print(output)
    except Exception as e:
        print("Error processing message:", e)



mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("localhost", 1883, 180)

mqttc.loop_forever()
