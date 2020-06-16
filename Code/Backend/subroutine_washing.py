from repositories.DataRepository import DataRepository
from repositories.Servo import Servo
import time


def drop_into_machine(basket):
    servo_luik = Servo(21, component_id=11, start_position=2.5)
    servo_luik.rotate(120)

    if basket == 1:
        # Bleek
        servo_btm_bleek = Servo(5, component_id=6)
        servo_btm_bleek.rotate(200)
        time.sleep(2)
        servo_btm_bleek.rotate(90)
        servo_btm_bleek.stop()

    else:
        servo_btm_donker = Servo(27, component_id=8)
        servo_btm_donker.rotate(-20)
        time.sleep(2)
        servo_btm_donker.rotate(90)
        servo_btm_donker.stop()

    servo_luik.rotate(0)
    servo_luik.stop()


def was(volgnummer, mandId):
    print("Starting to wash")
    drop_into_machine(mandId)
    time.sleep(2)
    DataRepository.commence_washing(volgnummer)

try:
    while True:
        # Check of er iets gewassen moet worden
        currently_washing = DataRepository.get_currently_planned_washing()
        if currently_washing is not None:
            # moeten we beginnen? (vanaf 100)
            if float(currently_washing.get('Remaining', 101)) <= 100:
                if not currently_washing['Begonnen']:
                    was(currently_washing['Volgnummer'], currently_washing['MandId'])

        # Elke 30 sec kijken of er geen nieuwe zaken moeten gewassen worden
        time.sleep(30)

except KeyboardInterrupt:
    print("Er wordt niet meer gecheckt of er gewassen moet worden")

finally:
    pass
