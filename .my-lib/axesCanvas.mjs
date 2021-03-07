// this is Pixelised grid/axes

// global through window
window.SCALE = 10
window.TICK_TEXT_SIZE = 7
window.LEFT_MARGIN = window.innerWidth / 2
window.BOTTOM_MARGIN = window.innerHeight / 2
window.Origin = [window.LEFT_MARGIN, window.BOTTOM_MARGIN]

window.transform = (x, y) => {
    let x_ = window.Origin[0] + window.SCALE * x;
    let y_ = window.Origin[1] - window.SCALE * y;
    return [x_, y_]
}

window.inverseTransform = (x_, y_) => {
    let x = (x_ - window.Origin[0]) / SCALE;
    let y = (window.Origin[1] - y_) / SCALE;
    return [x, y]
}

const axes = (skt) => {
    skt.gridOnForAxesDEL = true
    skt.tickOnForAxesDEL = true

    let renderAxes = () => {
        skt.clear();
        let gridOnForAxesDEL = skt.gridOnForAxesDEL
        let tickOnForAxesDEL = skt.tickOnForAxesDEL
        const TICK_TEXT_SIZE = window.TICK_TEXT_SIZE ?? 7
        const SCALE = window.SCALE ?? 10;
        const Origin = window.Origin

        const transform = window.transform
        if (transform == null || Origin == null) {
            console.error("ERROR renderAxes")
            alert('something went wrong')
        }

        skt.push()

        // origin
        skt.stroke('white')
        skt.strokeWeight(4)
        skt.point(...Origin)



        skt.strokeWeight(1)
        skt.line(0, Origin[1], skt.windowWidth, Origin[1])   // x axis
        skt.line(Origin[0], skt.windowHeight, Origin[0], 0)  // y axis

        if (tickOnForAxesDEL) {
            const tickLen = 2.5;
            let cord, cord_
            let colorOfYtick = skt.color('cyan'), colorOfXtick = skt.color('orange')
            // +x ticks
            cord = [1, 0]
            cord_ = transform(...cord)

            skt.textSize(TICK_TEXT_SIZE)

            while (cord_[0] < skt.windowWidth) {
                skt.line(cord_[0], cord_[1] + tickLen, cord_[0], cord_[1] - tickLen)

                skt.push();
                skt.fill(colorOfXtick)
                skt.noStroke()
                skt.text(`${cord[0]}`, cord_[0] - 1 * tickLen, cord_[1] + 4 * tickLen)
                skt.pop()

                cord[0] += 1
                cord_ = transform(...cord)
            }

            // -x ticks

            cord = [-1, 0]
            cord_ = transform(...cord)

            while (cord_[0] > 0) {
                skt.line(cord_[0], cord_[1] + tickLen, cord_[0], cord_[1] - tickLen)

                skt.push()
                skt.fill(colorOfXtick)
                skt.noStroke()
                skt.text(`${cord[0]}`, cord_[0] - 2 * tickLen, cord_[1] + 4 * tickLen)
                skt.pop()

                cord[0] -= 1
                cord_ = transform(...cord)
            }

            // +y ticks
            cord = [0, 1]
            cord_ = transform(...cord)

            while (cord_[1] > 0) {
                skt.line(cord_[0] + tickLen, cord_[1], cord_[0] - tickLen, cord_[1])

                skt.push();
                skt.fill(colorOfYtick)
                skt.noStroke()
                skt.text(`${cord[1]}`, cord_[0] + 2 * tickLen, cord_[1] + 1 * tickLen)
                skt.pop()

                cord[1] += 1
                cord_ = transform(...cord)
            }

            // -y ticks

            cord = [0, -1]
            cord_ = transform(...cord)

            while (cord_[1] < skt.windowHeight) {
                skt.line(cord_[0] + tickLen, cord_[1], cord_[0] - tickLen, cord_[1])

                skt.push();
                skt.fill(colorOfYtick)
                skt.noStroke()
                skt.text(`${cord[1]}`, cord_[0] + 2 * tickLen, cord_[1] + 1 * tickLen)
                skt.pop()

                cord[1] -= 1
                cord_ = transform(...cord)
            }
        }

        if (gridOnForAxesDEL) {
            let cord, cord_
            skt.push();
            skt.drawingContext.setLineDash([4, 4])
            skt.stroke(255, 100)     // for making grids faint/ dim
            skt.strokeWeight(0.5)    // for making grid faint/dim
            // +x ticks
            cord = [1, 0]
            cord_ = transform(...cord)

            skt.textSize(9)

            while (cord_[0] < skt.windowWidth) {
                skt.line(cord_[0], 0, cord_[0], skt.windowHeight)



                cord[0] += 1
                cord_ = transform(...cord)
            }

            // -x ticks

            cord = [-1, 0]
            cord_ = transform(...cord)

            while (cord_[0] > 0) {
                skt.line(cord_[0], 0, cord_[0], skt.windowHeight)

                cord[0] -= 1
                cord_ = transform(...cord)
            }

            // +y ticks
            cord = [0, 1]
            cord_ = transform(...cord)

            while (cord_[1] > 0) {
                skt.line(0, cord_[1], skt.windowWidth, cord_[1])

                cord[1] += 1
                cord_ = transform(...cord)
            }

            // -y ticks

            cord = [0, -1]
            cord_ = transform(...cord)

            while (cord_[1] < skt.windowHeight) {
                skt.line(0, cord_[1], skt.windowWidth, cord_[1])

                cord[1] -= 1
                cord_ = transform(...cord)
            }

            skt.pop();
        }


        skt.pop();
    }

    skt.renderAxes = renderAxes
    skt.changeScale = (newScale) => {
        if (7 <= newScale && newScale <= 70) {

            window.SCALE = newScale
            window.LEFT_MARGIN = window.innerWidth / 2
            window.BOTTOM_MARGIN = window.innerHeight / 2
            window.Origin = [window.LEFT_MARGIN, window.BOTTOM_MARGIN]
            skt.renderAxes()
        }
    }

    skt.setup = () => {
        skt.createCanvas(skt.windowWidth, skt.windowHeight)
        renderAxes()
    }

    skt.draw = () => {

    }

    let mouseClickInit = null

    skt.mouseClicked = () => {
        if (mouseClickInit == null) return;
        let mouseClickFin = [skt.mouseX, skt.mouseY]
        let D = skt.dist(...mouseClickInit, ...mouseClickFin)
        if (D >= 40) {
            // console.log(window.Origin)
            let δx = mouseClickFin[0] - mouseClickInit[0]
            let δy = mouseClickFin[1] - mouseClickInit[1]
            // console.table({ mouseClickInit, mouseClickFin, Δ: [δx, δy] })
            window.Origin[0] += δx
            window.Origin[1] += δy
            renderAxes()
            for (let cnv in window.allCanvas) {
                window.allCanvas[cnv].reDraw();
            }
        }
        mouseClickInit = null
    }

    skt.resetOrigin = () => {
        window.Origin = [window.LEFT_MARGIN, window.BOTTOM_MARGIN]
        renderAxes()
    }

    skt.mousePressed = () => {
        mouseClickInit = [skt.mouseX, skt.mouseY]
    }

    skt.touchStarted = () => {
        // console.log('touch', skt.touches)

    }


}

export default axes