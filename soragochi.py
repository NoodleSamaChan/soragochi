from flask import Flask

app = Flask(__name__)

app.config['SERVER_NAME'] = '127.0.0.1:5000'

@app.route("/")
def root():
    return app.send_static_file('index.html')

app.url_for('static', filename='index.html')
