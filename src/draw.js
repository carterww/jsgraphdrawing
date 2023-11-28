import { generateRandomGraph } from './utils.js';

export class GraphCanvas {
    context;
    canvas;
    nodeIdCounter;
    nodes;
    edges;
    selectedNode;
    selectedNodes;
    mouseDownTime;
    mouseUpTime;

    radius;
    fontSize;
    fontSizeRadiusRatio;
    fillStyle;
    strokeStyle;
    selectedStrokeStyle;

    constructor(canvas, context) {
        if (!canvas || !context) {
            throw new Error('Canvas and context are required');
        }
        this.canvas = canvas;
        this.context = context;
        this.counter = 0;
        this.nodes = [];
        this.edges = [];
        this.selectedNode = undefined;
        this.selectedNodes = [];
        this.mouseDownTime = undefined;
        this.mouseUpTime = undefined;

        this.radius = 40;
        this.fontSize = 28;
        this.fontSizeRadiusRatio = 0.7; // For scaling the font size with the radius
        this.fillStyle = 'transparent';
        this.strokeStyle = 'black';
        this.selectedStrokeStyle = 'red';
    }

    /* Moves a node on the canvas */
    moveNode(e) {
        if (this.selectedNode) {
            this.selectedNode.x = e.x;
            this.selectedNode.y = e.y;
            this.selectedNode.moving = true;
            this.updateCanvas();
        }
    }

    /* Find a node at the given coordinates */
    findNode(x, y) {
        return this.nodes.find(n => {
            return x > (n.x - n.radius) && 
                y > (n.y - n.radius) &&
                x < (n.x + n.radius) &&
                y < (n.y + n.radius);
        });
    }

    /* Mouse down can signify a few things:
        * 1. A node is being dragged.
        * 2. A node is being selected for an edge.
        * 3. A node is being deleted.
        */
    mouseDown(e) {
        if (e.button != 0) return;
        this.mouseDownTime = e.timeStamp;
        /* If clicking on a node, move it */
        let target = this.findNode(e.x, e.y);
        /* If clicking on a node, select it */
        if (target) {
            this.selectedNode = target;
            this.selectedNode.selected = true;
        }
    }


    /* Mouse up can signify a few things:
        * 1. A node is done being dragged.
        *    a. If the mouse up was quick, it was a click.
        *    b. If the mouse up was slow, it was a drag.
        * 2. A click for selecting a node for an edge is done.
        * 3. A node is being deleted.
        * 4. A node is being created.
        */
    mouseUp(e) {
        if (e.button != 0) return;
        let target = this.findNode(e.x, e.y);
        this.mouseUpTime = e.timeStamp;
        /* If the up was not findNode a node, create a node */
        if (!target) {
            this.createNode(e.x, e.y);
        }
        /* If the up was findNode the same node as the down, it was a click */
        else if (target && this.selectedNode == target && this.mouseUpTime - this.mouseDownTime <= 200) {
            this.selectedNode.moving = false;
            this.selectedNode = undefined;
            this.selectedNodes.push(target);
            this.createEdge();
        }
        /* If the up was findNode a node, it was a drag */
        else if (target && this.selectedNode == target && this.mouseUpTime - this.mouseDownTime > 200) {
            this.selectedNode.selected = false;
            this.selectedNode.moving = false;
            this.selectedNode = undefined;
        } else {
            return;
        }
        this.updateCanvas();
    }

    /* Draw a new node */
    createNode(x, y) {
        let node = {
            id: (++this.counter).toString(),
            x,
            y,
            radius: this.radius,
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            selectedStrokeStyle: this.selectedStrokeStyle,
        };
        this.nodes.push(node);
        this.updateCanvas();
        return;
    }

    createEdge() {
        if (this.selectedNodes.length < 2) return;
        /* If the edge already exists, don't create it */
        if (!this.isValidEdge(this.selectedNodes[0], this.selectedNodes[1])) {
            this.clearSelectedNodes();
            return;
        }
        let edge = {
            from: this.selectedNodes[0],
            to: this.selectedNodes[1],
        };
        this.edges.push(edge);
        this.clearSelectedNodes();
        this.updateCanvas();
    }

    /* Clear the selected nodes */
    clearSelectedNodes() {
        this.selectedNodes.forEach(n => {
            n.selected = false;
        });
        this.selectedNodes = [];
    }

    /* Checks if an edge can be created between two nodes */
    isValidEdge(from, to) {
        if (from == to) return false;
        for (let i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i];
            if ((edge.from == from && edge.to == to) ||
                (edge.from == to && edge.to == from)) {
                return false;
            }
        }
        return true;
    }

    changeRadius(radius) {
        radius = parseInt(radius);
        this.radius = radius;
        this.fontSize = Math.floor(radius * this.fontSizeRadiusRatio);
        this.nodes.forEach(n => {
            n.radius = radius;
        });
        this.updateCanvas();
    }

    /* Redraw the canvas */
    updateCanvas() {
        /* Clear the canvas */
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        /* Draw the edges */
        for (let i = 0; i < this.edges.length; i++) {
            let fromNode = this.edges[i].from;
            let toNode = this.edges[i].to;
            this.context.beginPath();
            this.context.strokeStyle = fromNode.strokeStyle;
            this.context.lineWidth = 1;
            const list = getClosestEdge(fromNode, toNode);
            this.context.moveTo(list[0].x, list[0].y);
            this.context.lineTo(list[1].x, list[1].y);
            this.context.stroke();
        }
        let font = '%dpx sans-serif'.replace('%d', this.fontSize);
        /* Draw the nodes */
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            this.context.beginPath();
            this.context.fillStyle = node.fillStyle;
            this.context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
            this.context.strokeStyle = node.selected ? node.selectedStrokeStyle : node.strokeStyle;
            this.context.lineWidth = node.selected ? 3 : 1;
            this.context.fill();
            this.context.stroke();
            this.context.font = font;
            this.context.fillStyle = 'black';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(node.id, node.x, node.y);
        }
    }

    drawRandomGraph(numberOfNodes, densityProb) {
        const graph = generateRandomGraph(numberOfNodes, densityProb, window.innerWidth, window.innerHeight);
        this.nodes = graph.nodes;
        this.edges = graph.edges;
        this.counter = numberOfNodes;
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].radius = this.radius;
            this.nodes[i].fillStyle = this.fillStyle;
            this.nodes[i].strokeStyle = this.strokeStyle;
            this.nodes[i].selectedStrokeStyle = this.selectedStrokeStyle;
        }
        this.updateCanvas();
    }
}

function getClosestEdge(nodeA, nodeB) {
    let points = [];
    const aDenom = Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
    const bDenom = Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    // Calculate for nodeA
    points.push({
        x: nodeA.x + (nodeA.radius * (nodeB.x - nodeA.x)) / aDenom,
        y: nodeA.y + (nodeA.radius * (nodeB.y - nodeA.y)) / aDenom,
    });
    // Calculate for nodeB
    points.push({
        x: nodeB.x + (nodeB.radius * (nodeA.x - nodeB.x)) / bDenom,
        y: nodeB.y + (nodeB.radius * (nodeA.y - nodeB.y)) / bDenom,
    });
    return points;
}
