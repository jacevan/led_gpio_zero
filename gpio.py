event_loop = False

try:
  from script import LED
  print("testing")
except:
  pass

gpio = {}
for p in range(54):
  gpio[p] = 0

def get_gpio():
  try:
    pf = LED.pin_factory
    for p in range(54):
      gpio[p] = 1 if pf.pin(p).state else 0
  except:
    pass

  return gpio