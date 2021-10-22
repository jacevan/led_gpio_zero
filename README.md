To run the flask API and see the code represented in the browser through the p5 sketch, follow these steps:
- Pull the repo, `git pull https://github.com/jacevan/led_gpio_zero`
- Go into the directory, `cd led_gpio_zero`
- Activate the virtual environment, (linux/mac) `source venv/bin/activate` - (windows powershell) `.\venv\Scripts\activate`
- Set the flask environemnt variable (linux/mac) `export FLASK_APP=app` - (windows powershell) `$ENV:FLASK_APP="app"`
- Run the API, `flask run`
- Go to the web address `127.0.0.1:5000`

The number (0 or 1) in the browser is set by the last line in **script.py**. In order for it to update you need to reload the API, `CTRL-C`, then `flask run`.