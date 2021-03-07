import baseBoard from '/lib/baseBoard.mjs'
import bresenhamCircleDrawing from '/scripts/graphixAlgo/BresenhamCircle.mjs'
import midPointCircleDrawing from '/scripts/graphixAlgo/midPointCircle.mjs'
import bresenhamLineDrawing from '/scripts/graphixAlgo/BresenhamLine.mjs'
import midPointEllipseDrawing from '/scripts/graphixAlgo/midPointEllipse.mjs'


const circleDraw = (skt) => {
    return (circle) => {
        skt.push()
        skt.stroke(circle.color)
        skt.strokeWeight(4)
        skt.noFill()
        skt.circle(...transform(...circle.center), circle.radius * window.SCALE * 2)
        skt.pop()
    }
}

const lineDraw = (skt) => {
    return (line) => {
        skt.push()
        skt.stroke(line.color)
        skt.strokeWeight(4)
        skt.noFill()
        skt.line(...transform(...line.start), ...transform(...line.end))
        skt.pop()
    }
}

const ellipseDraw = (skt) => {
    return (ellipse) => {
        skt.push()
        skt.stroke(ellipse.color)
        skt.strokeWeight(4)
        skt.noFill()
        skt.ellipse(...transform(...ellipse.center), ellipse.a * window.SCALE * 2, ellipse.b * window.SCALE * 2)
        skt.pop()
    }
}

const circleBHBoard = circle => baseBoard(circle, bresenhamCircleDrawing, circleDraw)
const circleMPBoard = circle => baseBoard(circle, midPointCircleDrawing, circleDraw)

const lineBHBoard = line => baseBoard(line, bresenhamLineDrawing, lineDraw)
const ellipseMPBoard = ellipse => baseBoard(ellipse, midPointEllipseDrawing, ellipseDraw)

export { circleBHBoard, circleMPBoard, lineBHBoard, ellipseMPBoard }
