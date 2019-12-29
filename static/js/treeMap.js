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


function renderTreeMap(data){
    var svg = d3
                .select("#accidentsTree")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");;  

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
    svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { console.log(d.x1 - d.x0); return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#69b3a2");

    // and to add the text labels
    svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
        .attr("x", function(d){ return d.x0})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y1})    // +20 to adjust position (lower)
        .text(function(d){ 
                return ((d.x1 - d.x0) > 32) ? d.data.child : "";
            })
        .attr("font-size", "15px")
        .attr("fill", "white")

}


// following example is copied from 
// https://www.d3-graph-gallery.com/graph/treemap_basic.html
function renderOldTreeMap(){

    var svg = d3
    .select("#accidentsTree")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);  
  
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_hierarchy_1level.csv').then(function(data) {
        console.log(data)

        var root = d3.stratify()
                        .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
                        .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
                        (data);
                        
        root.sum(function(d) { return +d.value }) 
        console.log(root)

        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)    
        
        // use this information to add rectangles:
        svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { console.log(d.x1 - d.x0); return (d.x1 - d.x0); })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#69b3a2");

        // and to add the text labels
        svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.name})
            .attr("font-size", "10px")
            .attr("fill", "white")
    })
}//end of renderTreeMap

