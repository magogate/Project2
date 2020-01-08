#https://stackoverflow.com/questions/31252791/flask-importerror-no-module-named-flask
#https://stackoverflow.com/questions/10572498/importerror-no-module-named-sqlalchemy

from flask import Flask, jsonify, render_template, flash
import dao as db

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def index():
    return "choose /city or /county"

@app.route("/city")
def cityPopulation():
    return db.getCityPopulation()

@app.route("/county")
def countyPopulation():
    return db.getCountyPopulation()

if __name__ == "__main__":
    app.run(debug=True)
    