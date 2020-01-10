# Created By: 
#     Grettel Canepari
#     Katherine Lee
#     Mandar Gogate
#     Petra Alex
#     Preet Puri
#     Sweta Shekhar
# Created On: 01/01/2020
# Updated On: 01/10/2020

#https://stackoverflow.com/questions/31252791/flask-importerror-no-module-named-flask
#https://stackoverflow.com/questions/10572498/importerror-no-module-named-sqlalchemy

from flask import Flask, jsonify, render_template, flash
import dao as db
import webScrapPopulation as webscrap

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def index():
    htmlTag ="""<html>
                <table>
                
                    <tr>
                        <td> To get city json - use </td>
                        <td> /city </td>
                    </tr>
                    <tr>
                        <td> To get county json - use </td>
                        <td> /county </td>
                    </tr>
                    <tr>
                        <td> To load city json - use </td>
                        <td> /loadCity </td>
                    </tr>
                    <tr>
                        <td> To load county json - use </td>
                        <td> /loadCounty </td>
                    </tr>
                
                <table>
                <html>
            """
    return htmlTag

@app.route("/city")
def cityPopulation():
    return db.getCityPopulation()

@app.route("/county")
def countyPopulation():
    return db.getCountyPopulation()

@app.route("/loadCounty")
def loadCountyPopulation():
    webscrap.populationByCounties()
    return "County data loaded successfully.."

@app.route("/loadCity")
def loadCityPopulation():
    webscrap.populationByCities()
    return "City data loaded successfullly.."

if __name__ == "__main__":
    app.run(debug=True)
    