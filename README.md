# TIC-TAC-TOE game

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3. `pip install flask_socketio `

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

##  Heroku
herouku link: 'https://guarded-caverns-97315.herokuapp.com/'
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

##technical problem
1.could not push to github because the remote directory was still from previous push which i did not know, i googled and found an article on github commands which explained i had to change the remote repository to the new one i just created 
2.could not deploy the app on herokou i keep getting error for the socket missing module because it keeps looking in python2 module insted of python3 and python2 does not support flask_socketio anymore. i spent a lot of time researching on google how to fix it but unfortunatly could not find a solution 

##technical problem
1. same user can log in many times. If i had more time i could create a list of usera that's already logged in emmit and each time a user log in add his socket id to the list he cant log in no more
2. I wanted to add a log out button to remove any user from the user list when they log out by listening to the server once receiving disconnected i just used the user socket id to identify the user and remvove from the user list he can't no more see the board

# project2-gnn3

