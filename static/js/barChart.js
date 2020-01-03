// https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
function renderBarChart(data, location){

    d3.select("#barChart").selectAll("svg").remove();


    var svgWidth = 737;
    var svgHeight = 463;

    const svg = d3.select("#barChart")
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
                return d.month;
            }));

    y.domain([0, d3.max(data, function (d) {
                    return d.accCount;
                    })
                ]);
                
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("class", "x axis")
        .append("text")
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
    
    g.selectAll("#barChart")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.month);
        })
        .attr("y", function (d) {
            return y(d.accCount);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {            
            return height - y(d.accCount);
        });

}//end of barTreeMap


// https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
function updateBarChart(data, location){

    var svgWidth = 737;
    var svgHeight = 463;

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };

    const svg = d3.select("#barChart")
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
                return d.month;
            }));

    y.domain([0, d3.max(data, function (d) {
                    return d.accCount;
                    })
                ]);
    
    let rect = d3
                .selectAll("#barChart")
                .selectAll("rect")
                .data(data);            

    rect.exit().remove();

    rect.enter()
        .append("rect")        
        .attr("class", "bar")
        .merge(rect)
        .transition()
        .ease(d3.easeBounce)
        .duration(1000)
        .attr("x", function (d) {
            return x(d.month);
        })
        .attr("y", function (d) {
            return y(d.accCount);
        })        
        .attr("width", x.bandwidth())
        .attr("height", function (d) {            
            return height - y(d.accCount);
        });

    g.select(".y.axis")
            .transition().duration(1500)//.ease("sin-in-out")
            .call(d3.axisLeft(y));

}//end of updateBarChart


