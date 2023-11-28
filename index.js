import { GraphCanvas } from "./src/draw.js";
import { exportGraphToAdjMatrixCSV } from "./src/utils.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
export {context};


let graphCanvas = new GraphCanvas(canvas, context);

window.onmousemove = graphCanvas.moveNode.bind(graphCanvas);
window.onmousedown = graphCanvas.mouseDown.bind(graphCanvas);
window.onmouseup = graphCanvas.mouseUp.bind(graphCanvas);
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    graphCanvas.updateCanvas();
}

setTimeout(() => {
    graphCanvas.drawRandomGraph(4, 0.2);
}, 1000);
resize();
