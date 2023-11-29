import { GraphCanvas } from "./src/draw.js";
import { FloatingTextbox, RadiusSlider, RandomGraph, Menu } from "./src/interaction.js";
import { exportGraphToAdjMatrixCSV } from "./src/utils.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let graphCanvas = new GraphCanvas(canvas, context);

canvas.onmousemove = graphCanvas.moveNode.bind(graphCanvas);
canvas.onmousedown = graphCanvas.mouseDown.bind(graphCanvas);
canvas.onmouseup = graphCanvas.mouseUp.bind(graphCanvas);
window.onresize = resize;

document.getElementById("clear-btn").onclick = () => {
    graphCanvas.clearCanvas();
}

document.getElementById("save-btn").onclick = () => {
    exportGraphToAdjMatrixCSV(graphCanvas.nodes, graphCanvas.edges);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    graphCanvas.updateCanvas();
}

let radiusSlider = new RadiusSlider(document.getElementById("radius-slider"),
    document.getElementById("radius-value"), graphCanvas);
let textBox = new FloatingTextbox(document.getElementById("floating-textbox"),
    document.getElementById("floating-header"), radiusSlider);
let randomGraph = new RandomGraph(document.getElementById("node-count"),
    document.getElementById("edge-count"), document.getElementById("random-graph-btn"),
    graphCanvas);

let menuButtons = Array.from(document.getElementById("floating-menu").children);
let menuContents = Array.from(document.getElementById("floating-content").children);
menuButtons.push(document.getElementById("minimize"));
let buttonsParent = document.getElementById("floating-menu");
let contentsParent = document.getElementById("floating-content");

let menu = new Menu(buttonsParent, menuButtons, contentsParent, menuContents, graphCanvas, textBox);


window.onload = () => {
    /* Set canvas size */
    resize();
    /* Draw a random graph on startup */
    randomGraph.generate();
}
