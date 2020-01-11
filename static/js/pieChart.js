//  Created By: 
//      Grettel Canepari
//      Katherine Lee
//      Mandar Gogate
//      Petra Alex
//      Preet Puri
//      Sweta Shekhar
//  Created On: 01/01/2020
//  Updated On: 01/10/2020

// https://bl.ocks.org/mbostock/1346410
// https://bl.ocks.org/adamjanes/5e53cfa2ef3d3f05828020315a3ba18c/22619fa86de2045b6eeb4060e747c5076569ec47

// var pieChartColor = ["#111d5e","#b21f66","#fe346e","#ffbd69"]
            
function rederPieChart(data, id, colName){

    console.log(data)

    let svgWidth = 350;
    let svgHeight = 350;

    let margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    // let data = [
    //         {"year": 2018, "count": 100},
    //         {"year": 2019, "count": 50}
    //     ]
    

    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    let radius = Math.min(width, height) / 2;

    //Mouseover tip
    var tip = d3.tip()
                .attr('class', 'd3-tip-pie')
                .offset([80, 40])
                .html(function (d) {
                    var str = "" + d.data.accCounts + " (" + d.data.percentage + "%)";
                        (d.data.time == "Bad" || d.data.time == "Clear") ?
                        str += "<br><strong> Weather Conditions : " + d.data.time + "</strong>" :
                        str += "<br><strong> Accident Year : " + d.data.time + "</strong>";
                    return str;
                });


    let dataname = "Time"
    let pieChartColor = []
    let cnt = 0;
    data.map(function (d) {    
        let myJson = {}    
          // myJson[dataname] = d + "~" + desc[cnt];            
          myJson[dataname] = d.child;        
          myJson["Color"] = _dashboard.segColor(d.time, cnt, dataname);      
          pieChartColor.push(myJson.Color);
          cnt++;
      })  

    let color = d3.scaleOrdinal(pieChartColor);

    let arc = d3.arc()
                    .innerRadius(radius - 95)
                    .outerRadius(radius - 50);    

    const pie = d3.pie()
                    .value(d => d.accCounts)
                    .sort(null);

    function arcTween(a) {
                    const i = d3.interpolate(this._current, a);
                    this._current = i(1);
                    return (t) => arc(i(t));
                }


    // d3.select("#accTimePie").selectAll("svg").remove();

    const svg = d3.select("#" + id)//accTimePie")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                    .append("g")
                        .attr("transform", `translate(${width / 2.7}, ${height / 2})`);
    svg.call(tip);            

    function update() {
                // Join new data                
            const path = svg.selectAll("path")
                            .data(pie(data));

            // Update existing arcs
            path.transition().duration(200).attrTween("d", arcTween);

            // Enter new arcs
            path.enter().append("path")
                        .attr("fill", (d, i) => color(i))
                        .attr("d", arc)
                        .attr("stroke", "white")
                        .attr("stroke-width", "1px")
                        .each(function(d) { this._current = d; })
                        .style('cursor', 'pointer')
                        .on('click', function (d) {
                            d3.selectAll(this.parentNode.childNodes)
                              .attr("stroke-width", "1px")
                              .style("filter", "");
          
                            d3.select(this)
                              .attr("stroke-width", "2px")
                              .attr("stroke", "#Aer446")
                              .style("filter", "url(#drop-shadow)");

                            //   console.log(d.data.time)

                            filterList[colName] = d.data.time;
                            filterData();
                            //return thisChart.click(d);
                          })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);
    }//end of update            

    update()

    /* drop shadow start */

    var defs = svg.append("defs");

    // 	black drop shadow
    var filter = defs.append("filter")
                    .attr("id", "drop-shadow");

        filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 2)
                .attr("result", "blur");
    
        filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 4)
                .attr("dy", 4)
                .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

            feMerge
                .append("feMergeNode")
                .attr("in", "offsetBlur");

            feMerge
                .append("feMergeNode")
                .attr("in", "SourceGraphic");

     /* drop shadow end*/
}

//to update data.. created a seperate function.
function updatePieChart(data, id, colName){

    let svgWidth = 350;
    let svgHeight = 350;

    let margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    let radius = Math.min(width, height) / 2;

    // console.log("inside pie update call...")
    // console.log(filterList[colName] == null);
    // console.log(filterList[colName] == undefined);
    // console.log(filterList[colName] == "");

    (filterList[colName] == "") ? d3.select("#"+id).selectAll("path").attr("stroke-width", "1px").style("filter", "") : true;

    //Mouseover tip
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([80, 40])
                .html(function (d) {
                    var str = "" + d.data.accCounts + " (" + d.data.percentage + "%)";
                    str += "<br><strong>Time: " + d.data.time + "</strong>";
                    return str;
                });

    let pieChartColor = []
    let cnt = 0;
    let dataname = "Time"
    data.map(function (d) {    
        let myJson = {}    
          myJson[dataname] = d.child;        
          myJson["Color"] = _dashboard.segColor(d.time, cnt, dataname);      
          pieChartColor.push(myJson.Color);
          cnt++;
      })  

    let color = d3.scaleOrdinal(pieChartColor);

    let arc = d3.arc()
                    .innerRadius(radius - 95)
                    .outerRadius(radius - 50);

    const pie = d3.pie()
                    .value(d => d.accCounts)
                    .sort(null);

    function arcTween(a) {
                    const i = d3.interpolate(this._current, a);
                    this._current = i(1);
                    return (t) => arc(i(t));
                }

    const svg = d3.select("#"+id)//accTimePie")
                    .selectAll("svg");
    
    svg.call(tip);          
                    
    const path = svg.selectAll("path")
                    .data(pie(data));

    // Update existing arcs
    path.transition().duration(200).attrTween("d", arcTween);

    // Enter new arcs
    path.enter().append("path")
                .attr("fill", (d, i) => color(i))
                .attr("d", arc)
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .each(function(d) { this._current = d; });

}//end of updatePieChart