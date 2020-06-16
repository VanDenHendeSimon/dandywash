from repositories.Electronics import Electronics
from RPi import GPIO
import time


class Servo(Electronics):
    # 7.5 = neutral = 90deg
    def __init__(self, pin, component_id, start_position=7.5, frequency=50):
        self.pin = pin
        self.frequency = frequency
        self.component_id = component_id

        self.duty = start_position

        self.setup()

    def setup(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)

        self.pwm = GPIO.PWM(self.pin, self.frequency)
        self.pwm.start(self.duty) # neutral (90deg)

    def __angle_to_duty_cycle(self, angle):
        # 0 - 180 => 2.5 - 12.5
        return (angle / 18) + 2.5

    def set_angle(self, angle):
        self.duty = self.__angle_to_duty_cycle(angle)
        print("Setting duty cycle to %.2f for an angle of %d degrees" % (self.duty, angle))
        self.pwm.ChangeDutyCycle(self.duty)

        # Loggen naar database? (Allemaal in 1 keer loggen op het einde (lokaal opslaan tot alles klaar is, dan pushen naar db)

    def rotate(self, angle, timespan=1):
        end_duty_cycle = self.__angle_to_duty_cycle(angle)

        delta_duty_cycle = max(end_duty_cycle, self.duty) - min(end_duty_cycle, self.duty)
        steps = 500
        delay = timespan / steps

        one_step_increase = delta_duty_cycle / steps

        if end_duty_cycle > self.duty:
            for i in range(steps):
                self.duty += one_step_increase
                self.pwm.ChangeDutyCycle(self.duty)
                time.sleep(delay)

        else:
            for i in range(steps):
                self.duty -= delta_duty_cycle / steps
                self.pwm.ChangeDutyCycle(self.duty)
                time.sleep(delay)

    def stop(self):
        self.pwm.stop()
