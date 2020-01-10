# Created By: 
#     Grettel Canepari
#     Katherine Lee
#     Mandar Gogate
#     Petra Alex
#     Preet Puri
#     Sweta Shekhar
# Created On: 01/01/2020
# Updated On: 01/10/2020


from splinter import Browser
from selenium import webdriver
import pandas as pd
import dao as dbCon

def extractData(url, location):
    
    # Set Executable Path & Initialize Chrome Browser
    executable_path = {"executable_path": "bin/chromedriver"}
    Browser("chrome", **executable_path, headless=False)    

    if(location == "counties"):
        df = pd.read_html(url)[0]
        df.dropna()
        counties_df = df.loc[:, ["County","Population"]]        
        counties_list = []
        # Iterate through each row and append in above list
        for i in range(0,len(counties_df)):            
            # https://stackoverflow.com/questions/3437059/does-python-have-a-string-contains-substring-method
            if "United States" not in (counties_df.loc[i][1]):
                counties_list.append({
                    'county' : counties_df.loc[i][0],
                    'population': int(counties_df.loc[i][1])
                })        
        dbCon.insertCountyPopulation(counties_list)        
    else:
        df = pd.read_html(url)[7]
        df.dropna()
        cities_df2 = df.rename(columns={0: "city", 1: "population"})              
        cities_list = []
        # Iterate through each row and append in above list
        for i in range(0,len(cities_df2)):
            cities_list.append({
                'city' : cities_df2.loc[i][0],
                'population': cities_df2.loc[i][1]
            })
        dbCon.insertCityPopulation(cities_list)
        

def populationByCounties():
    baseUrl = "https://www.georgia-demographics.com/counties_by_population/"
    extractData(baseUrl, "counties")

def populationByCities():
    baseUrl = "http://www.togetherweteach.com/TWTIC/uscityinfo/10ga/gapopr/10gapr.htm"
    extractData(baseUrl, "cities")

populationByCounties()
populationByCities()