// https://www.d3-graph-gallery.com/graph/treemap_basic.html

// https://observablehq.com/@d3/d3-stratify

/* Bar Chart Variable Declaration */
var _dashboard = {};

_dashboard.accTime = [];

_dashboard.segColor = function(c, cnt, dataname) {
	var colors = {};    
  if(dataname == "Time"){    
    colors[c] = Colors.random(cnt);    
  }
  return colors[c];
}//end of segColor

var Colors = {};
Colors.names = {    
    green1: '#111d5e',
    skyblue1: '#b21f66',
    gray1: '#fe346e',
    gray2: '#ffbd69',
    blue: '#4DD92B',
    orange2: '#E7492E',
    green2: '#4526EF',
    pink: '#F17CB0',
    brown: '#B2912F',
    purple2: '#B276B2',
    yellow: '#DECF3F',
    red: '#F15854'
};

Colors.random = function (i) {	
  var result;
  var count = 0;
  for (var prop in this.names) {
      if (count <= i)
          result = this.names[prop];
      count += 1;      
  }
  return result;
};


let accidentData;



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

let cmbLocation = d3.select("#selectLocation");
let cmbFilters = d3.select("#selectFilters");
let cmbTime = d3.select("#selectTime");

cmbLocation.on("change", function(d){    
    let location = this.value;
    let colName = d3.select("#selectFilters").property("value");

    filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })

    let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
    renderTreeMap(acciCntByLoc, location);    
})//end of cmbLocation

cmbFilters.on("change", function(d){
  let colName = this.value;
  let location = d3.select("#selectLocation").property("value");

  filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })  
  
  let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
  renderTreeMap(acciCntByLoc, location);

})//end of cmbFilter

cmbTime.on("change", function(d){
  let time = this.value;
  console.log(time)

  filteredData = accidentData.filter(function(d){
                    return time == "All" ? true : d["StartYear"] == time;
                  })  

  // let yearWiseAccCnt = getYearWiseAccCount(filteredData);
  let sunSetWiseAccCnt = getSunSetWiseAccCount(filteredData)
  updatePieChart(sunSetWiseAccCnt);

})//end of cmbTime

d3.csv("data/GA_Accidents_May19_Revised.csv").then(function(myData, err) {
    // console.log(myData);    
    accidentData = myData;
    let location = "City"
    let colName = d3.select("#selectFilters").property("value");
    filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })
    let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
    renderTreeMap(acciCntByLoc, location);

    // let yearWiseAccCnt = getYearWiseAccCount(accidentData);
    let sunSetWiseAccCnt = getSunSetWiseAccCount(accidentData)
    console.log("this is sunset...")
    console.log(sunSetWiseAccCnt)
    // .sort(compareValues('month', 'asc'));                                                                 
    rederPieChart(sunSetWiseAccCnt);
    
    sunSetWiseAccCnt.forEach(function(d){
        _dashboard.accTime.push(d);
    });    
    
    tabulate(_dashboard.accTime, 'accTimePie', ["Time", "Color"], 'Time')



    let monthWiseAccCount = getMonthWiseAccCount(accidentData)
    
    let monthWiseAccCount_Revised = monthWiseAccCount.map(function(d){
                                  return {
                                          month: Number(d.child),
                                          accCount: d.value,
                                          percentage: d.percentage
                                  }
                              })
                              .sort(compareValues('month', 'asc'));

    barChart(monthWiseAccCount_Revised, location);
})

function getSunSetWiseAccCount(data){
  return aggregateData(
                       data.filter(function(d){
                             return d.StartYear == 2017 || d.StartYear == 2018
                           })
                       , "Sunrise_Sunset"
                     ).map(function(d){
                       return {
                         time: d.child,
                         accCounts: d.value,
                         percentage: d.percentage
                       }
                     })
                     .sort(compareValues('time', 'desc'));
}

function getYearWiseAccCount(data){
   return aggregateData(
                        data.filter(function(d){
                              return d.StartYear == 2017 || d.StartYear == 2018
                            })
                        , "StartYear"
                      )                                      
}

function getMonthWiseAccCount(data){
  return aggregateData(data, "StartMonth");      
}


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
}