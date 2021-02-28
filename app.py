import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)
lst=[]
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    
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
# Note that we don't call app.run anymore. We call socketio.run with app arg
@socketio.on('turn')
def foo3(data): # data is whatever arg you pass in your emit call on client
    
    socketio.emit('newturn',  data, broadcast=True, include_self=False)
# Note that we don't call app.run anymore. We call socketio.run with app arg


@socketio.on('clientid')
def goo(data):
    if len(lst)<2 and data not in lst:
        lst.append(data)
    socketio.emit('user',lst, broadcast=True, include_self=False)
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    debug=True
)