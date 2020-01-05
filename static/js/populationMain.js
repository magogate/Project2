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
    getCountyPopulation()
    getCityPopulation()
})//end of d3.csv

function getCountyPopulation(){
    let accidentByCounties;
    console.log("Inside getCountyPopulation")
    let acciCntByLoc = rendertAccidentsByLocation(accidentData, "County");
    d3.json("data/county_population.json").then(function(myData, err) {
        // console.log(myData)
        accidentByCounties = myData;        
        console.log(acciCntByLoc)
  
        for(let i=0; i<acciCntByLoc.length; i++){
          for(let j=0; j<accidentByCounties.length; j++){
            if(acciCntByLoc[i].child == accidentByCounties[j].county.replace(" County", "")){
              acciCntByLoc[i].population = accidentByCounties[j].population
            }
          }
        }//end of for
  
        console.log(acciCntByLoc)
    })//end of d3
    return acciCntByLoc;
  }//end of getCountyPopulation
  
  
  function getCityPopulation(){
    let accidentByCounties;
    console.log("Inside getCityPopulation")
    let acciCntByLoc = rendertAccidentsByLocation(accidentData, "City");
    d3.json("data/city_population.json").then(function(myData, err) {
        console.log(myData)
        accidentByCities = myData;
        
        console.log(acciCntByLoc)
  
        for(let i=0; i<acciCntByLoc.length; i++){
          for(let j=0; j<accidentByCities.length; j++){          
            (accidentByCities[j].city == null) ? accidentByCities[j].city = "" : true;
            if(acciCntByLoc[i].child == accidentByCities[j].city.replace(" city", "")){
              acciCntByLoc[i].population = accidentByCities[j].population
            }
          }
        }//end of for
        console.log(acciCntByLoc)      
    })//end of d3
    return acciCntByLoc;
  }//end of getCityPopulation


