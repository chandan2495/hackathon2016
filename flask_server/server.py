from flask import Flask
import sys

sys.path.insert(0, '../python_scripts')

import sqlReader as sr

app = Flask(__name__)

@app.route("/hello")
def hello():
	return "Server is live"

@app.route("/getImageDetails")
def getImageDetails():
	return sr.getJSONFromSql()

if __name__ == "__main__":
	app.run()