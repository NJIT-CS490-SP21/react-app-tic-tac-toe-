import os
from datetime import date
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import desc

load_dotenv(find_dotenv())
app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
db.create_all()
import models
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#from models import Person
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''emit when a new user connect'''
    print('user connected')
    socketio.emit('connect', broadcast=True, include_self=False)


# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''print when user disconnect'''
    print('User disconnected!')


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
#@socketio.on('board')
#def on_click(data): # data is whatever arg you pass in your emit call on client
# This emits the 'chat' event from the server to all clients except for
# the client that emmitted the event that triggered this function
#socketio.emit('board', data, broadcast=True, include_self=False)
@socketio.on('newboard')
def foo(data):  # data is whatever arg you pass in your emit call on client
    '''update all users board'''
    socketio.emit('newboard2', data, broadcast=True, include_self=True)


# Note that we don't call app.run anymore. We call socketio.run with app arg
# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('message')
def foo2(data):  # data is whatever arg you pass in your emit call on client
    '''nottify other users of new message in tchatt'''
    socketio.emit('newmessage', data, broadcast=True, include_self=False)


@socketio.on('newdic')
def foo55(data):
    socketio.emit('dicrecieved', data, broadcast=True, include_self=False)


def get_all_users():
    user = []
    all_people = models.Person.query.all()
    for person in all_people:
        user.append(person.username)
    return user


def add_user(
        data):  # data is whatever arg you pass in your emit call on client
    '''add new user to db'''

    users = []
    user = get_all_users()
    #all_people = models.Person.query.all()
    #for person in all_people:
    #users.append(person.username)
    if len(data['dic']) > 1:
        x = date.today()
        new_user = models.Person(username=data['dic']['X'], score=100, date=x)
        if data['dic']['X'] not in users:
            db.session.add(new_user)
            db.session.commit()
            user.append(new_user.username)

        new_user2 = models.Person(username=data['dic']['O'], score=100, date=x)
        if data['dic']['O'] not in users:

            db.session.add(new_user2)
            db.session.commit()
            user.append(new_user2.username)

    return user


# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('turn')
def foo3(data):  # data is whatever arg you pass in your emit call on client
    '''emit other user player info who jsut played '''
    socketio.emit('newturn', data, broadcast=True, include_self=False)


# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('newlogin')
def foo11(data):
    ''' emit player infos to other player '''
    socketio.emit('newuser', data, broadcast=True, include_self=False)


@socketio.on('login2')
def foo01(data):
    ''' emit new user log in infos to all users'''
    socketio.emit('newlogin2', data, broadcast=True, include_self=False)


@socketio.on('winner')
def foo12(data):
    '''updating users score in db '''
    dic = {}
    winner = models.Person.query.filter_by(username=data['winner']).first()
    #dic[winner]=winner.score
    winner.score = winner.score + 1
    #dic[winner]=dic[winner]+1
    db.session.merge(winner)
    db.session.commit()
    looser = models.Person.query.filter_by(username=data['looser']).first()
    #dic[looser]=looser.score
    looser.score = looser.score - 1
    #dic[looser]= dic[looser]-1
    db.session.merge(looser)
    db.session.commit()
    all_people = models.Person.query.all()
    for elm in all_people:
        dic[elm.username] = elm.score
    return dic


@socketio.on('rank')
def foo13(data):
    '''get users and score from db'''
    all_people = models.Person.query.order_by(desc('score')).all()
    users = []
    score = []
    d = {}
    for person in all_people:
        #users.append(person.username+' '+ str(person.score) +' '+ str(person.date))
        users.append(person.username)
        score.append(person.score)
        d[person.username] = person.score
    socketio.emit('newrank', [users, score, data],
                  broadcast=True,
                  include_self=True)
    return d


if __name__ == "__main__":
    #db.create_all()
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True)
