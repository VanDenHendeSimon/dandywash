from repositories.Electronics import Electronics

import RPi.GPIO as GPIO
import statistics
import time


# Ultrasone, niet Ultrasonisch
class DistanceSensor(Electronics):
    def __init__(self, trigger_pin, echo_pin, component_id=None):
        self.trigger_pin = trigger_pin
        self.echo_pin = echo_pin
        self.component_id = component_id

        self.setup()

    def setup(self):
        GPIO.setmode(GPIO.BCM)

        GPIO.setup(self.trigger_pin, GPIO.OUT)
        GPIO.output(self.trigger_pin, 0)

        # PullUp weerstand zit in de schakeling
        GPIO.setup(self.echo_pin, GPIO.IN)

        # korte delay voor de sensor te laten settlen (100ms)
        time.sleep(0.1)

    def meassure_distance(self, sample_count=5):
        # print("-" * 50)
        samples = []

        # take x amount of samples
        while len(samples) < sample_count:
            # print("taking sample %s" % len(samples))
            sample = self._take_distance_sample()
            samples.append(sample)

            # Give the sensor some time to re-arm
            time.sleep(0.015)

        # mediaan vd samples
        distance = statistics.median(samples)

        # Opslaan in database
        if self.component_id is not None:
            Electronics.store_historiek(distance, self.component_id)

        # Terug geven
        return distance

    def _take_distance_sample(self):
        # Stuur 10microseconden pulse naar de HC-SR04 trigger pin
        GPIO.output(self.trigger_pin, True)
        time.sleep(0.00001)
        GPIO.output(self.trigger_pin, False)
    
        # wachten in de while loop tot dat echo pin high is
        while GPIO.input(self.echo_pin) == 0:
            pass
        # Echo pin is net high geworden => opslaan
        start_time = time.time()
    
        # wachten in de while loop tot dat de echo pin terug low is
        while GPIO.input(self.echo_pin) == 1:
            pass
        # Echo pin is net terug high geworden => distance is binnen
        stop_time = time.time()
    
        # Hoelang is echo hoog geweest
        delta_time = stop_time - start_time

        # vermenigvuldigen met sonische snelheid (34300 cm/s)
        # delen door 2 want de golf heeft de afstand 2x afgelegd (gaan en keren)
        distance = (delta_time * 34300) / 2
    
        return distance
