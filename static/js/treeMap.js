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

// following example is copied from 
// https://www.d3-graph-gallery.com/graph/treemap_basic.html
function renderTreeMap(data){
    var svg = d3
                .select("#accidentsTree")
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

    // use this information to add rectangles:
    let rects = svg
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                    .attr('x', function (d) { return d.x0; })
                    .attr('y', function (d) { return d.y0; })
                    .attr('width', function (d) { return d.x1 - d.x0; })
                    .attr('height', function (d) { return d.y1 - d.y0; })
                    .style("stroke", "black")
                    .style("fill", "#69b3a2");

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

    // creating tool tip
    // http://bl.ocks.org/caged/6476579
    var toolTip = d3.tip()                    
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])                   
                    .html(function(d) {                      
                        return "<table class='toolTipTable'><tr class='toolTipData'><td><strong>City</strong> </td><td><span style='color:red'>" + d.id + "</span></td></tr><tr class='toolTipData'><td><strong>Accidents</strong> </td><td><span style='color:red'>" + d.value + "</span></td></tr></table>"; 
                    });
     // Step 2: Create the tooltip in svg.
    svg.call(toolTip);
    
    rects.on("mouseover", function(d){
               toolTip.show(d, this)
            })// onmouseout event
         .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

}//end of renderTreeMap


