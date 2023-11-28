
export class FloatingTextbox {
    element;
    headerElement;
    positions;
    radiusSlider;

    constructor(element, headerElement, radiusSlider) {
        this.element = element;
        this.headerElement = headerElement;
        this.headerElement.onmousedown = this.mouseDown.bind(this);
        this.positions = [0, 0, 0, 0];
        this.radiusSlider = radiusSlider;
        this.setInitialPosition();
    }

    mouseDown(e) {
        if (!e) return;
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        this.positions[2] = e.clientX;
        this.positions[3] = e.clientY;
        document.onmouseup = this.mouseUp.bind(this);
        document.onmousemove = this.move.bind(this);
    }

    move(e) {
        if (!e) return;
        e.preventDefault();
        e.stopPropagation();
        this.positions[0] = this.positions[2] - e.clientX;
        this.positions[1] = this.positions[3] - e.clientY;
        this.positions[2] = e.clientX;
        this.positions[3] = e.clientY;
        this.element.style.top = (this.element.offsetTop - this.positions[1]) + "px";
        this.element.style.left = (this.element.offsetLeft - this.positions[0]) + "px";
    }

    mouseUp(e) {
        if (!e) return;
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        document.onmouseup = null;
        document.onmousemove = null;
    }

    setInitialPosition() {
        /* 20px from the bottom */
        this.element.style.top = Math.floor(window.innerHeight - this.element.offsetHeight - 20) + "px";
    }


}

export class RadiusSlider {
    graphCanvas;
    sliderElement;
    displayElement;

    constructor(sliderElement, displayElement, graphCanvas) {
        this.sliderElement = sliderElement;
        this.displayElement = displayElement;
        this.graphCanvas = graphCanvas;
        this.sliderElement.oninput = this.updateRadius.bind(this);
        this.sliderElement.value = graphCanvas.radius;
        this.changeRadiusDisplay(graphCanvas.radius.toString());
    }

    updateRadius(e) {
        this.graphCanvas.changeRadius(e.target.value);
        this.changeRadiusDisplay(e.target.value);
    }

    changeRadiusDisplay(radius) {
        this.displayElement.innerText = radius + "px";
    }
}

const DEFAUlT_NODE_COUNT = 6;
const DEFAULT_EDGE_PROB = 0.4;

export class RandomGraph {
    numberOfNodes;
    edgeProb;

    graphCanvas;
    numberOfNodesInput;
    edgeProbInput;
    generateButton;

    constructor(numberOfNodesInput, edgeProbInput, generateButton, graphCanvas) {
        this.numberOfNodes = DEFAUlT_NODE_COUNT;
        this.edgeProb = DEFAULT_EDGE_PROB;

        this.numberOfNodesInput = numberOfNodesInput;
        this.edgeProbInput = edgeProbInput;
        this.generateButton = generateButton;
        this.graphCanvas = graphCanvas;

        this.numberOfNodesInput.value = this.numberOfNodes;
        this.edgeProbInput.value = this.edgeProb;

        this.numberOfNodesInput.oninput = this.updateNumberOfNodes.bind(this);
        this.edgeProbInput.oninput = this.updateEdgeProb.bind(this);
        this.generateButton.onclick = this.generate.bind(this);
    }

    updateNumberOfNodes(e) {
        const num = parseInt(e.target.value);
        if (num < 0) num = 0;
        if (num > 1000) num = 1000;
        this.numberOfNodes = num;
    }

    updateEdgeProb(e) {
        const prob = parseFloat(e.target.value);
        if (prob < 0) prob = 0;
        if (prob > 1) prob = 1;
        this.edgeProb = prob;
    }

    generate(e) {
        this.graphCanvas.drawRandomGraph(this.numberOfNodes, this.edgeProb);
    }
}
