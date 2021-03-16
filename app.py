''' server '''
# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603

import os
from datetime import date
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import desc

load_dotenv(find_dotenv())
APP = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DB = SQLAlchemy(APP)
#DB.create_all()
import models
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#from models import Person
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''docstring'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''emit when a new user connect'''
    print('user connected')
    SOCKETIO.emit('connect', broadcast=True, include_self=False)


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''print when user disconnect'''
    print('User disconnected!')

@SOCKETIO.on('newboard')
def foot(data):  # data is whatever arg you pass in your emit call on client
    '''update all users board when click on restart'''
    SOCKETIO.emit('newboard2', data, broadcast=True, include_self=True)


# Note that we don't call app.run anymore. We call socketio.run with app arg
# Note that we don't call app.run anymore. We call socketio.run with app arg
@SOCKETIO.on('message')
def new_tchat(data):  # data is whatever arg you pass in your emit call on client
    '''nottify other users of new message in tchat'''
    SOCKETIO.emit('newmessage', data, broadcast=True, include_self=False)


@SOCKETIO.on('newdic')
def add_user(
        data):  # data is whatever arg you pass in your emit call on client
    '''add new user to db'''
    
    users = get_all_users()
    if len(data['dic']) > 1:
        new_date = date.today()
        new_user = models.Person(username=data['dic']['X'], score=100, date=new_date)
        if data['dic']['X'] not in users:
            DB.session.add(new_user)
            DB.session.commit()
            users.append(new_user.username)

        new_user2 = models.Person(username=data['dic']['O'], score=100, date=new_date)
        if data['dic']['O'] not in users:

            DB.session.add(new_user2)
            DB.session.commit()
            users.append(new_user2.username)
    SOCKETIO.emit('dicrecieved', data, broadcast=True, include_self=False)
    return users
    
def get_all_users():
    '''get all user from db'''
    user = []
    people = models.Person.query.all()
    for person in people:
        user.append(person.username)
    return user

# Note that we don't call app.run anymore. We call socketio.run with app arg
@SOCKETIO.on('turn')
def foo3(data):  # data is whatever arg you pass in your emit call on client
    '''emit other user player info who jsut played '''
    SOCKETIO.emit('newturn', data, broadcast=True, include_self=False)


# Note that we don't call app.run anymore. We call socketio.run with app arg
@SOCKETIO.on('newlogin')
def foo11(data):
    ''' emit player infos to other player '''
    SOCKETIO.emit('newuser', data, broadcast=True, include_self=False)


@SOCKETIO.on('login2')
def foo01(data):
    ''' emit new user log in infos to all users'''
    SOCKETIO.emit('newlogin2', data, broadcast=True, include_self=False)


@SOCKETIO.on('winner')
def udate_score(data):
    '''updating users score in db '''
    dic = {}
    winner = models.Person.query.filter_by(username=data['winner']).first()
    #dic[winner]=winner.score
    winner.score = winner.score + 1
    #dic[winner]=dic[winner]+1
    DB.session.merge(winner)
    DB.session.commit()
    looser = models.Person.query.filter_by(username=data['looser']).first()
    #dic[looser]=looser.score
    looser.score = looser.score - 1
    #dic[looser]= dic[looser]-1
    DB.session.merge(looser)
    DB.session.commit()
    all_people = models.Person.query.all()
    for elm in all_people:
        dic[elm.username] = elm.score
    return dic


@SOCKETIO.on('rank')
def foo(data):
    ''' emit user and their score'''
    d=get_user_score(get_all())
    users=d[0]
    score=d[1]
    
    
    SOCKETIO.emit('newrank', [users, score, data],
                  broadcast=True,
                  include_self=True)
    
def get_user_score( all_people):
    '''get users and score from db'''
    
    users = []
    score = []
    
    for person in all_people:
        #users.append(person.username+' '+ str(person.score) +' '+ str(person.date))
        users.append(person.username)
        score.append(person.score)
        
    return [users,score]
def get_all():
    all_people = models.Person.query.order_by(desc('score')).all()
    return all_people
if __name__ == "__main__":
    #db.create_all()
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True)
