//transition animation

let clubList = {}
window.dataset.forEach(player => {
  if (!clubList.hasOwnProperty(player['Club'])) {
    clubList[player['Club']] = {
      total: 1,
      players: []
    }
    clubList[player['Club']].players.push({
      name: player['Shirt Name'],
      team: player['Team'],
      position: player['Pos.']
    })
  } else {
    clubList[player['Club']].total += 1
    clubList[player['Club']].players.push({
      name: player['Shirt Name'],
      team: player['Team'],
      position: player['Pos.']
    })
  }
});

let data = Object.keys(clubList).map((val, index) => {
  var obj = {}
  obj.club = val
  obj.totalPlayer = clubList[val]
  return obj
})

function pieTween(trans) {
  trans.innerRadius = 0;
  var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, trans);
  return function (param) {
    return arc(i(param))
  }
}

// color range
var color = d3.scaleOrdinal()
  .range(['red', 'blue', "orange", "pink", "teal", "yellow", "#1E88E5", "#1eaa19"]);

//set up margin dan radius circle

var margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 750 - margin.right - margin.left,
  height = 750 - margin.top - margin.bottom,
  radius = width / 2;

// make arc generator before create the pie

var arcDonut = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70)

var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 200)

var labelArc = d3.arc()
  .outerRadius(radius - 50)
  .innerRadius(radius - 75)

// pie generator 
var pie = d3.pie()
  .sort(null)
  .value(function (d) {
    return d.totalPlayer.total
  })

// creating the svg
var svg = d3.select("#app")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g") //to group similar elements together
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

var g = svg.selectAll(".arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc")

//appending path of arc
g.append("path")
  .attr("d", arc)
  .style("fill", function (d) {
    return color(d.data.club)
  })
  .transition()
  .ease(d3.easeLinear)
  .duration(2000)
  .attrTween("d", pieTween)

//append the text (labels)
g.append("text")
  .transition()
  .ease(d3.easeLinear)
  .duration(2000)
  .attr("transform", function (d) {
    return "translate(" + labelArc.centroid(d) + ")"
  })
  .attr("dy", ".35em")
  .text(function (d) {
    return d.data.club + ' : ' + d.data.totalPlayer.total
  })

g.on("mouseover", function (d) {
  let currentEl = d3.select(this);
  currentEl.attr("style", "fill-opacity:0.5;");
})

g.on("click", function (d) {
  d3.selectAll('.detail').remove()
  d3.selectAll('table').remove()
  let currentEl = d3.select(this);
  currentEl.attr("style", "fill-opacity:0.5;");
  let currentPlayerList = d.data.totalPlayer.players
  let table = d3.select('#desc')
    .append('table')
    .attr('id', 'players')

  table.append('tr')
    .append('th')
    .attr('colspan', 3) // appends paragraph for each data element
    .text(d.data.club)

  table.append('th')
    .text('Name')
  table.append('th')
    .text('Position')
  table.append('th')
    .text('Country')

  let player = table.selectAll('tr')
    .data(currentPlayerList)
    .enter()
    .append('tr')
    .html((d, i) => '<td>' + d.name + '</td>' + '<td>' + d.position + '</td>' + '<td>' + d.team + '</td>')
})

g.on("mouseout", function (d) {
  var currentEl = d3.select(this);
  currentEl.attr("style", "fill-opacity:1;");
})



