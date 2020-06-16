from RPi import GPIO

class Button:
    def __init__(self, pin, bouncetime=200):
        self.pin = pin
        self.bouncetime = bouncetime

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(pin, GPIO.IN, GPIO.PUD_UP)

    @property
    def pressed(self):
        return not GPIO.input(self.pin)

    def on_press(self, callback_method):
        print(self.bouncetime)
        GPIO.add_event_detect(
            self.pin, GPIO.FALLING, callback_method, bouncetime=self.bouncetime
        )
