/** This function modifies the position of the verticies in the pointMap
    * according to the force equations. The function should iterate until
    * the maximum number of iterations has been reached or until the
    * threshold has been reached.
    * @param vertexSet {Set} - The set of verticies in the graph
    * @param edgeSet {Set} - The set of edges in the graph
    * @param pointMap {Map} - A map of verticies to their positions
    * @param threshold {number} - The threshold for the algorithm. Once the greatest
    * force is less than the threshold, the algorithm should stop.
    * @param maxIterations {number} - The maximum number of iterations the algorithm
    * should run for.
    * @return {Map} - A map of verticies to their positions
    */
function forceDirected(graph, pointMap, threshold, maxIterations) {
    let i = 0;
    let maxForceVector;
    let maxForceVectorNorm = Number.NEGATIVE_INFINITY;
    let vertices = graph.adjacencyList.keys();
    do {
        let forces = new Map();
        for (let vertex of vertices) {
            let attractiveForce = attractiveForce(vertex, vertices, pointMap);
            let repulsiveForce = repulsiveForce(vertex, graph.adjacencyList, graph.adjacencyList, pointMap);
            let forceVector = attractiveForce.add(repulsiveForce);
            let forceVectorNorm = forceVector.norm();
            if (forceVectorNorm > maxForceVectorNorm) {
                maxForceVector = forceVector;
                maxForceVectorNorm = forceVectorNorm;
            }
            forces.set(vertex, forceVector);
        }
        for (let vertex of vertices) {
            const forceVector = forces.get(vertex);
            const point = pointMap.get(vertex);
            const newPoint = point.add(forceVector.multiply(delta()));
            pointMap.set(vertex, newPoint);
        }
        i++;
    } while (i < maxIterations && maxForceVectorNorm > threshold);


}

function unitVector(vector1, vector2) {
    return vector1.subtract(vector2).normalize();
}

let repulsiveForceConstant = 2;
function repulsiveForce(vertex, vertices, adjacencyList, pointMap) {
    let totalRepulsiveForce = new Vector(0, 0);
    for (let v of vertices) {
        if (adjacencyList.get(vertex).has(v))
            continue; /* Don't want repulsive force between adjacent vertices */
        if (v == vertex) 
            continue;
        let euclideanDistance = pointMap.get(vertex).euclideanDistance(pointMap.get(v));
        let first = (repulsiveForceConstant / (euclideanDistance * euclideanDistance));
        let second = unitVector(pointMap.get(vertex), pointMap.get(v));
        second.x = second.x * first;
        second.y = second.y * first;
        totalRepulsiveForce.add(second);
    }
    return totalRepulsiveForce;
}

let attractiveForceConstant = 1;
let idealLength = 1;
function attractiveForce(vertex, adjacencyList, pointMap) {
    let adjacentVertices = adjacencyList.get(vertex);
    let totalAttractiveForce = new Vector(0, 0);
    for (let v of adjacentVertices) {
        let euclideanDistance = pointMap.get(vertex).euclideanDistance(pointMap.get(v));
        let first = Math.log(euclideanDistance / idealLength) * attractiveForceConstant;
        let second = unitVector(pointMap.get(vertex), pointMap.get(v));
        second.x = second.x * first;
        second.y = second.y * first;
        totalAttractiveForce.add(second); 
    }
    return totalAttractiveForce;
}

function delta() {
    return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
}
