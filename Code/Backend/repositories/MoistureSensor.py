from RPi import GPIO
from repositories.Electronics import Electronics
from repositories.DataRepository import DataRepository


class MoistureSensor(Electronics):
    def __init__(self, pin, component_id):
        self.pin = pin
        self.component_id = component_id

        GPIO.setmode(GPIO.BCM)
        # GPIO.setup(pin, GPIO.IN) # PullUp?
        # GPIO.add_event_detect(pin, GPIO.BOTH, self.water_level_changed, bouncetime=300)

    def water_level_changed(self):
        print(GPIO.input(self.pin))
        Electronics.store_historiek(GPIO.input(self.pin), self.component_id)
