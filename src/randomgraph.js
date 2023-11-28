export function generateRandomGraph(numberOfNodes, densityProb, xRange, yRange) {
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

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i == j) continue;
            if (Math.random() < densityProb) {
                edges.push({
                    from: nodes[i],
                    to: nodes[j],
                });
            }
        }
    }

    return { nodes, edges };
}
