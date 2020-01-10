//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

// following example is copied from 
// https://www.d3-graph-gallery.com/graph/treemap_basic.html
function renderTreeMap(data, id, location){

    var svgWidth = 737;
    var svgHeight = 463;
    
    var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;    

    var color = d3.scaleOrdinal(d3.schemeCategory10)
    

    d3.select("#"+id).selectAll("svg").remove();

    var svg = d3
                .select("#"+id)
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");;  

    //   https://observablehq.com/@d3/d3-stratify
    var root = d3.stratify()
                        .id(function(d) { return d.child; })   // Name of the entity (column name is name in csv)
                        .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
                        (data);

    root.sum(function(d) { return +d.value }) 

    d3.treemap()
            .size([width, height])
            .padding(4)
            (root)    

    // console.log(root)

    // use this information to add rectangles:
    let rects = svg
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")                    
                    .attr('x', function (d) { return d.x0; })
                    .attr('y', function (d) { return d.y0; });
                // https://stackoverflow.com/questions/22645162/d3-when-i-add-a-transition-my-mouseover-stops-working-why
                rects.transition()
                    // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
                    .ease(d3.easeBounce)
                    .duration(1000)  
                    .attr('width', function (d) { return d.x1 - d.x0; })
                    .attr('height', function (d) { return d.y1 - d.y0; })
                    .style("stroke", "black")
                    // .style("fill", "#69b3a2");
                    // https://observablehq.com/@d3/stretched-treemap
                    .attr("fill", function(d) {
                                                return color(d.data.child); 
                                            });

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0 + 2})    
            .attr("y", function(d){ return d.y1 - 4})    // positioning text at bottom of a rectangle
            .text(function(d){ 
                    return ((d.x1 - d.x0) > 32) ? d.data.child : "";
                })
            .attr("font-size", "12px")
            // .attr("font-weight", "bold")
            .attr("fill", "white")

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
        }

    
    // creating tool tip
    // http://bl.ocks.org/caged/6476579
    var toolTip = d3.tip()                    
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])                   
                    .html(function(d) {                      
                        return "<table class='toolTipTable'><tr class='toolTipData'><td><strong>" + location + "</strong> </td><td><span style='color:black'>" + d.id + "</span></td></tr><tr class='toolTipData'><td><strong>Accidents</strong> </td><td><span style='color:black'>" + d.value + " (" + d.data.percentage +"%)</span></td></tr></table>"; 
                    });
     // Step 2: Create the tooltip in svg.
    svg.call(toolTip);    
    
    rects.on("mouseover", function(d){
            toolTip.show(d, this)
         })// onmouseout event
        .on("mouseout", function(data, index) {
             toolTip.hide(data);
         });

    // sleep(2000).then(() => {
    //     rects.on("mouseover", function(d){
    //         toolTip.show(d, this)
    //      })// onmouseout event
    //   .on("mouseout", function(data, index) {
    //          toolTip.hide(data);
    //      });
    // });

}//end of renderTreeMap