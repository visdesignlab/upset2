import { IProvenanceGraph, Mitt } from "provenance_mvvm_framework";
import { d3Selection } from "./../type_declarations/types";
import * as d3 from "d3";

export function createButtons(el: d3Selection, graph: IProvenanceGraph) {
  el.select(".redo").classed("has-text-grey", false);
  el.select(".undo").classed("has-text-grey", false);

  if (graph.current.children.length === 0) {
    el.select(".redo").classed("has-text-grey", true);
  }
  if (graph.current.label === "Root") {
    el.select(".undo").classed("has-text-grey", true);
  }
}

export function createGraph(
  el: d3Selection,
  graph: IProvenanceGraph,
  comm: Mitt
) {
  addSvg(el);

  let g = el.select(".graph-group");
  let h = (el.node() as any).getBoundingClientRect().width * 0.9;

  let height = h;
  let width = 150;
  let treeMap = d3.tree().size([width, height]);

  let root = d3.hierarchy(graph.root, d => {
    return d.children;
  });

  let nodes = treeMap(root);

  let link = addLinks(g, nodes);

  let node = addNodes(g, nodes);
  addClickToNodes(node, comm);
  translateNodesToPosition(node);
  addNodeElements(node, graph.current.id);
}

function addNodeElements(node: d3Selection, current: string) {
  node
    .append("circle")
    .attr("r", 5)
    .attr("class", d => {
      if ((d.data as any).id === current) {
        return "current";
      }
      return "";
    });
  node
    .append("text")
    .attr("dy", "0.35em")
    .attr("x", d => {
      return d.children ? -13 : 13;
    })
    .style("text-anchor", d => {
      return d.children ? "end" : "start";
    })
    .text((d, i) => {
      return i;
    });
}

function translateNodesToPosition(node: d3Selection) {
  node.attr("transform", d => {
    return `translate(${d.y}, ${d.x})`;
  });
}

function addClickToNodes(node: d3Selection, comm: Mitt) {
  node.on("click", (d, i) => {
    comm.emit("go-to-node", (d.data as any).id);
  });
}

function addNodes(g: d3Selection, nodes: d3.HierarchyPointNode<{}>) {
  return g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", d => {
      return `node ${d.children ? "node-internal" : "node-leaf"}`;
    });
}

function addLinks(g: d3Selection, nodes: d3.HierarchyPointNode<{}>) {
  return g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
      return `M ${d.y}, ${d.x}
              C ${(d.y + d.parent.y) / 2}, ${d.x} 
                ${(d.y + d.parent.y) / 2}, ${d.parent.x} 
                ${d.parent.y}, ${d.parent.x}`;
    });
}

function addSvg(el: d3Selection) {
  let _graphGroup = el.selectAll(".graph-svg").data([1]);
  _graphGroup.exit().remove();
  _graphGroup
    .enter()
    .append("svg")
    .attr("class", "graph-svg")
    .attr("width", "100%")
    .merge(_graphGroup)
    .html("")
    .append("g")
    .attr("class", "graph-group")
    .attr("transform", `translate(20, 0)`);
}
