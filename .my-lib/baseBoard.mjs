import plotPixelOnCanvas from '/.my-lib/plotPixelOnCanvas.mjs'
const baseBoard = (curve, dA, dC) => {
    return function (skt) {
        skt.curve = curve
        let LIMIT, index = 0
        let curvePixels
        skt.drawingAlgo = dA;
        skt.drawCurve = dC(skt);

        skt.animationAble = false;
        skt.setup = () => {
            let windowHeight = skt.windowHeight
            let windowWidth = skt.windowWidth;
            skt.createCanvas(windowWidth, windowHeight)

            // console.log(`my curve: `, skt.curve)

            // setting default color for curve
            skt.curve.color = skt.curve.color ?? skt.color('white')
            skt.curve.color = skt.color(skt.curve.color)

            skt.frameRate(skt.animationAble ? skt.frameRate() : 0);

            skt.drawCurve(skt.curve)

            curvePixels = skt.drawingAlgo(skt.curve)
            LIMIT = curvePixels.length

            skt.reDraw()
        }


        skt.draw = () => {
            if (index < LIMIT) {
                let clr = circle01.color
                clr.setAlpha(100)
                plotPixelOnCanvas(skt, curvePixels[index], clr);
                index++
            }
            else {
                skt.frameRate(0)
            }
        }

        skt.resetIndex = () => {
            index = 0
        }

        skt.changeCurve = curveNew => {
            skt.curve = curveNew
            curvePixels = skt.drawingAlgo(skt.curve)
            LIMIT = curvePixels.length

            skt.reDraw();
        }

        skt.reDraw = () => {
            skt.clear();
            skt.resetIndex()
            skt.frameRate(skt.animationAble ? skt.frameRate() : 0);
            skt.drawCurve(skt.curve)
            if (!skt.animationAble) {
                let clr = skt.color(skt.curve.color)
                clr.setAlpha(100)
                curvePixels.forEach(pnt => {
                    plotPixelOnCanvas(skt, pnt, clr);
                })
            }
        }
    }
}

export default baseBoard;

