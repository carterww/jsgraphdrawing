import { GraphCanvas } from "./src/draw.js";
import { exportGraphToAdjMatrixCSV } from "./src/utils.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let graphCanvas = new GraphCanvas(canvas, context);

canvas.onmousemove = graphCanvas.moveNode.bind(graphCanvas);
canvas.onmousedown = graphCanvas.mouseDown.bind(graphCanvas);
canvas.onmouseup = graphCanvas.mouseUp.bind(graphCanvas);
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    graphCanvas.updateCanvas();
}

var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var floatingHeader = document.getElementById('floating-header');
var floatingDiv = document.getElementById('floating-textbox');

function dragTextBoxMouseDown(e) {
    if (!e) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = dragTextBoxMouseUp;
    document.onmousemove = dragTextBoxMouseMove;
}

function dragTextBoxMouseMove(e) {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    floatingDiv.style.top = (floatingDiv.offsetTop - pos2) + "px";
    floatingDiv.style.left = (floatingDiv.offsetLeft - pos1) + "px";
}

function dragTextBoxMouseUp(e) {
    if (!e) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    document.onmouseup = null;
    document.onmousemove = null;
}

floatingHeader.onmousedown = dragTextBoxMouseDown;
/* Position the div 20px from the bottom */
floatingDiv.style.top = Math.floor(window.innerHeight - floatingDiv.offsetHeight - 20) + "px";
document.getElementById('radius-slider').value = graphCanvas.radius;
document.getElementById('radius-value').innerHTML = graphCanvas.radius.toString() + "px";
document.getElementById('radius-slider').oninput = function(e) {
    graphCanvas.changeRadius(e.target.value);
    document.getElementById('radius-value').innerHTML = e.target.value + "px";
    graphCanvas.updateCanvas();
}

setTimeout(() => {
    graphCanvas.drawRandomGraph(4, 0.2);
}, 1000);
resize();
