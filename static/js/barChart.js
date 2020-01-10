//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

// https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
function renderBarChart(data, id, xAxisCol, yHeightCol, location){

    d3.select("#" + id).selectAll("svg").remove();


    var svgWidth = 737;
    var svgHeight = 463;

    const svg = d3.select("#" + id)
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);
    
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };
    
    width = +svg.attr("width") - margin.left - margin.right;
    height = +svg.attr("height") - margin.top - margin.bottom;    

    var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);

    var y = d3.scaleLinear()
                .rangeRound([height, 0]);

    x.domain(data.map(function (d) {
                return d[xAxisCol];
            }));

    y.domain([0, d3.max(data, function (d) {
                    return d[yHeightCol];
                    })
                ]);
                
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("class", "x axis")
        .append("text")
        .attr("class", "xaxisText")
        .attr("fill", "#fff")
        // .attr("transform", "rotate(-90)")
        .attr("x", 6)
        .attr("dx", "12em")
        .attr("text-anchor", "end")
        .attr("transform", "translate(" + width/3.5 + ",29)")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Months");

    g.append("g")
        .call(d3.axisLeft(y))
        .attr("class", "y axis")
        .append("text")
        .attr("fill", "#fff")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-3.7em")
        .attr("text-anchor", "end")
        .attr("transform", "translate(0," + height/2.5 + ") rotate(-90)")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Accidents");
    
    const rect = g.selectAll("#" + id)
                    .data(data)
                    .enter()
                    .append("rect");

                rect.attr("class", function(d){                        
                        // let time = d3.select("#selectTime").property("value");                        
                        // console.log(filterList.month);
                        // console.log(time);
                        // (filterList.month != "" && time != "All") ? console.log(d) : true
                        return "bar";
                    })
                    .attr("x", function (d) {
                        return x(d[xAxisCol]);
                    })
                    .attr("y", function (d) {
                        return y(d[yHeightCol]);
                    })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) {            
                        return height - y(d[yHeightCol]);
                    })
                    .on("click", function(d){                        
                        if(d.month != undefined){
                            // console.log(d.month)
                            filterList[xAxisCol] = d.month;
                            filterData();     
                        }                        
                    });

                    // and to add the text labels
                svg.selectAll(".toolTipText").remove();

                svg              
                    .selectAll(".text")
                    .data(data)
                    .enter()
                    .append("text")
                        .attr("x", function(d){ return x(d[xAxisCol])+70 })    
                        .attr("y", function(d){ return y(d[yHeightCol]) + 15 })    // positioning text at bottom of a rectangle
                        .text(function(d){                                
                                return d[yHeightCol];
                            })
                        .attr("font-size", "12px")
                        // .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .attr("class","toolTipText")

}//end of barTreeMap


// https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
function updateBarChart(data, id, xAxisCol, yHeightCol, location){

   

    var svgWidth = 737;
    var svgHeight = 463;

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };    

    const svg = d3.select("#" + id)
                    .select("svg")
    
    const g = svg.selectAll("g")
    
    width = +svg.attr("width") - margin.left - margin.right;
    height = +svg.attr("height") - margin.top - margin.bottom;    

    var x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);

    var y = d3.scaleLinear()
                .rangeRound([height, 0]);

    x.domain(data.map(function (d) {
                return d[xAxisCol];
            }));

    y.domain([0, d3.max(data, function (d) {
                    return d[yHeightCol];
                    })
                ]);
    
    let rect = d3
                .selectAll("#" + id)
                .select("svg")
                .select("g")
                .selectAll("rect")
                .data(data);            

    rect.exit().remove();

    let bars = rect.enter()
                    .append("rect")        
                    .attr("class", function(d){
                        let time = d3.select("#selectTime").property("value");                        
                        // console.log(filterList.month);
                        // console.log(time);
                        // (filterList.month != "" && time != "All") ? console.log(d) : true
                        return "bar";
                    })
                    .merge(rect);

            bars.transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr("x", function (d) {
                    return x(d[xAxisCol]);
                })
                .attr("y", function (d) {
                    return y(d[yHeightCol]);
                })        
                .attr("width", x.bandwidth())
                .attr("height", function (d) {            
                    return height - y(d[yHeightCol]);
                })
                .attr("class", function(d){
                    let time = d3.select("#selectTime").property("value");                        
                    // console.log(filterList.month);
                    // console.log(time);
                    // https://www.w3schools.com/js/js_dates.asp
                    // https://stackoverflow.com/questions/24998624/day-name-from-date-in-js
                    let weekday;
                    (filterList.month != "" && time != "All") ? weekday = (new Date(time, filterList.month-1, d.day).getDay()) : true;
                    // (filterList.month != "" && time != "All") ? console.log(new Date(time, filterList.month-1, d.day)) : true;
                    return (weekday == 0 || weekday == 6) ? "barweekend" : "bar";
                })
                // .on("click", function(d){
                    // console.log(d)
                    // filterList[xAxisCol] = d.month;
                    // console.log(filterList)
                // });

    g.select(".y.axis")
            .transition().duration(1500)//.ease("sin-in-out")
            .call(d3.axisLeft(y));
            

    g.select(".x.axis")
            .transition().duration(1500)//.ease("sin-in-out")
            .call(d3.axisBottom(x));
    
    g.select(".xaxisText")
                .text(function(d){
                    return (id == "barChartDay") ? "Days" : "Months";
                });

    // and to add the text labels
    svg.selectAll(".toolTipText").remove();
            
    svg              
        .selectAll(".text")
        .data(data)
        .enter()
        .append("text")
            .attr("x", function(d){ return (id == "barChartDay") ? x(d[xAxisCol]) + 60 : x(d[xAxisCol])+70; })    
            .attr("y", function(d){ return y(d[yHeightCol]) + 15 })    // positioning text at bottom of a rectangle
            .text(function(d){                                
                    return d[yHeightCol];
                })
            .attr("font-size", "12px")
            // .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("class","toolTipText")

}//end of updateBarChart


