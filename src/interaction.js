export class FloatingTextbox {
    element;
    headerElement;
    positions;
    radiusSlider;
    isMinimized;

    constructor(element, headerElement, radiusSlider) {
        this.element = element;
        this.headerElement = headerElement;
        this.headerElement.onmousedown = this.mouseDown.bind(this);
        this.positions = [0, 0, 0, 0];
        this.radiusSlider = radiusSlider;
        this.isMinimized = false;
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
        /* Set initial position 20px from bottom*/
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

const DEFAULT_NODE_COUNT = 6;
const DEFAULT_EDGE_PROB = 0.5;

export class RandomGraph {
    numberOfNodes;
    edgeProb;

    graphCanvas;
    numberOfNodesInput;
    edgeProbInput;
    generateButton;

    constructor(numberOfNodesInput, edgeProbInput, generateButton, graphCanvas) {
        /* I was testing and wanted to keep the same settings */
        if (window.localStorage.getItem("randomeGenNumberOfNodes"))
            this.numberOfNodes = parseInt(window.localStorage.getItem("randomeGenNumberOfNodes"));
        else this.numberOfNodes = DEFAULT_NODE_COUNT;

        if (window.localStorage.getItem("randomGenEdgeProb"))
            this.edgeProb = parseFloat(window.localStorage.getItem("randomGenEdgeProb"));
        else this.edgeProb = DEFAULT_EDGE_PROB;

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
        this.writeInput(this.numberOfNodes, null);
    }

    updateEdgeProb(e) {
        const prob = parseFloat(e.target.value);
        if (prob < 0) prob = 0;
        if (prob > 1) prob = 1;
        this.edgeProb = prob;
        this.writeInput(null, this.edgeProb);
    }

    writeInput(numberOfNodes, edgeProb) {
        if (numberOfNodes) window.localStorage.setItem("randomeGenNumberOfNodes", numberOfNodes);
        if (edgeProb) window.localStorage.setItem("randomGenEdgeProb", edgeProb);
    }

    generate(e) {
        this.graphCanvas.drawRandomGraph(this.numberOfNodes, this.edgeProb);
    }
}

export class Menu {
    menuButtons;
    menuContents;

    menuButtonsParent;
    menuContentsParent;

    graphCanvas;
    textBox;

    isMinimized;
    menuButtonsParentDisplay;
    menuContentsParentDisplay;

    constructor(buttonsParent, menuButtons, contentsParent, menuContents, graphCanvas, textBox) {
        this.graphCanvas = graphCanvas;
        this.textBox = textBox;
        this.menuButtons = menuButtons;
        this.menuContents = menuContents;
        this.menuButtonsParent = buttonsParent;
        this.menuContentsParent = contentsParent;
        this.menuContents[0].style.display = "block";
        this.isMinimized = false;
        this.menuButtonsParentDisplay = this.menuButtonsParent.style.display;
        this.menuContentsParentDisplay = this.menuContentsParent.style.display;

        this.textBox.setInitialPosition();

        for (let i = 0; i < this.menuButtons.length; i++) {
            this.menuButtons[i].onclick = this.changeDisplay.bind(this);
        }
    }

    changeDisplay(e) {
        const buttonId = e.target.id;
        if (buttonId == "minimize") {
            this.minimizeTextbox();
            return;
        }
        let contentIndex = -1;
        for (let i = 0; i < this.menuContents.length; i++) {
            if (this.menuContents[i].id.includes(buttonId)) {
                this.menuContents[i].style.display = "block";
                contentIndex = i;
                break;
            }
        }
        if (contentIndex == -1) return;
        for (let i = 0; i < this.menuContents.length; i++) {
            if (i == contentIndex) continue;
            this.menuContents[i].style.display = "none";
        }
    }

    minimizeTextbox() {
        const newContent = this.isMinimized ? this.menuContentsParentDisplay : "none";
        const newButtons = this.isMinimized ? this.menuButtonsParentDisplay : "none";
        this.menuButtonsParent.style.display = newButtons;
        this.menuContentsParent.style.display = newContent;
        this.isMinimized = !this.isMinimized;
        this.textBox.isMinimized = this.isMinimized;
        const minimizeButton = this.menuButtons.find(button => button.id == "minimize");
        if (!minimizeButton) return;
        minimizeButton.innerText = this.isMinimized ? "+" : "-";
        /* Cosmetic stuff to make the + look better */
        minimizeButton.style.fontSize = this.isMinimized ? "30px" : "40px";
        minimizeButton.style.right = this.isMinimized ? "4px" : "20px";
        minimizeButton.style.top = this.isMinimized ? "4px" : "-5px";
        this.textBox.element.style.width = this.isMinimized ? "100px" : "350px";
    }
}
