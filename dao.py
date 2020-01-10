# Created By: 
#     Grettel Canepari
#     Katherine Lee
#     Mandar Gogate
#     Petra Alex
#     Preet Puri
#     Sweta Shekhar
# Created On: 01/01/2020
# Updated On: 01/10/2020


from pymongo import MongoClient
import pandas as pd

def getConnection():
    conn = MongoClient('localhost', 27017)
    # connString = "mongodb+srv://mandargogate:Password123@cluster0-x4wnf.mongodb.net/test?retryWrites=true&w=majority"
    
    # conn = MongoClient(connString, 27017)
    
    conn.population
    return conn.population

def insertCountyPopulation(counties_list):
    db = getConnection()

    countyPopulation = list(db.county_population.find())
    if len(countyPopulation) < 1:
        db.county_population.insert(counties_list)
    else:
        # https://www.w3schools.com/python/python_mongodb_delete.asp
        db.county_population.delete_many({})
        db.county_population.insert(counties_list)

def insertCityPopulation(cities_list):
    db = getConnection()

    cityPopulation = list(db.city_population.find())
    if len(cityPopulation) < 1:
        db.city_population.insert(cities_list)
    else:
        # https://www.w3schools.com/python/python_mongodb_delete.asp
        db.city_population.delete_many({})
        db.city_population.insert(cities_list)

def getCountyPopulation():
    db = getConnection()    
    # https://stackoverflow.com/questions/49153020/how-to-dump-a-collection-to-json-file-using-pymongo
    countyPopulation = list(db.county_population.find({},{"population": 1, "_id":0, "county": 1}))
    # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    df = pd.DataFrame(countyPopulation)
    countyPopJson = df.to_json(orient='records')
    # print(countyPopJson)
    
    return countyPopJson

def getCityPopulation():
    db = getConnection()    
    cityPopulation = list(db.city_population.find({},{"population": 1, "_id":0, "city": 1}))
    # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    df = pd.DataFrame(cityPopulation)
    cityPopJson = df.to_json(orient='records')
    # print(cityPopJson)
    return cityPopJson

getCountyPopulation()
getCityPopulation()