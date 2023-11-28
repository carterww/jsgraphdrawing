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
