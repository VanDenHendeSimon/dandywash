from repositories.Electronics import Electronics
from repositories.I2C import I2C

import board
import busio
import adafruit_tcs34725

import RPi.GPIO as GPIO
import time

# Register and command constants
_COMMAND_BIT = 0x80
_REGISTER_ENABLE = 0x00
_REGISTER_ATIME = 0x01
_REGISTER_AILT = 0x04
_REGISTER_AIHT = 0x06
_REGISTER_ID = 0x12
_REGISTER_APERS = 0x0C
_REGISTER_CONTROL = 0x0F
_REGISTER_SENSORID = 0x12
_REGISTER_STATUS = 0x13
_REGISTER_CDATA = 0x14
_REGISTER_RDATA = 0x16
_REGISTER_GDATA = 0x18
_REGISTER_BDATA = 0x1A
_ENABLE_AIEN = 0x10
_ENABLE_WEN = 0x08
_ENABLE_AEN = 0x02
_ENABLE_PON = 0x01
_GAINS = (1, 4, 16, 60)
_CYCLES = (0, 1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60)
_INTEGRATION_TIME_THRESHOLD_LOW = 2.4
_INTEGRATION_TIME_THRESHOLD_HIGH = 614.4


class ColorSensor(Electronics):
    def __init__(self, component_id):
        # self.color_sensor = I2C(0x29)

        self.i2c = busio.I2C(board.SCL, board.SDA)
        self.sensor = adafruit_tcs34725.TCS34725(self.i2c)
        self.sensor.gain = 16

        self.component_id = component_id

    def get_rgb(self):
        # values between 0-65535
        c = self.color_sensor.read_i2c_block_data(0x14, 2)
        r = self.color_sensor.read_i2c_block_data(0x16, 2)
        g = self.color_sensor.read_i2c_block_data(0x18, 2)
        b = self.color_sensor.read_i2c_block_data(0x1A, 2)

        red = int(pow((int((r / c) * 256) / 255), 2.5) * 255)
        green = int(pow((int((g / c) * 256) / 255), 2.5) * 255)
        blue = int(pow((int((b / c) * 256) / 255), 2.5) * 255)

        return [red, green, blue]

    def get_luminance(self):
        luminance = ColorSensor.rgb_to_luminance(get_rgb())

        Electronics.store_historiek(luminance, self.component_id)
        return luminance

    def get_lux(self):
        lux = self.sensor.lux
        Electronics.store_historiek(lux, self.component_id)

        return lux

    @staticmethod
    def rgb_to_luminance(rgb):
        # Resource for the formulas:
        # https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

        # Convert RGB to range 0-1
        rgb = [clr / 255 for clr in rgb]

        # Find min and max values
        min_value = min(rgb)
        max_value = max(rgb)

        # Calculate luminance
        luminance = (min_value + max_value) / 2

        '''
        # Find saturation (not really required)
        if min_value == max_value:
            # No saturation
            saturation = 0
        else:
            # Check level of luminance
            if luminance < 0.5:
                saturation = (max_value - min_value) / (max_value + min_value)
            else:
                saturation = (max_value - min_value) / (2.0 - max_value - min_value)
        '''

        return luminance
