from repositories.DistanceSensor import DistanceSensor
import time
from RPi import GPIO


try:
    # trigger dan echo
    distance_sensor_bleek = DistanceSensor(25, 12, component_id=1)
    distance_sensor_donker = DistanceSensor(23, 24, component_id=2)
    distance_sensor_bin = DistanceSensor(16, 20, component_id=None) # Niet standaard opslaan in database

    dist_bleek = distance_sensor_bleek.meassure_distance()
    dist_donker = distance_sensor_donker.meassure_distance()
    dist_bin = distance_sensor_bin.meassure_distance()
    
    print("Bleek: %.2f" % dist_bleek)
    print("Donker: %.2f" % dist_donker)
    print("Bin: %.2f" % dist_bin)

except KeyboardInterrupt:
    print("Programme gestopt")

finally:
    GPIO.cleanup()
    print("Proramma opgeruimd")
