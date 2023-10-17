from flask import Flask
from multiprocessing import Process
import time

sora_hunger = 0
sora_tiredness = 0
sora_mood = 'Normal'
app = Flask(__name__)

app.config['SERVER_NAME'] = '127.0.0.1:5000'

@app.route("/")
def root():
    return app.send_static_file('index.html')

@app.route("/status")
def status():
    return [sora_hunger, sora_tiredness, sora_mood]

app.url_for('static', filename='index.html')

def tiredness(sora_tiredness):
    while sora_tiredness < 10:
        sora_tiredness += 1
        if sora_tiredness < 5:
            sora_mood = 'Normal'
        if 5 < sora_tiredness < 8:
            sora_mood = 'Tired'
        if 8 < sora_tiredness:
            mora_mood = 'Very tired' 
        time.sleep(10)
    if sora_tiredness == 10:
        print('Sora is too tired to play, please let him sleep')
        sora_tiredness = 0



def hunger(sora_hunger):
    while sora_hunger < 10:
        sora_hunger += 1
        time.sleep(1)
    while sora_hunger == 10:
        print('Sora is hungry, feed him!')

if __name__ == "__main__":
    p1 = Process(target=tiredness)
    p1.start()
    p2 = Process(target=hunger)
    p2.start()

