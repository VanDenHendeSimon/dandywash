import time
from repositories.ColorSensor import ColorSensor


try:
    color_sensor = ColorSensor(component_id=None)

    while True:
        print(color_sensor.get_rgb())
        time.sleep(2)

except KeyboardInterrupt:
    print("Stopped")

finally:
    pass
