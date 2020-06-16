import time

import board
import busio
import adafruit_tcs34725


try:
    i2c = busio.I2C(board.SCL, board.SDA)
    sensor = adafruit_tcs34725.TCS34725(i2c)
    sensor.gain = 16
    
    while True:
        # Bij lux zieje wel duidelijk verschil tss licht en donker
        lux = sensor.lux
        print("Lux: %s" % lux)

        # Bij clear ook wel
        r, g, b, clear = sensor.color_raw
        print("Clear: %s" % clear)

        time.sleep(3)

except KeyboardInterrupt:
    print("Stopped")

finally:
    pass
