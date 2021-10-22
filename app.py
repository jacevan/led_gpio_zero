from flask import Flask, jsonify, request
from gpio import get_gpio

app = Flask(__name__)
app.debug = True

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  return app.send_static_file(path)

@app.route('/gpio', methods = ['GET', 'POST'])
def led():
  
  if request.method == "GET":
    return jsonify(get_gpio())
  
  if request.method == "POST":
    pass

# not needed in author
# if __name__ == '__main__':
#   app.run( host='0.0.0.0', port=8000, debug=False )

