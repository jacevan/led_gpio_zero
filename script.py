from gpiozero import LED
from gpio import event_loop
from time import sleep
led = LED(2)
# led.off() -> 0 in the browser
# led.on() -> 1 in the browser
led.on()