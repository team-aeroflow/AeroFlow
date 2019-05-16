import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'

const graph = require('./test.json')
let link, node, lables, circle, simulation;

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xCenter: [500, 300, 100],
      colorScale: ['orange', 'lightblue', '#B19CD9'],
      txt: ['Function', 'Action', 'Effect'],
      type: {
        function: 0,
        action: 1,
        effect: 2,
      },
      width: 800,
      height: 700,
      graph: {}
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { graph } = props
    if (state !== props && graph !== undefined) {
      return {
        ...state,
        graph
      }
    } else {
      return state
    }
  }

  componentDidUpdate() {
    this.init()
    this.initSimulation()
    this.countEffect()
    // console.log(this.state)
    const { graph } = this.state
    this.updateLink(graph.links)
    this.updateNode(graph.nodes)

    simulation.nodes(graph.nodes)
      .on("tick", ticked)

    simulation.force("link")
      .links(graph.links)
      .distance(150)

    function ticked() {
      link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      node
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
    }
  }

  init() {
    // const { width, height } = this.props
    const { xCenter, txt, width, height } = this.state

    const body = d3.select('body')
      .select('#root')
      .select('.App-header')
      .select('.dashboard')
      .select('.graph-section')
      .append('div')
      .attr('id', 'content')
      .style('background-color', 'white')

    const svg = body.append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible')


    svg.selectAll('text')
      .data(txt)
      .enter().append('text')
      .attr("x", function (d, i) { return xCenter[i] })
      .attr("y", 50)
      .text(function (d) { return d });
  }

  initSimulation() {
    // const { width, height } = this.props
    const { xCenter, type, width, height } = this.state

    simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function (d) { return d.id }).distance(100).strength(1).iterations(1))
      .force('charge', d3.forceManyBody().strength(-40))
      .force('x', d3.forceX().x(function (d) {
        return xCenter[type[d.type]]
      }))
      .force('collide', d3.forceCollide().strength(1).radius(5).iterations(10))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  countEffect() {
    const sum_effect = graph.nodes.filter((i) => {
      return i.type === 'effect'
    })
    const sum_action = graph.nodes.filter((i) => {
      return i.type === 'action'
    })
    const sum_function = graph.nodes.filter((i) => {
      return i.type === 'function'
    })

    const div_count = d3.select('body')
      .append('div')
    div_count.append('h2')
      .text(`Action: ${sum_action.length}`)
    div_count.append('h2')
      .text(`Effect: ${sum_effect.length}`)
    div_count.append('h2')
      .text(`Function: ${sum_function.length}`)
  }

  updateLink(links) {
    link = d3.select('svg')
      .append('g')
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr("stroke-width", function (d) { return 2 });
  }

  updateNode(nodes) {
    const { colorScale, type } = this.state
    node = d3.select('svg')
      .append('g')
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")

    circle = node.append("circle")
      .attr("r", 20)
      .attr("fill", function (d) { return colorScale[type[d.type]] })
      .call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended))

    lables = node.append("text")
      .text(function (d) {
        return d.name;
      })
      .attr('x', 6)
      .attr('y', 3)
      .call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended))

    node.append("title")
      .text(function (d) { return d.id; })

      
  }

  dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  render() {
    const { graph } = this.props
    // console.log(graph)
    console.log(this.state.graph)
    return (
      <div></div>
    )
  }
}

function mapStateToProps(state) {
  const { effects } = state.dashboard
  return {
    effects,
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapDispatchToProps, mapDispatchToProps)(Graph)