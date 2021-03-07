// this is for calculation only
// ie to give points 
// or if asked , step to plot circle

function bresenhamCircle(circle, wantStep = false) {
    const R = circle.radius
    wantStep = wantStep ?? false;


    let step = []       // {iteration, x, y, d_i}
    let points = []     // [x, y]

    let iteration = 0;
    let [x, y] = [0, R]
    let d_i = 3 - 2 * R

    while (x <= y) {
        points.push([x, y])
        if (wantStep)
            step.push({ iteration, x, y, d_i })

        let caseD = Number(d_i >= 0)
        // d_(i+1) = d_i + ...
        d_i += 2 * (2 * x + 3 + 2 * [0, 1 - y][caseD])
        x = x + 1
        y = y - caseD
    }


    if (wantStep) return [points, step]
    return points
}

export default function fullBresenhamCircle(circle, wantStep = false) {
    let basePoints, step;
    if (wantStep)
        [basePoints, step] = bresenhamCircle(circle, wantStep);
    else basePoints = bresenhamCircle(circle, wantStep)


    let [ox, oy] = circle.center;
    let LIM = basePoints.length
    let points = basePoints.map(pnt => [pnt[0] + ox, pnt[1] + oy])

    let basePointsReversed = basePoints.slice(0, basePoints.length).reverse()

    basePointsReversed.forEach(pnt => points.push([ox + pnt[1], oy + pnt[0]]))
    basePoints.forEach(pnt => points.push([ox + pnt[1], oy - pnt[0]]))
    basePointsReversed.forEach(pnt => points.push([ox + pnt[0], oy - pnt[1]]))
    basePoints.forEach(pnt => points.push([ox - pnt[0], oy - pnt[1]]))
    basePointsReversed.forEach(pnt => points.push([ox - pnt[1], oy - pnt[0]]))
    basePoints.forEach(pnt => points.push([ox - pnt[1], oy + pnt[0]]))
    basePointsReversed.forEach(pnt => points.push([ox - pnt[0], oy + pnt[1]]))


    if (wantStep) return [points, step]
    return points
}