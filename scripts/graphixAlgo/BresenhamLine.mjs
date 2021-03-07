const signum = x => x >= 0 ? +1 : -1;
const abs = x => Math.abs(x)
const int = x => Math.round(x)

export default function bresenhamLineDrawing(line, wantStep = false) {
    let [x1, y1] = line.start;
    let [x2, y2] = line.end;

    const dir = signum(x2 - x1)
    const dirY = signum(y2 - y1)
    const Δx = int(abs(x2 - x1)), Δy = int(abs(y2 - y1))
    const $2Δy = int(2 * Δy), $2Δx = int(2 * Δx)
    const $2Δyx = $2Δy - $2Δx, $2Δxy = - $2Δyx

    let init_data = {
        x1, x2, y1, y2, Δx, Δy, $2Δy, $2Δyx
    }
    let d_i = null
    let step_count = 0
    let x_cord = x1, y_cord = y1
    let step_calc = []
    if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
    step_count++;

    let bCord = []

    if (Δx == 0) {
        // console.log('case : Δx == 0')

        for (let y = y1; (y - y2) * dirY <= 0; y += dirY) {
            bCord.push([x1, y])

            x_cord = x1, y_cord = y
            if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
            step_count++;
        }
    } else if (Δy == 0) {
        // console.log('case : Δy == 0')
        for (let x = x1; (x - x2) * dir <= 0; x += dir) {
            bCord.push([x, y1])
            x_cord = x, y_cord = y1
            if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
            step_count++;
        }
    } else if (abs(Δy) == abs(Δx)) {
        // console.log('case: Δx == Δy')
        for (let x = x1, y = y1; (x - x2) * dir <= 0; x += dir, y += dirY) {
            bCord.push([x, y])
            x_cord = x, y_cord = y
            if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
            step_count++;
        }
    } else if (abs(Δy) < abs(Δx)) {   // |m| < 1
        // console.log('case: Δx > Δy')
        let d = $2Δy - Δx   // d1 (no array: di) ; only storing most recent di; d = di -> space: O(1)
        let [xi, yi] = [x1, y1]
        bCord.push([xi, yi])
        for (let x = x1 + dir; (x - x2) * dir <= 0; x += dir) {
            d_i = d;
            if (d < 0) {
                xi += dir // [x_(i+1), y_(i+1)] = [x_i + 1, y_i]
                bCord.push([xi, yi])
                d += $2Δy
            } else {
                xi += dir
                yi += dirY
                bCord.push([xi, yi])
                d += $2Δyx
            }
            x_cord = xi, y_cord = yi
            if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
            step_count++;
        }
    } else {
        // console.log('case: Δx <= Δy [else]')
        let d = $2Δx - Δy   // d1 (no array: di) ; only storing most recent di; d = di -> space: O(1)
        let [xi, yi] = [x1, y1]

        bCord.push([xi, yi])
        for (let y = y1 + dirY; (y - y2) * dirY <= 0; y += dirY) {
            d_i = d;
            // console.log({ d, xi, yi })
            if (d < 0) {
                yi += dirY // [x_(i+1), y_(i+1)] = [x_i, y_i + 1]
                bCord.push([xi, yi])
                d += $2Δx
            } else {
                xi += dir
                yi += dirY
                bCord.push([xi, yi])
                d += $2Δxy
            }
            x_cord = xi, y_cord = yi
            if (wantStep) step_calc.push({ step_count, d_i, x_cord, y_cord })
            step_count++;
        }
    }
    if (wantStep) return [bCord, step_calc]
    return bCord;

}
