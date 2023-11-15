from flask import Flask
from multiprocessing import Process
from apscheduler.schedulers.background import BackgroundScheduler
import time
import pickle

sora_hunger = 0
sora_tiredness = 0
sora_mood = 'Normal'
app = Flask(__name__)

try:
    with open('save_file.pickle', 'rb') as savings:
        save_file = pickle.load(savings)
        sora_hunger = save_file[0]
        sora_tiredness = save_file[1]
        sora_mood = save_file[2]
except:
    print('Starting form fresh file')

app.config['SERVER_NAME'] = '127.0.0.1:5000'

@app.route("/")
def root():
    return app.send_static_file('index.html')

@app.route("/status")
def status():
    global sora_hunger
    global sora_tiredness
    global sora_mood
    return [sora_hunger, sora_tiredness, sora_mood]

app.url_for('static', filename='index.html')

@app.route("/feed", methods=['PUT'])
def feed():
    global sora_hunger
    sora_hunger = 0
    return [sora_hunger]

@app.route("/sleep", methods=['PUT'])
def sleep():
    global sora_tiredness
    sora_tiredness = 0
    return [sora_tiredness]

def tick():
    global sora_hunger
    global sora_tiredness
    global sora_mood
    sora_tiredness += 1
    if sora_tiredness < 5:
        sora_mood = 'Normal'
    if 5 < sora_tiredness < 8:
        sora_mood = 'Tired'
    if 8 < sora_tiredness:
        sora_mood = 'Very tired' 
    if sora_tiredness == 10:
        print('Sora is too tired to play, please let him sleep')

    sora_hunger += 1
    if sora_hunger == 10:
        print('Sora is hungry, feed him!')


    print(sora_hunger, sora_mood, sora_tiredness)

    save = open('save_file.pickle', 'wb')
    pickle.dump(status(), save)
    save.close()

scheduler = BackgroundScheduler()
job = scheduler.add_job(tick, 'interval', seconds=3)
scheduler.start()