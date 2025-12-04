import sqlite3, random, json
import paho.mqtt.client as mqtt

con = sqlite3.connect("WeatherData.db")
cur = con.cursor()


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
    except e:
        print("Error processing message:", e)



mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("localhost", 1883, 180)

mqttc.loop_forever()
