from repositories.LCDController import LCDController
from RPi import GPIO
import time
import os


try:
    lcd_controller = LCDController(26, 19, 13)
    # os.system("clear")

    while True:
        if GPIO.input(lcd_controller.links) == True:
            lcd_controller.links_pressed()
            time.sleep(0.2)

        elif GPIO.input(lcd_controller.midden) == True:
            lcd_controller.midden_pressed()
            time.sleep(0.2)

        elif GPIO.input(lcd_controller.rechts) == True:
            lcd_controller.rechts_pressed()
            time.sleep(0.2)

except KeyboardInterrupt:
    print("Programma gestopt")

finally:
    # Clear lcd
    lcd_controller.lcd_display.lcd_clear()
    GPIO.cleanup()
