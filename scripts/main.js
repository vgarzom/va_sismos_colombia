const vis_container = d3.select("#vis-container");
const vis_header = d3.select("#vis-header");

const
    margin = { top: 20, right: 50, bottom: 40, left: 70 },
    chart_width = vis_container.node().getBoundingClientRect().width;
var
    chart_height = vis_container.node().getBoundingClientRect().height - vis_header.node().getBoundingClientRect().height,
    svg = vis_container.append('svg').attr("width", chart_width).attr("height", chart_height);

svg.style("font", "10px sans-serif")
    .style("width", "100%")
    .style("height", "auto");

var minMagnitude = 3;
var maxMagnitude = 8;
var minDepth = 0;
var maxDepth = 20;

const date_parse = d3.timeParse("%Y-%m-%d");
var sismos = [];
var firstTime = true;

d3.select("#min-magnitude-input").node().value = minMagnitude;
d3.select("#max-magnitude-input").node().value = maxMagnitude;
d3.select("#min-depth-input").node().value = minDepth;
d3.select("#max-depth-input").node().value = maxDepth;

updateData();

function updateData() {
    sismos = [];
    d3.csv(
        "assets/data/sismos.csv",
        (d, i) => {

            d.magnitude = +d.magnitude;
            d.depth = +d.depth;
            d.id = i;
            d.key = +d.key;
            if (d.magnitude >= minMagnitude && d.magnitude <= maxMagnitude
                && d.depth >= minDepth && d.depth <= maxDepth) {
                d.date = date_parse(d.date);
                sismos.push(d);
            }
        }
    ).then(() => {
        drawCalendarChart();
        createTooltip(svg);
    });
}

function controlsChanged() {
    minMagnitude = d3.select("#min-magnitude-input").node().value;
    maxMagnitude = d3.select("#max-magnitude-input").node().value;
    minDepth = d3.select("#min-depth-input").node().value;
    maxDepth = d3.select("#max-depth-input").node().value;
    updateData();
}