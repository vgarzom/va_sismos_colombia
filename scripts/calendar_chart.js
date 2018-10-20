const
    color = d3.scaleSequential(d3.interpolateRdYlGn).domain([8, 0]),
    formatMonth = d3.timeFormat("%b"),
    formatDay = d => "SMTWTFS"[d.getDay()],
    formatDate = d3.timeFormat("%x"),
    format = d3.format("+.2%"),
    cellSize = (chart_width - margin.right - margin.left) / 52,
    height = cellSize * 9;

const countDay = d => d.getDay();
const timeWeek = d3.timeSunday;
var years;

function pathMonth(t) {
    const n = 7;
    const d = Math.max(0, Math.min(n, countDay(t)));
    const w = timeWeek.count(d3.timeYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
        : d === n ? `M${(w + 1) * cellSize},0`
            : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
}

function drawCalendarChart() {
    console.log("from calendar --> " + sismos.length)
    console.log(sismos);

    years = d3.nest()
        .key(d => d.date.getFullYear())
        .entries(sismos)
        .reverse();

    console.log(years);

    chart_height = years.length * height;
    svg.attr("height", chart_height);

    const year = svg.selectAll("g")
        .data(years)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

    year.append("text")
        .attr("x", -5)
        .attr("y", -5)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(d => d.key);

    year.append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map(i => new Date(1995, 0, i)))
        .enter().append("text")
        .attr("x", -5)
        .attr("y", d => (countDay(d) + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .text(formatDay);

    year.append("g")
        .selectAll("rect")
        .data(d => d.values)
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize - 1)
        .attr("id", d => `sismo_${d.id}`)
        .attr("x", d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize + 0.5)
        .attr("y", d => countDay(d.date) * cellSize + 0.5)
        .attr("fill", d => color(d.magnitude))
        .on("mouseover", mouseover)
        .on("mouseleave", resetTooltip);

    const month = year.append("g")
        .selectAll("g")
        .data(d => d3.timeMonths(d3.timeMonth(d.values[0].date), d.values[d.values.length - 1].date))
        .enter().append("g");

    month.filter((d, i) => i).append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .attr("d", pathMonth);

    month.append("text")
        .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
        .attr("y", -5)
        .text(formatMonth);

}

function mouseover(d) {
    updateTooltip(d);
}
