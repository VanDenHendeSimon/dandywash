from repositories.LCDController import LCDController
from repositories.DistanceSensor import DistanceSensor
from repositories.MoistureSensor import MoistureSensor
from repositories.ColorSensor import ColorSensor
from repositories.Servo import Servo

from RPi import GPIO
import time
import os


def drop_into_donker():
    # Init servo motors
    servo_top_bleek = Servo(17, component_id=7, start_position=7)
    servo_top_donker = Servo(6, component_id=9)
    servo_scheidingsmuur = Servo(22, component_id=10)

    servo_scheidingsmuur.rotate(125)
    time.sleep(1)
    servo_top_donker.rotate(10)
    servo_top_bleek.rotate(170)
    time.sleep(3)

    servo_top_bleek.rotate(82)
    servo_top_donker.rotate(90)
    servo_scheidingsmuur.rotate(90)

    # Stop servo motors
    servo_top_bleek.stop()
    servo_top_donker.stop()
    servo_scheidingsmuur.stop()


def drop_into_bleek():
    # Init servo motors
    servo_top_bleek = Servo(17, component_id=7, start_position=7)
    servo_top_donker = Servo(6, component_id=9)
    servo_scheidingsmuur = Servo(22, component_id=10)

    servo_scheidingsmuur.rotate(55)
    time.sleep(1)
    servo_top_donker.rotate(10)
    servo_top_bleek.rotate(170)
    time.sleep(3)

    servo_top_bleek.rotate(82)
    servo_top_donker.rotate(90)
    servo_scheidingsmuur.rotate(90)

    # Stop servo motors
    servo_top_bleek.stop()
    servo_top_donker.stop()
    servo_scheidingsmuur.stop()


def start_electronics():
    try:
        distance_sensor_bleek = DistanceSensor(25, 12, component_id=1)
        distance_sensor_donker = DistanceSensor(23, 24, component_id=2)
        distance_sensor_bin = DistanceSensor(16, 20, component_id=None) # Niet standaard opslaan in database

        color_sensor = ColorSensor(component_id=3)

        # Checkt in de klasse naar flanken en slaat deze op in de database, niets doen in de while loop dus
        # moisture_sensor = MoistureSensor(20, component_id=4)
        # servo_handzeepje = Servo(16, component_id=12)

        lcd_controller = LCDController(13, 19, 26)  # Links midden rechts

        threading_works = True
        while True:
            if threading_works:
                # Fetch distance in de bin
                distance_bin = distance_sensor_bin.meassure_distance(sample_count=3)
                # print(distance_bin)

                # Check of er een anomalie is
                if 21 > distance_bin or distance_bin > 25:
                    if color_sensor.get_lux() <= 35:
                        drop_into_donker()
                        time.sleep(2)
                        distance_sensor_donker.meassure_distance()
                    else:
                        drop_into_bleek()
                        time.sleep(2)
                        distance_sensor_bleek.meassure_distance()

                    # Update database
                    distance_sensor_bin.store_historiek(distance_bin, 15)
                    # Broadcast update emit
                    # update_all()

            # Luister naar knopjes
            if GPIO.input(lcd_controller.links) == True:
                lcd_controller.links_pressed()
                time.sleep(0.2)

            elif GPIO.input(lcd_controller.midden) == True:
                lcd_controller.midden_pressed()
                time.sleep(0.2)

            elif GPIO.input(lcd_controller.rechts) == True:
                lcd_controller.rechts_pressed()
                time.sleep(0.2)

            time.sleep(0.15)

    except KeyboardInterrupt:
        print("Programma gestopt")

    finally:
        # Clear lcd
        lcd_controller.lcd_display.lcd_clear()
        GPIO.cleanup()


if __name__ == "__main__":
    start_electronics()
