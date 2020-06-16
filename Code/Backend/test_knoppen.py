from RPi import GPIO

import time
import os

def links_pressed():
    print("Linkse knop")

def midden_pressed():
    print("Ok knop")

def rechts_pressed():
    print("Rechtse knop")

try:
    GPIO.cleanup()
    GPIO.setmode(GPIO.BCM)

    links = 26
    midden = 19
    rechts = 13

    GPIO.setup(links, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(midden, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(rechts, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    # Done with variables
    os.system("clear")

    while True:
        if GPIO.input(links) == True:
            links_pressed()
            time.sleep(0.2)

        if GPIO.input(midden) == True:
            midden_pressed()
            time.sleep(0.2)

        if GPIO.input(rechts) == True:
            rechts_pressed()
            time.sleep(0.2)

except KeyboardInterrupt:
    print("Programma gestopt")

finally:
    GPIO.cleanup()
    print("Programma opgeruimd")