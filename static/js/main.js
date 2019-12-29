// https://www.d3-graph-gallery.com/graph/treemap_basic.html

// https://observablehq.com/@d3/d3-stratify


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


d3.csv("data/GA_Accidents_May19_Revised.csv").then(function(myData, err) {
    // console.log(myData);    
    getAccidentsByCities(myData)
})

function getAccidentsByCities(data){
    let acciCntByCities = aggregateData(data, "City");
    
    // https://stackoverflow.com/questions/14234646/adding-elements-to-object/14234701
    acciCntByCities.push({ child: "GA", parent: "", value:"" });   

    // this is to sort values in desc order so that box will get render in order
    acciCntByCities.sort(compareValues('value', 'desc'))
    renderTreeMap(acciCntByCities)
}//end of getAccidentsByCities

// http://learnjsdata.com/group_data.html
function aggregateData(data, colKey){
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
                                    value: d.value
                            }
                        });

    return aggData;
}