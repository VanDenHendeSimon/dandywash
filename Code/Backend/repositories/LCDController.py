from repositories.DataRepository import DataRepository
from repositories.LCD import LCD
from repositories.Servo import Servo

from RPi import GPIO

from subprocess import check_output
import datetime
import time
import os


class LCDController:
    def __init__(self, links, midden, rechts):
        GPIO.setmode(GPIO.BCM)

        self.links = links
        self.midden = midden
        self.rechts = rechts

        self.state = "welcome"
        self.page = 0

        self.current_query = ""
        self.current_value = ""

        self.uitstel_start = 0
        self.mand = 1

        self.hatch = 0

        # self.baskets = DataRepository.get_data_for_new_connection()
        self.programmas = DataRepository.get_programmas()

        self.lcd_display = LCD(0x39)

        self.setup_buttons()
        self.set_display_content()

    def links_pressed(self):
        print("links pressed")
        # niet naar links als je op de status pagina staat
        if self.state == "cycling":
            if self.page > 0:
                self.page -= 1
                self.set_display_content()
            else:
                self.state = "welcome"
                self.set_display_content()

        elif self.state == "confirm_selection":
            # Go back to cycling
            self.state = "cycling"
            # page = 0
            self.set_display_content()

        elif self.state == "confirm_mand":
            # Switch tussen 1 en 2
            self.mand = 1 if self.mand == 2 else 2
            self.query_mand()

        elif self.state == "query_start_time":
            # aftrekken vd uitsteltijd
            self.uitstel_start -= 5 if self.uitstel_start >= 5 else 0
            self.query_start_time()

        elif self.state == "asked_to_cancel":
            # Go back to cycling
            self.state = "cycling"
            self.page = 0
            self.set_display_content()
        
        elif self.state == "confirm_cancellation":
            # Go back to cycling
            self.state = "cycling"
            self.page = 0
            self.set_display_content()

    def midden_pressed(self):
        print("midden pressed")
        # niets confirmen op status pagina / als je al aan het wassen bent
        if self.state == "cycling":
            if self.page > 0:
                self.state = "confirm_selection"
                self.confirm_selection() # toont programma details
            else:
                if not self.hatch:
                    self.open_hatch()
                else:
                    self.close_hatch()

        elif self.state == "confirm_selection":
            self.state = "confirm_mand"
            self.query_mand()

        elif self.state == "confirm_mand":
            self.state = "query_start_time"
            self.query_start_time()

        elif self.state == "query_start_time":
            # was schedulen en in de database steken
            volgnummer = DataRepository.start_washing(
                self.programmas[self.page - 1].get('Id', 0),
                self.mand,
                (datetime.datetime.now() + datetime.timedelta(minutes=self.uitstel_start)),
            )

            self.update_baskets()

            if self.uitstel_start == 0:
                # Direct starten (3 seconden wachten zodat gebruiker hand kan wegdoen)
                DataRepository.commence_washing(volgnummer)
                time.sleep(3)
                LCDController.drop_into_machine(self.mand)

        elif self.state == "asked_to_cancel":
            self.state = "confirm_cancellation"
            self.ask_cancellation_confirmation()
        
        elif self.state == "confirm_cancellation":
            DataRepository.cancel_was(self.baskets['currentlyWashing']['Volgnummer'])
            self.update_baskets()

        elif self.state == "welcome":
            self.update_baskets()

    def rechts_pressed(self):
        print("rechts pressed")
        if self.state == "cycling":
            if self.baskets['currentlyWashing'] is None:
                self.page += 1
                self.set_display_content()
            else:
                self.state = "asked_to_cancel"
                self.ask_to_cancel()

        elif self.state == "confirm_mand":
            # Switch tussen 1 en 2
            self.mand = 1 if self.mand == 2 else 2
            self.query_mand()

        elif self.state == "query_start_time":
            # optellen bij de uitsteltijd
            self.uitstel_start += 5
            self.query_start_time()

        elif self.state == "asked_to_cancel":
            self.state = "confirm_cancellation"
            self.ask_cancellation_confirmation()

        elif self.state == "confirm_cancellation":
            DataRepository.cancel_was(self.baskets['currentlyWashing']['Volgnummer'])
            self.update_baskets()

        elif self.state == "welcome":
            self.update_baskets()

    def update_baskets(self):
        new_data = DataRepository.get_data_for_new_connection()
        # self.socketio.emit('B2F_BasketUpdate', new_data, broadcast=True)
        self.baskets = new_data
        self.state = "cycling"
        self.page = 0
        self.set_display_content()

    def setup_buttons(self):
        GPIO.setup(self.links, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(self.midden, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(self.rechts, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    def ask_cancellation_confirmation(self):
        self.current_query = "Ben je zeker?"
        self.current_value = ""

        self.update_lcd()

    def ask_to_cancel(self):
        self.current_query = "Stop %s?" % self.baskets['currentlyWashing']['Naam'].replace('°', LCD.CHAR_DEG)
        self.current_value = "%s tot %s" % (
            'bleek' if self.baskets['currentlyWashing']['MandId'] == 1 else 'donker',
            self.baskets['currentlyWashing']['Eind']
        )

        self.update_lcd()

    def query_mand(self):
        # Stuur naar LCD
        if self.mand == 1:
            self.current_query = "Donker (%d%%)" % self.baskets['percentageFilled']['donker']
            self.current_value = ">> Bleek (%d%%)" % self.baskets['percentageFilled']['bleek']
        else:
            self.current_query = ">> Donker (%d%%)" % self.baskets['percentageFilled']['donker']
            self.current_value = "Bleek (%d%%)" % self.baskets['percentageFilled']['bleek']

        self.update_lcd()

    def query_start_time(self):
        self.current_query = "Uitstel start:"
        self.current_value = "%dmin" % self.uitstel_start
        self.update_lcd()

    def display_welcome(self):
        ips = str(
            check_output(["hostname", "--all-ip-addresses"])
        ).replace("b'", "").split()[:-1]

        self.current_query = "Dandywash"
        self.current_value = ips[-1]
        self.update_lcd()

    def display_status(self):
        # Update baskets
        self.baskets = DataRepository.get_data_for_new_connection()

        if self.baskets['currentlyWashing'] is None:
            self.current_query = "Donker: %d%% vol" % self.baskets['percentageFilled']['donker']
            self.current_value = "Bleek: %d%% vol" % self.baskets['percentageFilled']['bleek']
        else:
            # 1 vd 2 baskets wordt gewassen / is gepland om gewassen te worden
            percentage = round(float(self.baskets['currentlyWashing']['Remaining']))
            percentage = 0 if percentage > 100 else (100 - percentage)
            
            if self.baskets['currentlyWashing']['Beschrijving'] == "donker":
                if percentage > 0:
                    self.current_query = "Donker tot %s" % self.baskets['currentlyWashing']['Eind']
                else:
                    self.current_query = "Donker om %s" % self.baskets['currentlyWashing']['Start']

                self.current_value = "Bleek: %d%% vol" % self.baskets['percentageFilled']['bleek']

            else:
                # Bleek is aant wassen
                if percentage > 0:
                    self.current_query = "Bleek tot %s" % self.baskets['currentlyWashing']['Eind']
                else:
                    self.current_query = "Bleek om %s" % self.baskets['currentlyWashing']['Start']

                self.current_value = "Donker: %d%% vol" % self.baskets['percentageFilled']['donker']

        self.update_lcd()

    def display_programma(self):
        if self.page == (len(self.programmas) + 1):
            self.page = 0
            self.display_status()
        else:
            self.current_query = "Programma %d:" % self.page
            self.current_value = self.programmas[(self.page - 1)].get('Naam', 'Undefined').replace('°', LCD.CHAR_DEG)
            self.update_lcd()

    def confirm_selection(self):
        current_programma = self.programmas[(self.page - 1)]

        self.current_query = current_programma.get('Naam', 'Undefined').replace('°', LCD.CHAR_DEG)
        self.current_value = "%s op %s%sC" % (
            LCDController.format_duurtijd(current_programma.get('Duurtijd', 0)),
            current_programma.get('Temperatuur', 0),
            LCD.CHAR_DEG
        )

        self.update_lcd()

    def set_display_content(self):
        if self.state == "cycling":
            if self.page == 0:
                self.display_status()
            elif self.page >= 1:
                self.display_programma()

        elif self.state == "welcome":
            self.display_welcome()

        else:
            print("Other state")

    def update_lcd(self):
        print("\nLCD Lijn 1: %s" % self.current_query)
        print("LCD Lijn 2: %s" % self.current_value)

        self.lcd_display.lcd_display_string(LCDController.format_lcd_text(self.current_query), 1)
        self.lcd_display.lcd_display_string(LCDController.format_lcd_text(self.current_value), 2)

    def update_programmas(self):
        self.programmas = DataRepository.get_programmas()

    def open_hatch(self):
        servo_luik = Servo(21, component_id=11, start_position=2.5)
        servo_luik.rotate(120)
        servo_luik.stop()

        self.hatch = 1

    def close_hatch(self):
        servo_luik = Servo(21, component_id=11, start_position=9.1667)
        servo_luik.rotate(0)
        servo_luik.stop()

        self.hatch = 0

    @staticmethod
    def drop_into_machine(basket):
        servo_luik = Servo(21, component_id=11, start_position=2.5)
        servo_luik.rotate(120)

        if basket == 1:
            # Bleek
            servo_btm_bleek = Servo(5, component_id=6)
            servo_btm_bleek.rotate(200)
            time.sleep(2)
            servo_btm_bleek.rotate(90)
            servo_btm_bleek.stop()

        else:
            servo_btm_donker = Servo(27, component_id=8)
            servo_btm_donker.rotate(-20)
            time.sleep(2)
            servo_btm_donker.rotate(90)
            servo_btm_donker.stop()

        servo_luik.rotate(0)
        servo_luik.stop()

    @staticmethod
    def format_duurtijd(duurtijd):
        hours = duurtijd // 60
        minutes = duurtijd - (hours * 60)

        if minutes == 0:
            return '%du' % hours
        else:
            return '%du %dmin' % (hours, minutes)

    @staticmethod
    def format_lcd_text(text):
        return text + (' ' * (16 - len(text)))
