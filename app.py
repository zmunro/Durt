from flask import Flask, render_template
from flask import request
from flask import Response
from flask import jsonify
from flask import make_response
from flask_cors import CORS, cross_origin
import os
import datetime
from flask import send_from_directory
from flask_pymongo import PyMongo
from pymongo import MongoClient
import sys
import sendgrid
import json
from bson.json_util import dumps
import os
from sendgrid.helpers.mail import *

app = Flask(__name__)
mongo = PyMongo(app)

CORS(app)

app.config['MONGO_HOST'] = ''
app.config['MONGO_PORT'] = ''
app.config['MONGO_DBNAME'] = ''
app.config['MONGO_URI'] = ''
DB_NAME = '' 
DB_HOST = ''
DB_PORT = 25156
DB_USER = DB_NAME
DB_PASS = ""

uri = ''
connection = MongoClient(uri)
db = connection[DB_NAME]


@app.route('/addUser', methods=['POST'])
def addUser():
	if request.method == "POST":

		content = request.get_json(silent=True)

		date = datetime.datetime.now()
		user = { "first": content['first'],
				"last": content['last'],
				"_id": content['_id'],
				"plants": content['plants'],
				"lat": content['lat'],
				"lng": content['lng'],
				"email": content['email'] }
		db.Users.insert_one(user)

		#sending first email to client
		if content['email'] == "-1":
			return "success"

		sg = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
		message = ("<p>Hello " + content['first'] + " " + content['last'] + ",</p><br>")
		message += "<p>Thank you so much for choosing to plant your garden with Durt! We can't wait to help you reap a great harvest in the weeks to come. We'll be here with you every step of the way, helping you to know when to water and when its time to harvest, as well as giving you tips along the way.<p><br><br><p>Happy planting!</p><p>From the team here at Durt<p> "

		data = {
  			"personalizations": [
    		  	{
      				"to": [
        		  	{
          				"email": content['email']
        		  	}],
      				"subject": "Welcome to Durt!"
    		  	}],
  			"from": {
    			"email": "durt.gardens@gmail.com"
  			},
  			"content": [
    		  	{
      				"type": "text/html",
      				"value": message
    		  	}]
		}
		response = sg.client.mail.send.post(request_body=data)
		return "success"


@app.route('/addPlant', methods=['POST'])
def addPlant():
    if request.method == "POST":
        content = request.get_json(silent=True)
	userID = content['id']		
	user = db.Users.find_one({'_id':content['id']})
    	user['plants'].append(content['plant'])

    	db.Users.save(user)
    	return jsonify(user)
    else:
    	return """<html><body>Something went wrong</body></html>"""


@app.route('/getUser', methods=['POST'])
def getUser():
	if request.method == "POST":
		content = request.get_json(silent=True)
		if db.Users.find({'_id':content['_id']}).count() > 0:
			info = db.Users.find_one({'_id':content['_id']})
			return jsonify(info)
		else:
			info = {"name":"newUser"}
			return jsonify(info)
	else:
		return """<html><body>Something went wrong</body></html>"""


@app.route('/plantInfo', methods=['POST'])
def plantInfo():
    if request.method == "POST":
        content = request.get_json(silent=True)
        if db.PLANTDB.find({'plantName':content['plant']}).count() > 0:
            info = db.PLANTDB.find_one({'plantName':content['plant']})
            return json.dumps(str(info))
        else:
            return "plant not in DB"
    else:
        return """<html><body>Something went wrong</body></html>"""


@app.route('/getPlants', methods=['GET'])
def getPlants():
	if request.method == "GET":
		info = db.PLANTDB.find()
		return dumps(info)
	else:
		return ""


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static', 'imgs'),'favicon.ico', mimetype='image/png')
	

@app.route('/')
def render():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
	return render_template('privacypolicy.htm')

@app.route('/manageGarden')
def manageGarden():
    return render_template('manageGarden.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/getStarted')
def getStarted():
	return render_template('getStarted.html')

@app.route('/about')
def about():
	return render_template('about.html')

@app.route('/resources')
def resources():
	return render_template('resources.html')

if __name__=='__main__':
	app.run(debug=True)
