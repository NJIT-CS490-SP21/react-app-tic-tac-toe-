import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
#from dotenv import load_dotenv, find_dotenv
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os
import models
from datetime import date
load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
import models
#db.create_all()

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#from models import Person

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')

def index(filename):
    return send_from_directory('./build', filename)
   
# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('user connected')
    socketio.emit('connect',  broadcast=True, include_self=False)
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('board')
def on_click(data): # data is whatever arg you pass in your emit call on client
   
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('board',  data, broadcast=True, include_self=False)
@socketio.on('newboard')
def foo(data): # data is whatever arg you pass in your emit call on client
    
    socketio.emit('newboard',  data, broadcast=True, include_self=False)
# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('login')
def foo1(data): # data is whatever arg you pass in your emit call on client
   
    socketio.emit('newlogin',  data, broadcast=True, include_self=False)
# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('message')
def foo2(data): # data is whatever arg you pass in your emit call on client
   
    socketio.emit('newmessage',  data, broadcast=True, include_self=False)
@socketio.on('newdic')
def foo5(data): # data is whatever arg you pass in your emit call on client
    socketio.emit('dicrecieved',  data, broadcast=True, include_self=False)
    if len(data['dic'])>1:
        x=date.today()
       
        new_user = models.Person(username=data['dic']['X'], score=100, date=x)
        new_user2 = models.Person(username=data['dic']['O'], score=100, date=x)
        
        db.session.add(new_user)
        db.session.add(new_user2)
       
        db.session.commit()
        
    
# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('turn')
def foo3(data): # data is whatever arg you pass in your emit call on client
    
    socketio.emit('newturn',  data, broadcast=True, include_self=False)
# Note that we don't call app.run anymore. We call socketio.run with app arg


@socketio.on('newlogin')
def foo11(data):
   
    socketio.emit('newuser',data, broadcast=True, include_self=False)
@socketio.on('login2')
def foo01(data):
    #print(data)
    socketio.emit('newlogin2',data, broadcast=True, include_self=False)
    

@socketio.on('winner')
def foo12(data):
   
  
    winner = models.Person.query.filter_by(username=data['winner']).first()
    winner.score = winner.score+1
    db.session.merge(winner)
    db.session.commit()
    
    looser = models.Person.query.filter_by(username=data['looser']).first()
    looser.score = looser.score-1
    db.session.merge(looser)
    db.session.commit()
@socketio.on('rank')
def foo13(data):
    
    all_people = models.Person.query.all()
    users = []
    
    for person in all_people:
        #users.append(person.username+' '+ str(person.score) +' '+ str(person.date))
        users.append(person.username + '   '+str(person.score))
        
        
    socketio.emit('newrank',users, broadcast=True, include_self=False)   
    
if __name__ == "__main__":
    #db.create_all()
    socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    debug=True
    )
