//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

function renderScatterChart(myData, id, xAxisCol, yHeightCol, location){

    console.log(myData);
    console.log(myData[0]);
    

    d3.select("#"+ id).selectAll("svg").remove();

    var svgWidth = 737;
    var svgHeight = 463;

    
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };
    

    const svg = d3.select("#" + id)
                    .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`); 
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;  

      // Create scaling functions
    var xLinearScale = d3.scaleLinear()
                        // .domain([0, d3.max(myData, d => d[xAxisCol])])
                        .domain([0, 100])
                        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
                        // .domain([0, d3.max(myData, d => d[yHeightCol])])
                        .domain([0, 40000])
                        .range([height, 0]);

    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var toolTip = d3.tip()
                        .attr("class", "tooltip")
                        .offset([10, -15])
                        .html(function(d) {
                        // console.log(d)
                            return (`<div style="background-color: black;"><p class="toolTip" style="margin-top: 0em; margin-bottom: 0em;">${d.child}</p><hr style="border-color: azure; margin-top: 0em; margin-bottom: 0em;"><p class="toolTip" style="margin-top: 0em; margin-bottom: 0em;">Accidents : ${d.value}</p><p class="toolTip" style="margin-top: 0em; margin-bottom: 0em;">Population: ${d.population}</p><div>`);
                        });

  // https://github.com/Caged/d3-tip/issues/187
  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Add x-axis
  var xAxis = chartGroup.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis);

  // Add y1-axis to the left side of the display
  var yAxis = chartGroup.append("g")
                        // Define the color of the axis text
                        .classed("green", true)
                        .call(leftAxis);

    // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
                                .data(myData)
                                .enter()
                                .append("circle")
                                .attr("cx", d => xLinearScale(d[xAxisCol]))
                                // .attr("cy", d => yLinearScale(d[yHeightCol]))
                                .attr("cy", function(d){
                                        // console.log(d);
                                        return yLinearScale(d[yHeightCol]);
                                    })
                                .attr("r", 10)
                                .attr("fill", "#00008b")
                                .attr("opacity", ".9");   

  // here I am using .text in selectALl; there is no such class as such called .text
        // but if I use text, there are already other text attributes exists in html page
        // due to which when I am doing data binding, and calling enter()
        // it is considering prior text dom elements and ignoring them
        // so enter method is finding only few orphan text and binding data against it
        // which is in-correct. we need d3 to bind all data points to new text
        // and to ignore earlier existing text dom elements
        // since in below case there is no .text class exists, d3 will consider no 
        // dom elements exists for data bind, so it will create those many dom elements
        // [by calling append method ] based on available data elemeents
// var textGroups = chartGroup.selectAll(".text")
//                     .data(data)
//                     .enter()
//                     .append("text")
//                     // .attr("x", d => xLinearScale(d.poverty))
//                     .attr("x", function(d){
//                                     // console.log(d)
//                                     return xLinearScale(d.poverty)
//                                 })
//                     .attr("y", d => yLinearScale(d.healthcare))                                     
//                     .text(d => d.abbr)
//                     .attr("font-family", "sans-serif")
//                     .attr("font-size", "10px")
//                     .attr("fill", "white")
//                     .attr("weight", "bold")
//                     // https://stackoverflow.com/questions/16620267/how-to-center-text-in-a-rect-element-in-d3
//                     .attr("text-anchor", "middle");

circlesGroup.on("mouseover", function(d){
                toolTip.show(d, this)
            })// onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });


}//end of barTreeMap

