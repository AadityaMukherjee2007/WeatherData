from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
db_path = os.path.join(basedir, "data_collection", "WeatherData.db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////media/rpi/WD PASSPORT/WeatherData/data_collection/WeatherData.db'

db = SQLAlchemy(app)

def get_weather_table():
    metadata = MetaData()
    return Table('data', metadata, autoload_with=db.engine)
    
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getCurrentData')
def getCurrentData():
    WeatherData = get_weather_table()
    latest_data = db.session.query(WeatherData).order_by(WeatherData.c.timestamp.desc()).first()

    if latest_data:
        return jsonify({
            "temp_c": latest_data.temperature_c,
            "temp_f": latest_data.temperature_f,
            "humidity": latest_data.humidity,
            "heatIndex_c": round(latest_data.heatIndex_c, 2),
            "heatIndex_f": round(latest_data.heatIndex_f, 2),
            "dewPoint_c": latest_data.dewPoint_c,
            "pressure": round(latest_data.pressure, 2),
            "timestamp": str(latest_data.timestamp)
        })
    return jsonify({
        "error": "No data found"
    })

if __name__ == "__main__":
    app.run(debug=True)
