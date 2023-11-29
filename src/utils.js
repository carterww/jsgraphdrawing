export function exportGraphToAdjMatrixCSV(nodes, edges, isDirected=false) {
    let matrix = [];
    for (let i = 0; i < nodes.length; i++) {
        matrix.push(new Array(nodes.length).fill(0));
    }

    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if (!edge.from || !edge.to) continue;
        let from = nodes.findIndex(n => n.id === edge.from.id);
        let to = nodes.findIndex(n => n.id === edge.to.id);
        matrix[from][to] = 1;
        if (!isDirected) matrix[to][from] = 1;
    }

    let csv = matrix.map(row => row.join(",")).join("\n");
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'adjacency_matrix.csv');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export function generateRandomGraph(numberOfNodes, densityProb, xRange, yRange, isDirected=false) {
    if (numberOfNodes < 0) throw new Error("Number of nodes must be positive");
    if (densityProb < 0 || densityProb > 1) throw new Error("Density probability must be between 0 and 1");

    let nodes = [];
    let edges = [];

    for (let i = 1; i <= numberOfNodes; i++) {
        nodes.push({
            id: i.toString(),
            x: Math.random() * xRange,
            y: Math.random() * yRange,
            // not setting cosmetics here
        });
    }
    let outerIterations = isDirected ? nodes.length : nodes.length / 2;

    for (let i = 0; i < outerIterations; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i == j) continue;
            if (Math.random() <= densityProb) {
                edges.push({
                    from: nodes[i],
                    to: nodes[j],
                });
            }
        }
    }

    // Convert to undirected
    if (!isDirected) {
        let newEdges = [];
        for (let i = 0; i < edges.length; i++) {
            let edge = edges[i];
            if (!edge.from || !edge.to) continue;
            if (!doesEdgeExist(newEdges, edge)) {
                newEdges.push(edge);
                newEdges.push({
                    from: edge.to,
                    to: edge.from,
                });
            }
        }
        edges = newEdges;
    }

    return { nodes, edges };
}

function doesEdgeExist(edges, edge) {
    for (let i = 0; i < edges.length; i++) {
        let e = edges[i];
        if ((e.from.id == edge.from.id && e.to.id == edge.to.id) ||
            (e.from.id == edge.to.id && e.to.id == edge.from.id)) {
            return true;
        }
    }
    return false;
}
