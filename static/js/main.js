//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

// https://www.d3-graph-gallery.com/graph/treemap_basic.html

// https://observablehq.com/@d3/d3-stratify

/* Bar Chart Variable Declaration */
var _dashboard = {};
var filterList = { month: '', day: ''};

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
let cmbMapFilter = d3.select("#selectMapFilters");

cmbLocation.on("change", function(d){    
    let location = this.value;
    let colName = d3.select("#selectFilters").property("value");

    let filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })

    let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
    renderTreeMap(acciCntByLoc, "accidentsTree", location);    
})//end of cmbLocation

cmbFilters.on("change", function(d){
  let colName = this.value;
  let location = d3.select("#selectLocation").property("value");

  let filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })  
  
  let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
  renderTreeMap(acciCntByLoc, "accidentsTree", location);

  // renderHeatMap(filteredData);

})//end of cmbFilter

cmbMapFilter.on("change", function(d){

  let colName = this.value;

  let filteredData = accidentData.filter(function(d){
    return colName == "All" ? true : d[colName] == "TRUE";
  })

  renderHeatMap(filteredData);

})//end of cmbMapFilter

cmbTime.on("change", function(d){
  let time = this.value;
  // console.log(time)

  let filteredData = accidentData.filter(function(d){
                    return time == "All" ? true : d["StartYear"] == time;
                  })  

  // let yearWiseAccCnt = getYearWiseAccCount(filteredData);
  let sunSetWiseAccCnt = getSunSetWiseAccCount(filteredData.filter(function(d){
                                                      return (filterList.month == "") ? true : d.StartMonth == filterList.month
                                                    }))
  updatePieChart(sunSetWiseAccCnt, "accTimePie", "day");

  let monthWiseAccCount = getMonthWiseAccCount(filteredData)
    
  let monthWiseAccCount_Revised = monthWiseAccCount.map(function(d){
                                return {
                                        month: Number(d.child),
                                        accCount: d.value,
                                        percentage: d.percentage
                                }
                            })
                            .sort(compareValues('month', 'asc'));

  updateBarChart(monthWiseAccCount_Revised, "barChartMonth", "month", "accCount", "");  

  let dayWiseAccCount = getDayWiseAccCount(accidentData);

  let dayWiseAccCount_Revised = dayWiseAccCount.map(function(d){
                                                      return {
                                                              day: Number(d.child),
                                                              accCount: d.value,
                                                              percentage: d.percentage
                                                      }
                                                  })
                                                  .sort(compareValues('day', 'asc'));

  updateBarChart(dayWiseAccCount_Revised, "barChartDay", "day", "accCount", "");  


})//end of cmbTime

d3.csv("data/GA_Accidents_May19_Revised2.csv").then(function(myData, err) {
    // console.log(myData);    
    accidentData = myData;
    let location = "City"
    let colName = d3.select("#selectFilters").property("value");
    let filteredData = accidentData.filter(function(d){
                      return colName == "All" ? true : d[colName] == "TRUE";
                    })
    let acciCntByLoc = rendertAccidentsByLocation(filteredData, location);
    renderTreeMap(acciCntByLoc, "accidentsTree", location);

    // let yearWiseAccCnt = getYearWiseAccCount(accidentData);
    let sunSetWiseAccCnt = getSunSetWiseAccCount(accidentData);
    rederPieChart(sunSetWiseAccCnt, "accTimePie", "day");
    
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

    renderBarChart(monthWiseAccCount_Revised, "barChartMonth", "month", "accCount", "");  

    let dayWiseAccCount = getDayWiseAccCount(accidentData);
    // console.log(dayWiseAccCount)

    let dayWiseAccCount_Revised = dayWiseAccCount.map(function(d){
                                          return {
                                                  day: Number(d.child),
                                                  accCount: d.value,
                                                  percentage: d.percentage
                                          }
                                      })
                                      .sort(compareValues('day', 'asc'));

    renderBarChart(dayWiseAccCount_Revised, "barChartDay", "day", "accCount", "");  

    $('#barChartDay').hide();

    let acciCntByWeather = rendertAccidentsByLocation(filteredData, "Weather_Condition");
    renderTreeMap(acciCntByWeather, "weatherTreeMap", "Weather_Condition");

    getClearWeatherData(filteredData)

    renderHeatMap(filteredData);    

    // plotting chropleth, it has to be called only once
    renderChoropleth()

    //---------------population code-------------------
    // getCountyPopulation()
    // getCityPopulation()

})//end of d3.read_csv

function getClearWeatherData(data){
  let formattedWeather = data.map(function(d){
                           d.Weather_Condition != "Clear" ? d.Weather_Condition = "Bad" : "Clear";
                           return d;
                        })

  let acciCntByWeather = aggregateData(formattedWeather, "Weather_Condition");
  console.log("Inside weather...")
  console.log(formattedWeather)
  console.log(acciCntByWeather)
  rederPieChart(acciCntByWeather.map(function(d){
                                        return {
                                                time: d.child,
                                                accCounts: d.value,
                                                percentage: d.percentage                                                
                                        }
                                    }), "weatherPie", "weather");
  // renderTreeMap(acciCntByWeather, "weatherTreeMap", "Weather_Condition");
  
}//end of getClearWeatherData

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
}//end of getSunSetWiseAccCount

function getYearWiseAccCount(data){
   return aggregateData(
                        data.filter(function(d){
                              return d.StartYear == 2017 || d.StartYear == 2018
                            })
                        , "StartYear"
                      )                                      
}//end of getYearWiseAccCount

function getMonthWiseAccCount(data){
  return aggregateData(data, "StartMonth");      
}//end of getMonthWiseAccCount

function getDayWiseAccCount(data){
  return aggregateData(data.filter(function(d){
    // time == "All" ? true : d["StartYear"] == time;
    let time = d3.select("#selectTime").property("value");
    return (filterList.month == "") ? true 
                                    : (time == "All") ? d.StartMonth == filterList.month 
                                    : (d["StartYear"] == time && d.StartMonth == filterList.month);
  }), "StartDay");
}//end of getDayWiseAccCount

function getWeatherWiseAccCount(){
  return true;
  // return aggregateData(data, "Weather_Condition");
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
}//end of aggregateDate

function filterData(){

  var FilterStr = "<div class='divFilter'><img class='closeFilter' src='static/img/close2.png' id='#Filter'>";            
  var CloseStr = "</div>";
  var Title = filterList.month == "" ? "" : FilterStr.replace('#Filter', "month" + filterList.month)  + "Month - " + filterList.month + CloseStr;
  Title += filterList.day == "" ? "" : FilterStr.replace('#Filter', "day" + filterList.day) + "Time - " + filterList.day + CloseStr;

  let time = d3.select("#selectTime").property("value");
  let filteredData = accidentData.filter(function(d){
                    return time == "All" ? true : d["StartYear"] == time;
                  })  
  // let yearWiseAccCnt = getYearWiseAccCount(filteredData);
  let sunSetWiseAccCnt = getSunSetWiseAccCount(filteredData.filter(function(d){
                                                            return (filterList.month == "") ? true : d.StartMonth == filterList.month
                                                          }))
  updatePieChart(sunSetWiseAccCnt, "accTimePie", "day");

  let monthWiseAccCount = getMonthWiseAccCount(filteredData.filter(function(d){
                                                                    return (filterList.day == "") ? true : d.Sunrise_Sunset == filterList.day
                                                                  }))
    
  let monthWiseAccCount_Revised = monthWiseAccCount.map(function(d){
                                return {
                                        month: Number(d.child),
                                        accCount: d.value,
                                        percentage: d.percentage
                                }
                            })
                            .sort(compareValues('month', 'asc'));

  updateBarChart(monthWiseAccCount_Revised, "barChartMonth", "month", "accCount", "");  


  let dayWiseAccCount = getDayWiseAccCount(accidentData.filter(function(d){
                                                                  return (filterList.day == "") ? true : d.Sunrise_Sunset == filterList.day
                                                                }));
  let dayWiseAccCount_Revised = dayWiseAccCount.map(function(d){
                                                      return {
                                                              day: Number(d.child),
                                                              accCount: d.value,
                                                              percentage: d.percentage
                                                      }
                                                  })
                                                  .sort(compareValues('day', 'asc'));
  // console.log(dayWiseAccCount_Revised)
  updateBarChart(dayWiseAccCount_Revised, "barChartDay", "day", "accCount", "");  

    // console.log(Title)
    $('#divTitle').empty().html(Title);

    if (filterList.month != '') {              
        $('#barChartMonth').hide(2000);
        $('#barChartDay').show(2000);
    }else{
        $('#barChartMonth').show(2000);
        $('#barChartDay').hide(2000);
    }
  
    $(".closeFilter").on("click", function (event) {
        var a = this.id;        
        // console.log("Inside close filter..")
        $.each(filterList, function (key, value) {        	
          if (key + value == a) { filterList[key] = ''; }
        });
        filterData(this.id);
    });
}

