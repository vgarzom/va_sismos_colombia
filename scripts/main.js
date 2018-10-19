const vis_container = d3.select("#vis-container");
const vis_header = d3.select("#vis-header");

const
    margin = { top: 20, right: 50, bottom: 40, left: 70 },
    chart_width = vis_container.node().getBoundingClientRect().width,
    tooltip_size = { height: 80, width: 150 };
var
    chart_height = vis_container.node().getBoundingClientRect().height - vis_header.node().getBoundingClientRect().height,
    svg = vis_container.append('svg').attr("width", chart_width).attr("height", chart_height);

    svg.style("font", "10px sans-serif")
      .style("width", "100%")
      .style("height", "auto");

const date_parse = d3.timeParse("%Y-%m-%d");
var sismos = [];

d3.csv(
    "assets/data/sismos.csv",
    (d, i) => {
        
        d.magnitude = +d.magnitude;
        if (d.magnitude >= 3){
            d.date = date_parse(d.date);
            sismos.push(d);
        }
    }
).then(() => {
    drawCalendarChart()
});