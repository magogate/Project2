//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

// ----------------------page 2: population ---------------------

// http://learnjsdata.com/group_data.html
function aggregateData(data, colKey){
    //to get the total accident counts of dataset
      let total = d3.nest()
                        .rollup(function(v){
                            return v.length;
                        })
                        .entries(data);
  
    //to generate the dataset based on selection
      let aggData = d3.nest()
                          .key(function(d){
                              return d[colKey];
                          })
                          .rollup(function(v){
                              return v.length;
                          })
                          .entries(data)
                          .map(function(d){
                              return {
                                      child: d.key,
                                      parent: "GA",
                                      value: d.value,
                                      percentage: Math.round((d.value/total)*100,2)
                              }
                          });
  
      return aggData;
  }//end of aggregateDate
  
cmbPopulation = d3.select("#selectPopulation");

cmbPopulation.on("change", function(d){
  let location = this.value;
  if(location == "City"){
    getCityPopulation()
  }else{
    getCountyPopulation()
  }
})

// https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }//end of compareValues


function rendertAccidentsByLocation(data, location){
    let acciCntByLoc = aggregateData(data, location);
    
    // https://stackoverflow.com/questions/14234646/adding-elements-to-object/14234701
    acciCntByLoc.push({ child: "GA", parent: "", value:"" });   

    // this is to sort values in desc order so that box will get render in order
    // compareValues function is defined at the top
    // https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
    acciCntByLoc.sort(compareValues('value', 'desc'))

    return acciCntByLoc;
    // renderTreeMap(acciCntByLoc, location)
}//end of getAccidentsByCities

d3.csv("data/GA_Accidents_May19_Revised2.csv").then(function(myData, err) {
    // console.log(myData);    
    accidentData = myData;
    // getCountyPopulation()
    getCityPopulation()
    
    
})//end of d3.csv

function getCountyPopulation(){
    let accidentByCounties;
    console.log("Inside getCountyPopulation")
    let acciCntByLoc = rendertAccidentsByLocation(accidentData, "County");    

    // d3.json("data/county_population.json").then(function(myData, err) {
    // d3.json("http://127.0.0.1:5000/county").then(function(myData, err) {
      d3.json("https://gapopulation.herokuapp.com/county").then(function(myData, err) {
        // console.log(myData)
        accidentByCounties = myData;        
        var newObj = [];    
        acciCntByLoc.forEach(function(d) {
          accidentByCounties.forEach(function(v){
            if(d.child == v.county.replace(" County", "")){
              d.population = v.population;
              newObj.push(d);
            }
          })
        });
        renderScatterChart(newObj, "scatterPlot", "value", "population", "County");  
    })//end of d3
    // console.log(newObj)
    // return newObj;
  }//end of getCountyPopulation
  
  
  function getCityPopulation(){    
    // console.log("Inside getCityPopulation")
    
    let acciCntByLoc = rendertAccidentsByLocation(accidentData, "City");
    // d3.json("data/city_population.json").then(function(myData, err) {
    // d3.json("http://127.0.0.1:5000/city").then(function(myData, err) {
      d3.json("https://gapopulation.herokuapp.com/city").then(function(myData, err) {
        // console.log(myData)
        accidentByCities = myData;
        var newObj = [];    
        // console.log(acciCntByLoc)
  
        // for(let i=0; i<acciCntByLoc.length; i++){
        //   for(let j=0; j<accidentByCities.length; j++){          
        //     (accidentByCities[j].city == null) ? accidentByCities[j].city = "" : true;
        //     if(acciCntByLoc[i].child == accidentByCities[j].city.replace(" city", "")){
        //       acciCntByLoc[i].population = accidentByCities[j].population
        //     }
        //   }
        // }//end of for

        acciCntByLoc.forEach(function(d) {
          accidentByCities.forEach(function(v){
            (v.city == null) ? v.city = "" : true;
            if(d.child == v.city.replace(" city", "")){
              d.population = v.population;
              newObj.push(d);
            }
          })
        });
        // renderScatterChart(newObj, "scatterPlot", "value", "population", location);  
        renderScatterChart(newObj, "scatterPlot", "value", "population", "City")
        // console.log(acciCntByLoc)      
    })//end of d3
    return acciCntByLoc;
  }//end of getCityPopulation


