import { context } from '../index.js';

let nodes = [];
let edges = [];
let counter = 0;
let selection = undefined;
let selected_nodes = [];

function getClosestEdge(nodeA, nodeB) {
    let points = [];
    // Calculate for nodeA
    let cx = nodeA.x + (nodeA.radius * (nodeB.x - nodeA.x)) / Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
    let cy = nodeA.y + (nodeA.radius * (nodeB.y - nodeA.y)) / Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
    points.push({x: cx, y: cy});
    // Calculate for nodeB
    let dx = nodeB.x + (nodeB.radius * (nodeA.x - nodeB.x)) / Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    let dy = nodeB.y + (nodeB.radius * (nodeA.y - nodeB.y)) / Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    points.push({x: dx, y: dy});
    return points;
}

function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < edges.length; i++) {
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        context.beginPath();
        context.strokeStyle = fromNode.strokeStyle;
        context.lineWidth = 1;
        const list = getClosestEdge(fromNode, toNode);
        context.moveTo(list[0].x, list[0].y);
        context.lineTo(list[1].x, list[1].y);
        context.stroke();
    }

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        context.beginPath();
        context.fillStyle = node.fillStyle;
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        context.strokeStyle = node.selected ? node.selectedStrokeStyle : node.strokeStyle;
        context.lineWidth = node.selected ? 3 : 1;
        context.fill();
        context.stroke();
        context.font = '28px sans-serif';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(node.id, node.x, node.y);
    }
}

export function move(e) {
    if (selection) {
        selection.x = e.x;
        selection.y = e.y;
        selection.moving = true;
        draw();
    }
}

function within(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) && 
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}

export function down(e) {
    let target = within(e.x, e.y);
    if (target) {
        selection = target;
        selection.selected = true;
    }
}

export function up(e) {
    let target = within(e.x, e.y);
    if (!selection || !selection.moving && !target) {
        let node = {
            id: (++counter).toString(),
            x: e.x,
            y: e.y,
            radius: 40,
            fillStyle: 'transparent',
            strokeStyle: 'black',
            selectedStrokeStyle: 'blue',
        };
        nodes.push(node);
        draw();
    }
    if (selection) {
        delete selection.moving;
    }
    if (target && target == selection) {
        target.selected = true;
        selected_nodes.push(target);
        if (selected_nodes.length == 2) {
            let [a, b] = selected_nodes;
            for (let i = 0; i < edges.length; i++) {
                let edge = edges[i];
                if (edge.from == selected_nodes[0] && edge.to == selected_nodes[1]) {
                    a.selected = false;
                    b.selected = false;
                    selected_nodes = [];
                    return;
                }
            }
            let edge = {from: a, to: b};
            edges.push(edge);
            a.selected = false;
            b.selected = false;
            selected_nodes = [];
        }
    }
    selection = undefined;
    draw();
}
