# TIC-TAC-TOE game

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

##  Heroku (https://essos11.herokuapp.com )

### to create a new Heroku app
1.`heroku login` -i anf fill credentials
2.`heroku create` 
3. `heroku addons:create heroku-postgresql:hobby-dev` (to add a database)
4. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
5. `heroku config` copy the heroku url and paste it in .env
6. Push to Heroku: `git push heroku main`

##Known problem
There is not problem with the app if i had more time i could improve the tchat by adding emoji and make it more interacitve  

##technical Issues
1. Had a problem to display the leaderbord on first click had to click on one tab and click on the other tab in order to disply it. I read in Slack group someone had similar issue and the solution was to change in the server when emiting include_self=False to True so the client who emit receive emit back too.
2. Had a problem running the app from with Heroku i kep getting error URL not found i googled it and found a solution in stackoverflow.com can't find the link anymore but i was missg nodejs buildpack. The app was stoping on the HTML file and could not find the js node. so run `heroku buildpacks:add --index 1 heroku/nodejs` and it fixed it 

# project2-gnn3

