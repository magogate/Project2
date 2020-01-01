// https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
function barChart(data, location){

    

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

    console.log(data)

    const svg = d3.select("#barChart")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height);

    var g = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);

    var y = d3.scaleLinear()
                .rangeRound([height, 0]);

    x.domain(data.map(function (d) {
                return Number(d.month);
            }));

    y.domain([0, d3.max(data, function (d) {
                return d.accCount;
            })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Speed");
    
    g.selectAll("#barChart")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x( Number(d.month) );
        })
        .attr("y", function (d) {
            return y(Number(d.accCount));
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(Number(d.accCount));
        });

}//end of barTreeMap
