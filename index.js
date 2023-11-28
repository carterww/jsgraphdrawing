import { GraphCanvas } from "./src/draw.js";
import { FloatingTextbox, RadiusSlider, RandomGraph } from "./src/interaction.js";
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
window.onload = () => {
    /* Set canvas size */
    resize();
    /* Draw a random graph on startup */
    randomGraph.generate();
}
