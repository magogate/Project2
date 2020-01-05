from pymongo import MongoClient

def getConnection():
    conn = MongoClient('localhost', 27017)
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
    countyPopulation = list(db.county_population.find())
    return countyPopulation

def getCityPopulation():
    db = getConnection()
    cityPopulation = list(db.city_population.find())
    return cityPopulation

getCountyPopulation()
getCityPopulation()