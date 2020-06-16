from repositories.DataRepository import DataRepository

from repositories.DistanceSensor import DistanceSensor
from repositories.MoistureSensor import MoistureSensor
from repositories.LCDController import LCDController
from repositories.ColorSensor import ColorSensor
from repositories.Servo import Servo

import threading

from RPi import GPIO
import datetime
import time

from flask_socketio import SocketIO
from flask import Flask, jsonify, request
from flask_cors import CORS
import os


# Flask & SocketIO init
# ###############################################################################################################################

# Start app
app = Flask(__name__)

with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'secret_key.txt'), 'r') as f:
    secret_key = f.readlines()[0]

app.config['SECRET_KEY'] = secret_key

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Elektronica
# ###############################################################################################################################
def start_electronics():
    try:
        distance_sensor_bleek = DistanceSensor(12, 25, component_id=1)
        distance_sensor_donker = DistanceSensor(24, 23, component_id=2)
        distance_sensor_bin = DistanceSensor(16, 6, component_id=None) # Niet standaard opslaan in database

        servo_btm_bleek = Servo(4, component_id=6)
        servo_top_bleek = Servo(17, component_id=7)

        servo_btm_donker = Servo(22, component_id=8)
        servo_top_donker = Servo(18, component_id=9)

        servo_scheidingsmuur = Servo(27, component_id=10)
        servo_luik = Servo(5, component_id=11)
        servo_handzeepje = Servo(16, component_id=12)

        # Checkt in de klasse naar flanken en slaat deze op in de database, niets doen in de while loop dus
        moisture_sensor = MoistureSensor(20, component_id=4)

        lcd_controller = LCDController(26, 19, 13)
        color_sensor = ColorSensor(component_id=3)

        threading_works = False
        while True:
            if threading_works:
                # Fetch distance in de bin
                distance_bin = distance_sensor_bin.meassure_distance(samples=3)

                # Check of er een anomalie is
                if 18 < distance_bin < 22:
                    if color_sensor.get_luminance() < 0.4:
                        # drop into donker
                        distance_sensor_donker.meassure_distance()
                    else:
                        # drop into bleek
                        distance_sensor_bleek.meassure_distance()

                    # Update database
                    distance_sensor_bin.store_historiek(distance_bin, 15)
                    # Broadcast update emit
                    update_all()

            # Luister naar knopjes
            if GPIO.input(lcd_controller.links) == False:
                lcd_controller.links_pressed()
                time.sleep(0.2)

            elif GPIO.input(lcd_controller.midden) == False:
                lcd_controller.midden_pressed()
                time.sleep(0.2)

            elif GPIO.input(lcd_controller.rechts) == False:
                lcd_controller.rechts_pressed()
                time.sleep(0.2)

            time.sleep(0.05)

    except KeyboardInterrupt:
        print("Programma gestopt")

    finally:
        # Clear lcd
        lcd_controller.lcd_display.lcd_clear()
        GPIO.cleanup()

# electronics_process = threading.Thread(target=start_electronics)
# electronics_process.start()


# Flask routes
# ###############################################################################################################################
endpoint = '/api/v1'

@app.route('/')
def info():
    return jsonify(info='Please go to the endpoint ' + endpoint), 300


@app.route(endpoint + '/washistoriekdetails/')
def get_washistoriekdetails():
    try:
        data = DataRepository.get_was_historiek_details()
        if data is not None:
            return jsonify(historiek=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404


@app.route(endpoint + '/get_basket_info/')
def get_basket_info():
    try:
        data = DataRepository.get_baskets_percentage_filled()
        if data is not None:
            return jsonify(baskets=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/get_programmas/', methods=["GET", "POST"])
def get_programmas():
    if request.method == "GET":
        try:
            data = DataRepository.get_programmas()
            if data is not None:
                return jsonify(programmas=data), 200

            else:
                return jsonify(error="data is none"), 404

        except Exception as ex:
            print(ex)
            return jsonify(error="some exception"), 404

    elif request.method == "POST":
        try:
            gegevens = request.get_json()
            data = DataRepository.create_programma(
                gegevens['Duurtijd'],
                gegevens['Temperatuur'],
                gegevens['HoeveelheidProduct'],
                gegevens['Naam']
            )
            if data is not None:
                return jsonify(programmas=data), 200

            else:
                return jsonify(error="data is none"), 404

        except Exception as ex:
            print(ex)
            return jsonify(error="some exception"), 404

@app.route(endpoint + '/get_programmas/<_id>')
def get_programma(_id):
    try:
        data = DataRepository.get_programma(_id)
        if data is not None:
            return jsonify(programma=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/edit_programma/<_id>', methods=["PUT"])
def edit_programma(_id):
    print(_id)
    try:
        gegevens = request.get_json()
        print(gegevens)

        data = DataRepository.edit_programma(
            _id,
            gegevens['Duurtijd'],
            gegevens['Temperatuur'],
            gegevens['HoeveelheidProduct'],
            gegevens['Naam']
        )
        if data is not None:
            return jsonify(programma=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/get_notifications/')
def get_all_notifications():
    try:
        data = DataRepository.get_notificaties()
        if data is not None:
            # Geen key meer toevoegen hier
            return jsonify(data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/get_new_notifications/')
def get_new_notifications():
    try:
        data = DataRepository.get_new_notificaties()
        if data is not None:
            # Geen key meer toevoegen hier
            return jsonify(data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/viewed_notifications/', methods=['PUT'])
def viewed_notifications():
    try:
        data = DataRepository.mark_notifications_seen()
        if data is not None:
            return jsonify(updated=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/delete_notification/<volgnummer>', methods=['DELETE'])
def delete_notification(volgnummer):
    try:
        data = DataRepository.delete_notification(volgnummer)
        if data is not None:
            return jsonify(updated=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/delete_programma/<volgnummer>', methods=['DELETE'])
def delete_programma(volgnummer):
    try:
        data = DataRepository.delete_programma(volgnummer)
        if data is not None:
            return jsonify(updated=data), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/get_analytics/<topic>')
def get_analytics(topic):
    try:
        if topic == "Aantal keer programma":
            data = DataRepository.get_hoeveel_keer_programma()

            # Omzetten naar formaat voor bar chart in Javascript
            data = {
                "x": [o['Programma'] for o in data],
                "y": [o['Aantal'] for o in data]
            }

        elif topic == "Washistoriek":
            data = DataRepository.get_was_historiek_grafiek()

            # not suited for list / dict comprehension
            x = []
            y = []
            z = []
            for o in data:
                if o['Dag'] not in x:
                    x.append(o['Dag'])

                if o['Beschrijving'] == "bleek":
                    y.append(o['Aantal wassen'])
                elif o['Beschrijving'] == "donker":
                    z.append(o['Aantal wassen'])

            # Omzetten naar formaat voor bar chart in Javascript
            data = {
                "x": x,
                "y": y,
                "z": z
            }
        else:
            data = None

        if data is not None:
            analytics = {
                "analytics": data,
                "topic": topic
            }
            return jsonify(analytics), 200

        else:
            return jsonify(error="data is none"), 404

    except Exception as ex:
        print(ex)
        return jsonify(error="some exception"), 404

@app.route(endpoint + '/start_washing/', methods=['PUT'])
def start_washing_route():
    try:
        gegevens = request.get_json()
        data = DataRepository.start_washing(
            gegevens['program'],
            gegevens['basket'],
            (datetime.datetime.now() + datetime.timedelta(minutes=gegevens['delay'])),
        )

        if data is not None:
            return jsonify(worked=1), 200

        else:
            return jsonify(worked=0), 404

    except Exception as ex:
        return jsonify(error=str(ex)), 404

@app.route(endpoint + '/cancel_was/<volgnummer>', methods=['DELETE'])
def cancel_was(volgnummer):
    try:
        print("Canceling %s" % volgnummer)
        data = DataRepository.cancel_was(volgnummer)

        if data is not None:
            return jsonify(worked=1), 200

        else:
            return jsonify(worked=0), 404

    except Exception as ex:
        return jsonify(error=str(ex)), 404

# SocketIO
# ###############################################################################################################################

# SOCKET.IO EVENTS
@socketio.on('connect')
def connect():
    try:
        socketio.emit('B2F_ConnectionReceived', DataRepository.get_data_for_new_connection())

    except Exception as ex:
        print(ex)
        socketio.emit("B2F_ConnectionReceived", {})


# Losse methods
# ###############################################################################################################################
def update_notifications():
    socketio.emit('B2F_NotificationsUpdate', DataRepository.get_notificaties(), broadcast=True)

def update_all():
    socketio.emit('B2F_BasketUpdate', DataRepository.get_data_for_new_connection())

# START THE APP
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
