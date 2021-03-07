// this is for calculation only
// ie to give points 
// or if asked , step to plot ellipse


function midPointEllipse(ellipse, wantStep = false) {
    const a = ellipse.a
    const b = ellipse.b
    const a2 = a ** 2
    const b2 = b ** 2
    wantStep = wantStep ?? false;

    const fe = (x, y) => b2 * x ** 2 + a2 * y ** 2 - a2 * b2;

    let step = []       // {iteration, x, y, d_i}
    let points = []     // [x, y]

    let iteration = 0;
    let [x, y] = [0, b]
    let d_i = Math.round(b2 - a2 * b + a2 / 4); // fe(0+1, b-1/2)

    const two_a2 = 2 * a2, two_b2 = 2 * b2

    let δx = 0
    let δy = two_a2 * y;
    /* 
        while (δx < δy) {
            points.push([x, y])
            δx += two_b2;
    
            if (wantStep)
                step.push({ iteration, x, y, d_i })
    
            let caseD = Number(d_i >= 0)
            // d_(i+1) = d_i + ...
            d_i += b2 * (3 + 2 * x) + a2 * (2 * [0, 1 - y][caseD])
            x = x + 1
            y = y - caseD
            if (caseD) δy -= two_a2;
        }
    
     */


    // this is also correct (HEARN BAKER book)
    while (δx < δy) {
        points.push([x, y])
        δx += two_b2;
        if (wantStep)
            step.push({ iteration, x, y, d_i })

        let caseD = Number(d_i >= 0)
        δy -= [0, two_a2][caseD]
        // d_(i+1) = d_i + ...
        d_i += b2 + δx - [0, δy][caseD]
        x = x + 1
        y = y - caseD

    }

    d_i = Math.round(x + 1 / 2, y - 1)


    while (y >= 0) {
        points.push([x, y])

        if (wantStep)
            step.push({ iteration, x, y, d_i })

        let caseD = Number(d_i <= 0)
        // d_(i+1) = d_i + ...
        d_i += a2 * (3 - 2 * y) + b2 * (2 * [0, 1 + x][caseD])
        y = y - 1
        x = x + caseD
    }


    if (wantStep) return [points, step]
    return points
}

export default function fullMidPointEllipse(ellipse, wantStep = false) {
    let basePoints, step;
    if (wantStep)
        [basePoints, step] = midPointEllipse(ellipse, wantStep);
    else basePoints = midPointEllipse(ellipse, wantStep)


    let [ox, oy] = ellipse.center;
    let LIM = basePoints.length
    let points = basePoints.map(pnt => [pnt[0] + ox, pnt[1] + oy])

    let basePointsReversed = basePoints.slice(0, basePoints.length).reverse()

    // basePointsReversed.forEach(pnt => points.push([ox + pnt[1], oy + pnt[0]]))
    // basePoints.forEach(pnt => points.push([ox + pnt[1], oy - pnt[0]]))
    basePointsReversed.forEach(pnt => points.push([ox + pnt[0], oy - pnt[1]]))
    basePoints.forEach(pnt => points.push([ox - pnt[0], oy - pnt[1]]))
    // basePointsReversed.forEach(pnt => points.push([ox - pnt[1], oy - pnt[0]]))
    // basePoints.forEach(pnt => points.push([ox - pnt[1], oy + pnt[0]]))
    basePointsReversed.forEach(pnt => points.push([ox - pnt[0], oy + pnt[1]]))


    if (wantStep) return [points, step]
    return points
}