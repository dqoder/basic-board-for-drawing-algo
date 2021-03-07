export default function plotPixelOnCanvas(canvas, pixel, color) {
    if (canvas == null || pixel == null) {
        console.error("plotPixelOnCanvas: no canvas or pixel")
        throw new Error()
    }

    let transform = window.transform
    let pixelSize = window.SCALE
    color = color ?? canvas.color('white')
    canvas.push()
    canvas.noStroke()
    canvas.fill(color)
    let [x_, y_] = transform(...pixel)
    canvas.rect(x_, y_, pixelSize, -pixelSize)

    canvas.pop()
}