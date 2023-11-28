export class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addEdge(vSrc, vDest) {
        if (!this.adjacencyList.has(vSrc))
            this.adjacencyList.set(vSrc, []);
        this.adjacencyList.get(vSrc).push(vDest);
    }

    removeEdge(vSrc, vDest) {
        if (!this.adjacencyList.has(vSrc))
            throw new Error("Cannot remove edge from nonexistent vertex");
        this.adjacencyList.get(vSrc).filter((v) => v !== vDest);
    }

    addVertex(vertex) {
        if (!vertex) throw new Error("Cannot add null or undefined vertex");
        this.adjacencyList.set(vertex, []);
    }

    removeVertex(vertex) {
        if (!vertex) throw new Error("Must provide vertex to remove");
        if (!this.adjacencyList.has(vertex))
            throw new Error("Cannot remove vertex not in list.");
        const adjacentVertices = this.adjacencyList.get(vertex);
        for (let adjacentVertex of adjacentVertices) {
            this.removeEdge(adjacentVertex, vertex);
        }
        this.adjacencyList.delete(vertex);
    }
}

class Edge {
    u;
    v;
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }

    equals(other) {
        return (this.u === other.u && this.v === other.v) ||
            (this.u === other.v && this.v === other.u);
    }
}
