import { IProvenanceGraph, ProvenanceNode } from "provenance_mvvm_framework";
import { d3Selection } from "./../type_declarations/types";
import * as d3 from "d3";

export function createButtons(el: d3Selection, graph: IProvenanceGraph) {
  el.select(".redo").classed("disable", false);
  el.select(".undo").classed("disable", false);

  if (graph.current.children.length === 0) {
    el.select(".redo").classed("disable", true);
  }
  if (graph.current.label === "Root") {
    el.select(".undo").classed("disable", true);
  }
}

export function createGraph(el: d3Selection, graph: IProvenanceGraph) {
  addSvg(el);

  let g = el.select(".graph-group");

  let treeMap = d3.tree().size([500, 1000]);
  let hierarchy = d3.hierarchy(graph.root);
  let nodes = treeMap(hierarchy);

  // adds the links between the nodes
  var link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function(d) {
      return (
        "M" +
        d.x +
        "," +
        d.y +
        "C" +
        d.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.parent.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.parent.x +
        "," +
        d.parent.y
      );
    });

  // adds each node as a group
  var node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  // adds the circle to the node
  node.append("circle").attr("r", 10);

  // adds the text to the node
  node
    .append("text")
    .attr("dy", ".35em")
    .attr("y", function(d) {
      return d.children ? -20 : 20;
    })
    .style("text-anchor", "middle")
    .text(function(d) {
      return d.data.name;
    });

  // let link = graphGroup
  //   .selectAll(".link")
  //   .data(nodes.descendants().slice(1))
  //   .enter()
  //   .append("path")
  //   .attr("d", d => {
  //     return `M ${d.x},${d.y}
  //     C${d.x},${(d.y + d.parent.y) / 2}
  //     ${d.parent.x}, ${(d.y + d.parent.y) / 2}
  //     ${d.parent.x} ${d.parent.y}`;
  //   });

  // let node = graphGroup
  //   .selectAll(".node")
  //   .data(nodes.descendants())
  //   .enter()
  //   .append("g")
  //   .attr("class", d => {
  //     return `node ${d.children ? "node-internal" : "node-leaf"}`;
  //   })
  //   .attr("transform", d => {
  //     return `translate(${d.x}, ${d.y});`;
  //   });

  // node.append("circle").attr("r", 10);

  // node
  //   .append("text")
  //   .attr("y", "0.35em")
  //   .attr("y", d => {
  //     return d.children ? -20 : 20;
  //   })
  //   .style("text-anchor", "middle")
  //   .text((d, i) => {
  //     return i;
  //   });
}

function addSvg(el: d3Selection) {
  let _graphGroup = el.selectAll(".graph-svg").data([1]);
  _graphGroup.exit().remove();
  _graphGroup
    .enter()
    .append("svg")
    .attr("class", "graph-svg")
    .attr("width", "100%")
    .attr("height", "1000")
    .merge(_graphGroup)
    .html("")
    .append("g")
    .attr("class", "graph-group")
    .attr("transform", `translate(20, 20)`);
}
