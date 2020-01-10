//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

function tabulate(dataSet, id, columns, dataname) {
    
    var tableData = [];
    var table = d3.select('#' + id)
                    .append('table')
                        .attr("class", "tableLegend")
                        .attr("style", "margin-top: 40px");

    var thead = table.append('thead');

    var tbody = table.append('tbody');
    
    let cnt = 0

    // console.log(dataSet)
  
    dataSet.map(function (d) {    
      let myJson = {}    
        // myJson[dataname] = d + "~" + desc[cnt];        
        myJson[dataname] = d.time;        
        myJson["Color"] = _dashboard.segColor(d.time, cnt, dataname);      
        tableData.push(myJson);
        cnt++;
    })  

    // console.log(tableData)
    
    // append the header row
    thead.append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .attr("style", function (d) { 
                        return (d.startsWith("Color") == false) ? "border: 0;" : "border: 0; width: 80%; margin: 0 auto 0 auto" 
                    })
            .text(function (column) { 
                        return column; 
                    })
            .attr("style", "font-size: 13px")
  
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
                    .data(tableData)
                    .enter()
                    .append('tr');
  
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
                    .data(function (row) {
                        return columns.map(
                            function (column) {
                                return { column: column, value: row[column] };
                        });
                    })
                    .enter()    
                    .append('td')
                    .append('div')    
                    .attr("style", function (d) {      
                        return (d.value.startsWith("#") == false) ? "background: #005691" : "width: 60%; margin: 0 auto 0 auto; height: 20px; background: " + d.value; 
                    })    
                    .text(function (d) { 
                        return (d.value.startsWith("#") == false) ? d.value.substring(d.value.indexOf("~")+1, d.value.length) : ""; 
                    });
  
    return table;
  }
  