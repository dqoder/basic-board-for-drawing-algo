import axesP5 from '/lib/axesCanvas.mjs'
import { circleBHBoard, circleMPBoard, lineBHBoard, ellipseMPBoard } from '/lib/curveBoards.mjs'

const SHAPE_ID = 'shape-'
const BOARD_ID = 'board-'
const ANIMATION_DISABLED = true;

let ID_set = new Set()

const getID = () => {
    let n = Math.round(Math.random() * 10000);
    while (ID_set.has(n)) {
        n = Math.round(Math.random() * 10000);
    }
    ID_set.add(n)
    return n;
}

const clearID = (id) => {
    if (!ID_set.has(id)) {
        throw new Error(`id: ${id} is not is ID set`)
    }
    ID_set.delete(id)
}



document.getElementById('button-for-hide-show').addEventListener('click', () => {
    let formContainer = document.getElementById('form-container')
    formContainer.classList.toggle('open')
    formContainer.classList.toggle('closed')
})



let axes = new p5(axesP5, 'p5axes')


let myCircle = { center: [0, 0], radius: 8, color: axes.color('blue') }
let myCircle2 = { center: [0, 0], radius: 8, color: axes.color('red') }

let allCanvas = {}

window.allCanvas = allCanvas

/***
creates new p5sketch (board) and attach it to p5canvas-container
also add it to [JS] global varaible : allCanvas
@param board : which type of board [ algo ]
@param curve : curve description
@param boardId : int - a number attached with board; use to connect board with info-object.
@return reference of new Board Div
***/
const createNewBoard = (board, curve, boardId) => {
    let newDiv = document.createElement('div')
    newDiv.classList.add('p5c')
    document.getElementById('p5canvas-container').appendChild(newDiv)
    let newBoard = new p5(board(curve), newDiv)

    if (Number.isInteger(boardId)) {
        newDiv.id = `${BOARD_ID}${boardId}`
        allCanvas[boardId] = newBoard
    }
    return newBoard
}



// grid option : addEventListener
document.getElementById('gridOption').addEventListener('change', function () {
    axes.gridOnForAxesDEL = this.checked
    axes.renderAxes()
})

// SCALE option : addEventListener
document.getElementById('scaleOption').addEventListener('change', function () {
    axes.changeScale(Number(this.value))

    for (let boardId in allCanvas)
        allCanvas[boardId].reDraw();
})



// create new object in list

let shapeObjList = document.getElementById('shape-object-list')
let p5canvasList = document.getElementById('p5canvas-container')

let makeRenderButton = (ID) => {
    let newButton = document.createElement('input')
    newButton.type = 'button'
    newButton.value = 'render'
    newButton.classList.add('unselectable')

    newButton.addEventListener('click', function () {

        // global :   allCanvas
        let canvas = allCanvas[ID]
        canvas.changeCurve(extractCurveFromDataContainer(canvas.dataContainer))
    })

    return newButton
}

let makeDeleteButton = (ID) => {
    let newButton = document.createElement('input')
    newButton.type = 'button'
    newButton.value = 'delete'
    newButton.classList.add('unselectable')

    newButton.addEventListener('click', function () {
        let shapeObjDiv = document.getElementById(`${SHAPE_ID}${ID}`)
        let canvasDiv = document.getElementById(`${BOARD_ID}${ID}`)
        // global : shapeObjList, p5canvasList, allCanvas
        shapeObjList.removeChild(shapeObjDiv)
        p5canvasList.removeChild(canvasDiv)
        delete allCanvas[ID]
        clearID(ID);
    })

    return newButton
}

let createObjectForObjList = (dataObj, objID) => {
    let objectDiv = document.createElement('div')
    objectDiv.classList.add('object-info-container')
    objectDiv.classList.add('indent')
    objectDiv.classList.add('unselectable')
    objectDiv.classList.add('make-a-small-distance-from-above')
    if (Number.isInteger(objID)) {
        objectDiv.id = `${SHAPE_ID}${objID}`
        objectDiv.objID = objID
    } else {
        throw new Error('no objID is provided in object creation')
    }

    let divShape = document.createElement('div')
    divShape.classList.add('object-shape')
    switch (dataObj.shapeName) {
        case 'Line': divShape.textContent = 'L';
            break;
        case 'Circle': divShape.textContent = 'S';
            break;
        case 'Ellipse': divShape.textContent = 'E';
            break;
    }

    let nameObj = document.createElement('input')
    nameObj.type = 'text'
    nameObj.classList.add('object-header')
    nameObj.value = 'shape alpha'

    let checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    checkBox.classList.add('object-show')
    checkBox.checked = true

    let rdBtnContainerDiv = document.createElement('div')
    rdBtnContainerDiv.classList.add('rd-button-container')
    let renderButton = makeRenderButton(objID)
    let deleteButton = makeDeleteButton(objID)
    rdBtnContainerDiv.appendChild(renderButton)
    rdBtnContainerDiv.appendChild(deleteButton)

    let objectDesc = document.createElement('div')
    objectDesc.classList.add('object-desc')
    objectDesc.classList.add('indent')

    // animation option
    {
        let animationOption = document.createElement('div')
        animationOption.classList.add('form-input-container')
        animationOption.classList.add('indent')

        let animLabel = document.createElement('label')
        animLabel.textContent = 'animation'
        let animInput = document.createElement('input')
        animInput.type = 'checkbox'
        animInput.disabled = ANIMATION_DISABLED
        animationOption.appendChild(animLabel)
        animationOption.appendChild(animInput)
        dataObj.appendChild(animationOption)
    }

    objectDesc.appendChild(dataObj)
    objectDesc.appendChild(rdBtnContainerDiv)
    // objectDesc.appendChild(deleteButton)

    objectDiv.appendChild(divShape)
    objectDiv.appendChild(nameObj)
    objectDiv.appendChild(checkBox)
    objectDiv.appendChild(objectDesc)


    return objectDiv
}


// event listener to make new

const submitButtonContainerForNewObj = document.createElement('div')
submitButtonContainerForNewObj.classList.add('make-a-small-distance-from-above')
submitButtonContainerForNewObj.classList.add('submit-button-container')
let inputBtnInSBFNO = document.createElement('input')
inputBtnInSBFNO.setAttribute('type', 'button')
inputBtnInSBFNO.value = 'create'
inputBtnInSBFNO.id = 'create-new-obj-btn'
inputBtnInSBFNO.classList.add('submit-button')
submitButtonContainerForNewObj.appendChild(inputBtnInSBFNO)

let newObjectDetailContainerElement = document.getElementById('new-object-details')

let addLineDetailInputer = () => {


    // these 2 are dummies // not used in entire function
    let line = { start: [0, 0], end: [10, 10], color: null }
    let board = null

    let newLineInitial = document.createElement('div')

    newLineInitial.classList.add('form-input-container')
    newLineInitial.classList.add('indent')

    let newLineInitialTextDiv = document.createElement('div')
    newLineInitialTextDiv.textContent = 'start'
    newLineInitial.appendChild(newLineInitialTextDiv)

    let newLineInitialData = document.createElement('div')
    newLineInitialData.classList.add('two-inputs')
    newLineInitial.appendChild(newLineInitialData)


    let xInitialLabel = document.createElement('label')
    let xInitialInput = document.createElement('input')

    let yInitialLabel = document.createElement('label')
    let yInitialInput = document.createElement('input')

    newLineInitialData.appendChild(xInitialLabel)
    newLineInitialData.appendChild(xInitialInput)
    newLineInitialData.appendChild(yInitialLabel)
    newLineInitialData.appendChild(yInitialInput)

    xInitialLabel.setAttribute('for', 'xInitialInput')
    yInitialLabel.setAttribute('for', 'yInitialInput')
    xInitialLabel.textContent = 'x'
    yInitialLabel.textContent = 'y'

    xInitialInput.setAttribute('type', 'number')
    xInitialInput.setAttribute('name', 'xInitialInput')
    xInitialInput.setAttribute('step', '1')
    xInitialInput.setAttribute('value', '0')

    yInitialInput.setAttribute('type', 'number')
    yInitialInput.setAttribute('name', 'yInitialInput')
    yInitialInput.setAttribute('step', '1')
    yInitialInput.setAttribute('value', '0')

    // final points
    let newLineFinal = document.createElement('div')

    newLineFinal.classList.add('form-input-container')
    newLineFinal.classList.add('indent')

    let newLineFinalTextDiv = document.createElement('div')
    newLineFinalTextDiv.textContent = 'end'
    newLineFinal.appendChild(newLineFinalTextDiv)

    let newLineFinalData = document.createElement('div')
    newLineFinalData.classList.add('two-inputs')
    newLineFinal.appendChild(newLineFinalData)


    let aFinalLabel = document.createElement('label')
    let aFinalInput = document.createElement('input')

    let bFinalLabel = document.createElement('label')
    let bFinalInput = document.createElement('input')

    newLineFinalData.appendChild(aFinalLabel)
    newLineFinalData.appendChild(aFinalInput)
    newLineFinalData.appendChild(bFinalLabel)
    newLineFinalData.appendChild(bFinalInput)

    aFinalLabel.textContent = 'x'
    bFinalLabel.textContent = 'y'

    aFinalInput.setAttribute('type', 'number')
    aFinalInput.setAttribute('step', '1')
    aFinalInput.setAttribute('value', '10')

    bFinalInput.setAttribute('type', 'number')
    bFinalInput.setAttribute('step', '1')
    bFinalInput.setAttribute('value', '20')


    // algo
    let newLineAlgo = document.createElement('div')
    newLineAlgo.classList.add('form-input-container')
    newLineAlgo.classList.add('indent')
    let newAlgoLabel = document.createElement('label')
    let newAlgoSelect = document.createElement('select')
    newLineAlgo.appendChild(newAlgoLabel)
    newLineAlgo.appendChild(newAlgoSelect)

    newAlgoLabel.textContent = 'algo'

    let newAlgoOption1 = document.createElement('option')
    // let newAlgoOption2 = document.createElement('option')
    newAlgoSelect.appendChild(newAlgoOption1)
    // newAlgoSelect.appendChild(newAlgoOption2)

    newAlgoOption1.value = 'bhl';// bresenham line
    // newAlgoOption2.value = ''
    newAlgoOption1.textContent = 'bresenham'
    // newAlgoOption2.textContent = ''

    // color
    let newLineColor = document.createElement('div')
    newLineColor.classList.add('form-input-container')
    newLineColor.classList.add('indent')
    let newColorLabel = document.createElement('label')
    let newColorInput = document.createElement('input')
    newLineColor.appendChild(newColorLabel)
    newLineColor.appendChild(newColorInput)

    newColorLabel.setAttribute('for', 'colorLineInput')
    newColorLabel.textContent = 'color'

    newColorInput.setAttribute('name', 'colorLineInput')
    newColorInput.type = 'color'
    newColorInput.value = '#2edc4b'



    let justAWrapperDiv = document.createElement('div')
    justAWrapperDiv.classList.add('object-detail')
    justAWrapperDiv.shapeName = 'Line'
    justAWrapperDiv.appendChild(newLineInitial)
    justAWrapperDiv.appendChild(newLineFinal)
    justAWrapperDiv.appendChild(newLineAlgo)
    justAWrapperDiv.appendChild(newLineColor)
    justAWrapperDiv.appendChild(submitButtonContainerForNewObj)

    // for quick retrieval / extraction of info
    justAWrapperDiv.curve = line
    justAWrapperDiv.board = board
    justAWrapperDiv.curveType = 'line'
    justAWrapperDiv.algoSel = newAlgoSelect
    justAWrapperDiv.colSel = newColorInput
    justAWrapperDiv.initSel = [xInitialInput, yInitialInput]
    justAWrapperDiv.finalSel = [aFinalInput, bFinalInput]

    submitButtonContainerForNewObj.linkedTo = justAWrapperDiv;

    return justAWrapperDiv
}


let addCircleDetailInputer = () => {

    // these 2 are dummies // not used in entire function
    let circle = { center: [0, 0], radius: 1, color: null }
    let board = null

    // center data
    let newCircleCenter = document.createElement('div')

    newCircleCenter.classList.add('form-input-container')
    newCircleCenter.classList.add('indent')

    let newCircleCenterTextDiv = document.createElement('div')
    newCircleCenterTextDiv.textContent = 'center'
    newCircleCenter.appendChild(newCircleCenterTextDiv)

    let newCircleCenterData = document.createElement('div')
    newCircleCenterData.classList.add('two-inputs')
    newCircleCenter.appendChild(newCircleCenterData)


    let xCenterLabel = document.createElement('label')
    let xCenterInput = document.createElement('input')

    let yCenterLabel = document.createElement('label')
    let yCenterInput = document.createElement('input')

    newCircleCenterData.appendChild(xCenterLabel)
    newCircleCenterData.appendChild(xCenterInput)
    newCircleCenterData.appendChild(yCenterLabel)
    newCircleCenterData.appendChild(yCenterInput)

    xCenterLabel.setAttribute('for', 'xCenterInput')
    yCenterLabel.setAttribute('for', 'yCenterInput')
    xCenterLabel.textContent = 'x'
    yCenterLabel.textContent = 'y'

    xCenterInput.setAttribute('type', 'number')
    xCenterInput.setAttribute('name', 'xCenterInput')
    // xCenterInput.setAttribute('id', 'input-circle-center-x')
    xCenterInput.setAttribute('step', '1')
    xCenterInput.setAttribute('value', '0')

    yCenterInput.setAttribute('type', 'number')
    yCenterInput.setAttribute('name', 'yCenterInput')
    // yCenterInput.setAttribute('id', 'input-circle-center-y')
    yCenterInput.setAttribute('step', '1')
    yCenterInput.setAttribute('value', '0')

    // radius
    let newCircleRadius = document.createElement('div')
    newCircleRadius.classList.add('form-input-container')
    newCircleRadius.classList.add('indent')
    let newRadiusLabel = document.createElement('label')
    let newRadiusInput = document.createElement('input')
    newCircleRadius.appendChild(newRadiusLabel)
    newCircleRadius.appendChild(newRadiusInput)

    newRadiusLabel.setAttribute('for', 'radiusCircleInput')
    newRadiusLabel.textContent = 'radius'

    newRadiusInput.setAttribute('name', 'radiusCircleInput')
    newRadiusInput.type = 'number'
    newRadiusInput.min = '1'
    newRadiusInput.max = '100'
    newRadiusInput.step = '1'
    newRadiusInput.value = '10'

    // algo
    let newCircleAlgo = document.createElement('div')
    newCircleAlgo.classList.add('form-input-container')
    newCircleAlgo.classList.add('indent')
    let newAlgoLabel = document.createElement('label')
    let newAlgoSelect = document.createElement('select')
    newCircleAlgo.appendChild(newAlgoLabel)
    newCircleAlgo.appendChild(newAlgoSelect)

    newAlgoLabel.textContent = 'algo'

    let newAlgoOption1 = document.createElement('option')
    let newAlgoOption2 = document.createElement('option')
    newAlgoSelect.appendChild(newAlgoOption1)
    newAlgoSelect.appendChild(newAlgoOption2)

    newAlgoOption1.value = 'bh'
    newAlgoOption2.value = 'mp'
    newAlgoOption1.textContent = 'bresenham'
    newAlgoOption2.textContent = 'mid point'

    // color
    let newCircleColor = document.createElement('div')
    newCircleColor.classList.add('form-input-container')
    newCircleColor.classList.add('indent')
    let newColorLabel = document.createElement('label')
    let newColorInput = document.createElement('input')
    newCircleColor.appendChild(newColorLabel)
    newCircleColor.appendChild(newColorInput)

    newColorLabel.setAttribute('for', 'colorCircleInput')
    newColorLabel.textContent = 'color'

    newColorInput.setAttribute('name', 'colorCircleInput')
    newColorInput.type = 'color'
    newColorInput.value = '#ffabcd'



    let justAWrapperDiv = document.createElement('div')
    justAWrapperDiv.classList.add('object-detail')
    justAWrapperDiv.shapeName = 'Circle'
    justAWrapperDiv.appendChild(newCircleCenter)
    justAWrapperDiv.appendChild(newCircleRadius)
    justAWrapperDiv.appendChild(newCircleAlgo)
    justAWrapperDiv.appendChild(newCircleColor)
    justAWrapperDiv.appendChild(submitButtonContainerForNewObj)

    // for quick retrieval / extraction of info
    justAWrapperDiv.curve = circle
    justAWrapperDiv.board = board
    justAWrapperDiv.curveType = 'circle'
    justAWrapperDiv.algoSel = newAlgoSelect
    justAWrapperDiv.colSel = newColorInput
    justAWrapperDiv.radiusSel = newRadiusInput
    justAWrapperDiv.centerSel = [xCenterInput, yCenterInput]

    submitButtonContainerForNewObj.linkedTo = justAWrapperDiv;

    return justAWrapperDiv
}

let addEllipseDetailInputer = () => {

    // these 2 are dummies // not used in entire function
    let ellipse = { center: [0, 0], a: 1, b: 1, color: null }
    let board = null

    let newEllipseCenter = document.createElement('div')

    newEllipseCenter.classList.add('form-input-container')
    newEllipseCenter.classList.add('indent')

    let newEllipseCenterTextDiv = document.createElement('div')
    newEllipseCenterTextDiv.textContent = 'center'
    newEllipseCenter.appendChild(newEllipseCenterTextDiv)

    let newEllipseCenterData = document.createElement('div')
    newEllipseCenterData.classList.add('two-inputs')
    newEllipseCenter.appendChild(newEllipseCenterData)


    let xCenterLabel = document.createElement('label')
    let xCenterInput = document.createElement('input')

    let yCenterLabel = document.createElement('label')
    let yCenterInput = document.createElement('input')

    newEllipseCenterData.appendChild(xCenterLabel)
    newEllipseCenterData.appendChild(xCenterInput)
    newEllipseCenterData.appendChild(yCenterLabel)
    newEllipseCenterData.appendChild(yCenterInput)

    xCenterLabel.setAttribute('for', 'xCenterInput')
    yCenterLabel.setAttribute('for', 'yCenterInput')
    xCenterLabel.textContent = 'x'
    yCenterLabel.textContent = 'y'

    xCenterInput.setAttribute('type', 'number')
    xCenterInput.setAttribute('name', 'xCenterInput')
    xCenterInput.setAttribute('step', '1')
    xCenterInput.setAttribute('value', '0')

    yCenterInput.setAttribute('type', 'number')
    yCenterInput.setAttribute('name', 'yCenterInput')
    yCenterInput.setAttribute('step', '1')
    yCenterInput.setAttribute('value', '0')

    // radius
    let newEllipseRadii = document.createElement('div')

    newEllipseRadii.classList.add('form-input-container')
    newEllipseRadii.classList.add('indent')

    let newEllipseRadiiTextDiv = document.createElement('div')
    newEllipseRadiiTextDiv.textContent = 'radii'
    newEllipseRadii.appendChild(newEllipseRadiiTextDiv)

    let newEllipseRadiiData = document.createElement('div')
    newEllipseRadiiData.classList.add('two-inputs')
    newEllipseRadii.appendChild(newEllipseRadiiData)


    let aRadiusLabel = document.createElement('label')
    let aRadiusInput = document.createElement('input')

    let bRadiusLabel = document.createElement('label')
    let bRadiusInput = document.createElement('input')

    newEllipseRadiiData.appendChild(aRadiusLabel)
    newEllipseRadiiData.appendChild(aRadiusInput)
    newEllipseRadiiData.appendChild(bRadiusLabel)
    newEllipseRadiiData.appendChild(bRadiusInput)

    aRadiusLabel.textContent = 'a'
    bRadiusLabel.textContent = 'b'

    aRadiusInput.setAttribute('type', 'number')
    aRadiusInput.setAttribute('step', '1')
    aRadiusInput.setAttribute('value', '3')
    aRadiusInput.setAttribute('min', '1')
    aRadiusInput.setAttribute('max', '100')

    bRadiusInput.setAttribute('type', 'number')
    bRadiusInput.setAttribute('step', '1')
    bRadiusInput.setAttribute('value', '2')
    bRadiusInput.setAttribute('min', '1')
    bRadiusInput.setAttribute('max', '100')


    // algo
    let newEllipseAlgo = document.createElement('div')
    newEllipseAlgo.classList.add('form-input-container')
    newEllipseAlgo.classList.add('indent')
    let newAlgoLabel = document.createElement('label')
    let newAlgoSelect = document.createElement('select')
    newEllipseAlgo.appendChild(newAlgoLabel)
    newEllipseAlgo.appendChild(newAlgoSelect)

    newAlgoLabel.textContent = 'algo'

    // let newAlgoOption1 = document.createElement('option')
    let newAlgoOption2 = document.createElement('option')
    // newAlgoSelect.appendChild(newAlgoOption1)
    newAlgoSelect.appendChild(newAlgoOption2)

    // newAlgoOption1.value = 'bh'
    newAlgoOption2.value = 'mpe'
    // newAlgoOption1.textContent = 'bresenham'
    newAlgoOption2.textContent = 'mid point'

    // color
    let newEllipseColor = document.createElement('div')
    newEllipseColor.classList.add('form-input-container')
    newEllipseColor.classList.add('indent')
    let newColorLabel = document.createElement('label')
    let newColorInput = document.createElement('input')
    newEllipseColor.appendChild(newColorLabel)
    newEllipseColor.appendChild(newColorInput)

    newColorLabel.setAttribute('for', 'colorEllipseInput')
    newColorLabel.textContent = 'color'

    newColorInput.setAttribute('name', 'colorEllipseInput')
    newColorInput.type = 'color'
    newColorInput.value = '#0c99ac'




    let justAWrapperDiv = document.createElement('div')
    justAWrapperDiv.classList.add('object-detail')
    justAWrapperDiv.shapeName = 'Ellipse'
    justAWrapperDiv.appendChild(newEllipseCenter)
    justAWrapperDiv.appendChild(newEllipseRadii)
    justAWrapperDiv.appendChild(newEllipseAlgo)
    justAWrapperDiv.appendChild(newEllipseColor)
    justAWrapperDiv.appendChild(submitButtonContainerForNewObj)

    // for quick retrieval / extraction of info
    justAWrapperDiv.curve = ellipse
    justAWrapperDiv.board = board
    justAWrapperDiv.curveType = 'ellipse'
    justAWrapperDiv.algoSel = newAlgoSelect
    justAWrapperDiv.colSel = newColorInput
    justAWrapperDiv.radiiSel = [aRadiusInput, bRadiusInput]
    justAWrapperDiv.centerSel = [xCenterInput, yCenterInput]

    submitButtonContainerForNewObj.linkedTo = justAWrapperDiv;

    return justAWrapperDiv
}


// event listern attached to select [ line/circle/ellipse]
// -> event listern attached to creation in within.
document.getElementById('createNewObject').addEventListener('change',
    function () {
        // console.log('select option changed to', this.value)
        let detailInput = null
        newObjectDetailContainerElement.textContent = ''
        newObjectDetailContainerElement.value = this.value

        switch (this.value) {
            case 'Line':
            case 'line':
                detailInput = addLineDetailInputer()
                break;
            case 'circle':
            case 'Circle':
                detailInput = addCircleDetailInputer()
                break;
            case 'ellipse':
            case 'Ellipse':
                detailInput = addEllipseDetailInputer()
                break;
            default:
                newObjectDetailContainerElement.textContent = ''
        }
        if (detailInput != null) {
            newObjectDetailContainerElement.appendChild(detailInput)
        }


    }
)


// event listener to create button to be attached here

/***
 * this function gives  curve data
 * used with createNewBoard (only)
 * @param dataContainer a DIV containing data about shape (html input form)
 * @return curve
 */
const extractCurveFromDataContainer = (dataContainer) => {
    switch (dataContainer.curveType) {
        case 'line':
            return {
                start: dataContainer.initSel.map(coorDiv => Number(coorDiv.value)),
                end: dataContainer.finalSel.map(coorDiv => Number(coorDiv.value)),
                color: dataContainer.colSel.value
            }
        case 'circle':
            return {
                center: dataContainer.centerSel.map(coorDiv => Number(coorDiv.value)),
                radius: Number(dataContainer.radiusSel.value),
                color: dataContainer.colSel.value
            }
        case 'ellipse':
            let radii = dataContainer.radiiSel.map(coorDiv => Number(coorDiv.value));
            return {
                center: dataContainer.centerSel.map(coorDiv => Number(coorDiv.value)),
                a: radii[0], b: radii[1], color: dataContainer.colSel.value
            }
    }

    throw new Error("unable to extract curve data")
}

inputBtnInSBFNO.addEventListener('click', function () {

    let btnContainer = submitButtonContainerForNewObj
    let dataContainer = btnContainer.linkedTo;
    if (dataContainer == null) return;

    // unlinking of submit button(container)
    dataContainer.removeChild(btnContainer)
    btnContainer.linkedTo = null;

    const shapeType = newObjectDetailContainerElement.value

    // let newElemContainer = dataContainer.parentElement
    newObjectDetailContainerElement.removeChild(dataContainer)
    newObjectDetailContainerElement.value = 'select'

    document.getElementById('createNewObject').value = 'select'

    let newID = getID()

    // create info-DIV
    shapeObjList.appendChild(createObjectForObjList(dataContainer, newID))

    // checking with board to create 
    switch (shapeType) {
        case 'line':
            switch (dataContainer.algoSel.value) {
                case 'bhl': dataContainer.board = lineBHBoard; break;
            }
            break;
        case 'circle':
            switch (dataContainer.algoSel.value) {
                case 'bh': dataContainer.board = circleBHBoard; break;
                case 'mp': dataContainer.board = circleMPBoard; break;
            }
            break;
        case 'ellipse':
            switch (dataContainer.algoSel.value) {
                case 'mpe': dataContainer.board = ellipseMPBoard; break;
            }
            break;
    }

    if (shapeType == null || shapeType == 'select') {
        throw new Error('curve has no type!')
    }

    // disabling board/algo change
    dataContainer.algoSel.disabled = true
    dataContainer.curve = extractCurveFromDataContainer(dataContainer)

    // create p5sketch
    let newBoard = createNewBoard(dataContainer.board, dataContainer.curve, newID);
    newBoard.dataContainer = dataContainer; // this would help in curve change(RENDER)
    // used in makeRenderBtn function
})


// -- end-- 


// event listener for RESET origin
document.getElementById('resetOrigin').addEventListener('click', () => {
    axes.resetOrigin();
    for (let cnv in allCanvas) {
        allCanvas[cnv].reDraw();
    }
})