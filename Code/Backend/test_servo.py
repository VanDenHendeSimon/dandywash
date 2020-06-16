from repositories.Servo import Servo
from RPi import GPIO
import time


def drop_into_bleek():
    servo_scheidingsmuur.set_angle(55)
    time.sleep(1)
    servo_top_bleek.set_angle(170)
    servo_top_donker.set_angle(10)
    time.sleep(3)

    servo_top_bleek.set_angle(90)
    servo_top_donker.set_angle(90)
    servo_scheidingsmuur.set_angle(90)

def drop_into_donker():
    servo_scheidingsmuur.set_angle(125)
    time.sleep(1)
    servo_top_donker.set_angle(10)
    servo_top_bleek.set_angle(170)
    time.sleep(3)

    servo_top_bleek.set_angle(90)
    servo_top_donker.set_angle(90)
    servo_scheidingsmuur.set_angle(90)


try:
    '''
    GPIO.cleanup()
    servo_btm_bleek = Servo(27, component_id=6)
    servo_top_bleek = Servo(17, component_id=7)

    servo_btm_donker = Servo(5, component_id=8)
    servo_top_donker = Servo(6, component_id=9)

    servo_scheidingsmuur = Servo(22, component_id=10)
    '''

    # Bottom donker
    # 90 = base pos, 180 = luikje open
    # my_servo2 = Servo(5, None, start_position=7)

    # Top donker
    # 100 = base, 10 = drop in donker, 30 = drop in bleek
    # my_servo = Servo(6, None)

    # Middenschap
    # 90 = base pos = recht omhoog
    # 55 = laten vallen in bleek
    # 125 = laten vallen in donker
    # my_servo = Servo(22, None)

    # Bottom bleek
    # 90 = base pos, -15 = luikje open
    # my_servo = Servo(27, None)
    
    # Top bleek
    # 90 = base pos, 170 = open
    # my_servo = Servo(17, None)

    my_servo = Servo(21, None, start_position=9.1667)

    while True:

        if True:
            if False:
                my_servo.rotate(0)
                time.sleep(2)
                my_servo.rotate(110)
                time.sleep(2)
            else:
                # reset
                # pass
                my_servo.rotate(0)
                break

        else:    
            drop_into_bleek()
            time.sleep(3)

            drop_into_donker()
            time.sleep(3)
        
        # my_servo.set_angle(80)
        # time.sleep(2)
        # my_servo.set_angle(170)
        # time.sleep(2)

        # my_servo.set_angle(0)
        # time.sleep(2)
        # my_servo.set_angle(90)
        # time.sleep(2)
        # my_servo.set_angle(180)
        # time.sleep(2)

except KeyboardInterrupt:
    print("Programma gestopt")

finally:
    my_servo.stop()
    servo_btm_bleek.stop()
    servo_top_bleek.stop()
    servo_btm_donker.stop()
    servo_top_donker.stop()
    servo_scheidingsmuur.stop()

    GPIO.cleanup()
