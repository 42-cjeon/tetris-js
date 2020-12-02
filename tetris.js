class Tetris {
    constructor() {
        this.board = null
        this.state = []
        this.intervalHandler = null
        this.brickFallPeriod = 60
        this.waitedFrames = 0
        this.Directions = Object.freeze({LEFT: 0, DOWN: 1, RIGHT: 2})
        this.bricks = 
        [
            {
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 0, 0], 
                    [0, 1, 1, 0], 
                    [0, 1, 1, 0]
                ],
                rotateShape: null
            }, 
            {
                shape:
                [
                    [0, 0, 1, 0], 
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]
                ],
                rotateShape: 2
            }, 
            {
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 0, 0], 
                    [0, 0, 1, 1], 
                    [0, 1, 1, 0]
                ],
                rotateShape: 4
            }, 
            {
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 0, 0], 
                    [0, 1, 1, 0], 
                    [0, 0, 1, 1]
                ],
                rotateShape: 4
            },
            {   
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 1, 0], 
                    [0, 0, 1, 0], 
                    [0, 0, 1, 1]
                ],
                rotateShape: 4
            }, 
            {
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 1, 0], 
                    [0, 0, 1, 0], 
                    [0, 1, 1, 0]
                ],
                rotateShape: 4
            },
            {
                shape:
                [
                    [0, 0, 0, 0], 
                    [0, 0, 1, 0], 
                    [0, 0, 1, 1], 
                    [0, 0, 1, 0]
                ],
                rotateShape: 4
            }
        ]
        this.currentBrick = this.getNewBrick()

        let stateRow = []
        for (let i = 0; i < 10; i++) {
            stateRow.push(-1)
        }
        for (let i = 0; i < 20; i++) {
            this.state.push(stateRow.slice())
        }
        this.drawAll()

        this.eraseBrick = this.forEachPartOfBricks(this.eraseBrick)
        this.drawBrick = this.forEachPartOfBricks(this.drawBrick)
        this.isPlaceable = this.forEachPartOfBricks(this.isPlaceable)
        this.confirmBrick = this.forEachPartOfBricks(this.confirmBrick)
        this.isContinued = this.forEachPartOfBricks(this.isContinued)
        this.thisBoundHandleUsercontrol = this.handleUserControl.bind(this)
    }
    getNewBrick() {
        const kind = Math.floor(Math.random() * 7)
        return {
            x: 3,
            y: -4,
            kind: kind,
            ...this.bricks[kind]
        }
    }
    drawPart(y, x, color) {
        if(y < 0) return
        let cellElem = document.createElement("div")
        cellElem.className = "cell"
        if(color >= 0) {
            cellElem.className += (` color-${color}`)
        }
        const id = "cell_" + x + "_" + y
        cellElem.id = id
        document.getElementById(id).replaceWith(cellElem)
    }
    drawAll() {
        this.board = document.createElement("div")
        this.board.id = "board"
        let row
        let cell
        for (let i = 0; i < 20; i++) {
            row = document.createElement("div")
            row.className = "row"
            row.id = "row_" + i
            for (let j = 0; j < 10; j++) {
                cell = document.createElement("div")
                cell.className = "cell"
                const color = this.state[i][j]
                if(color >= 0) {
                    cell.className += ` color-${color}`
                }
                cell.id = "cell_" + j + "_" + i
                row.appendChild(cell)
            }
            this.board.appendChild(row)
        }
        const prevBoard = document.getElementById("board")
        if(prevBoard) {
            prevBoard.replaceWith(this.board)
        }
        else {
            document.getElementById("main").appendChild(this.board)
        }
    }

    //decorator
    forEachPartOfBricks(func) {
        return function() {
            for(let partY = 0; partY < 4; partY++) {
                for(let partX = 0; partX < 4; partX++) {
                    if(this.currentBrick.shape[partY][partX] == 1) {
                        const absPartX = this.currentBrick.x + partX
                        const absPartY = this.currentBrick.y + partY
                        const result = func.call(this, absPartY, absPartX)
                        if (result !== undefined) return result
                    }
                }
            }
            return true
        }
    }

    //@forEachPartOfBricks
    drawBrick(absPartY, absPartX) {
        this.drawPart(absPartY, absPartX, this.currentBrick.kind)
    }
    //@forEachPartOfBricks
    eraseBrick(absPartY, absPartX) {
        this.drawPart(absPartY, absPartX, -1)
    }
    //@forEachPartOfBricks
    confirmBrick(absPartY, absPartX) {
        this.state[absPartY][absPartX] = this.currentBrick.kind
    }
    //@forEachPartOfBricks
    isPlaceable(absPartY, absPartX) {
        // 화면 벗어났을 때 (위로 벗어나는경우 제외)
        if(absPartY >= 20 || absPartX < 0 || absPartX >= 10) {
            return false
        }
        // 이미 블럭이 있을 때
        else if(absPartY >= 0 && this.state[absPartY][absPartX] !== -1) {
            return false
        }
    }
    //@forEachPartOfBricks
    isContinued(absPartY, _) {
        if(absPartY < 0) return false
    }
    moveBrick (direction) {
        this.pause()
        const {x, y} = this.currentBrick
        this.eraseBrick()
        if(direction === this.Directions.LEFT) {
            this.currentBrick.x -= 1
        } 
        else if(direction === this.Directions.RIGHT) {
            this.currentBrick.x += 1
        }
        else if(direction === this.Directions.DOWN) {
            this.currentBrick.y += 1
        }

        if(this.isPlaceable()) {
            this.drawBrick()
        }
        else{
            this.currentBrick.x = x
            this.currentBrick.y = y
            this.drawBrick()
        }
        this.currentBrick.y += 1
        if(!this.isPlaceable()) {
            this.waitedFrames = Math.floor(this.brickFallPeriod / 2)
        }
        this.currentBrick.y -= 1
        this.start()
    }
    rotateBrick() {
        this.eraseBrick()
        const currentShape = this.currentBrick.shape
        const rotateShape = this.currentBrick.rotateShape
        if(rotateShape) {
            let rotatedBrick = 
            [
                [0, 0, 0 ,0],
                [0, 0, 0 ,0],
                [0, 0, 0 ,0],
                [0, 0, 0 ,0]
            ]
            if(rotateShape == 2) {
                for(let y = 0; y < 4; y++) {
                    for(let x = 0; x < 4; x++) {
                        rotatedBrick[x][y] = this.currentBrick.shape[y][x]
                    }
                }
                this.currentBrick.shape = rotatedBrick
            }
            else if (rotateShape == 4) {
                for(let y = 1; y < 4; y++) {
                    for(let x = 1; x < 4; x++) {
                        rotatedBrick[y][x] = this.currentBrick.shape[4-x][y]
                    }
                }
                this.currentBrick.shape = rotatedBrick
            }
        }
        if(!this.isPlaceable()){
            this.currentBrick.shape = currentShape
        }
        this.drawBrick()
    }
    clearLine(y) {
        this.state.splice(y, 1)
        let emptyLine = []
        for(let i = 0; i < 10; i++) {
            emptyLine.push(-1)
        }
        this.state.unshift(emptyLine)
        this.drawAll()
        
    }
    checkLines() {
        let lineCleared
        for(let y = 0; y < 20; y++) {
            lineCleared = true
            for(let x = 0; x < 10; x++) {
                if(this.state[y][x] == -1) {
                    lineCleared = false
                    break
                }
            }
            if(lineCleared) {
                this.clearLine(y)
                y--
            }
        }
    }
    updateFrame() {
        if(this.waitedFrames >= this.brickFallPeriod) {
            this.eraseBrick()
            this.currentBrick.y += 1
            if(this.isPlaceable()) {
                this.drawBrick()
            } 
            else {
                this.currentBrick.y -= 1
                this.drawBrick()
                if(!this.isContinued()) {
                    this.gameover()
                    return
                }
                this.confirmBrick()
                this.checkLines()
                this.currentBrick = this.getNewBrick()
            }
            this.waitedFrames = 0
        }
        this.waitedFrames += 1
    }
    handleUserControl(event) {
        switch(event.key) {
            case "ArrowLeft":
                this.moveBrick(this.Directions.LEFT)
                break
            case "ArrowRight":
                this.moveBrick(this.Directions.RIGHT)
                break
            case "ArrowDown":
                this.moveBrick(this.Directions.DOWN)
                break
            case "ArrowUp":
                this.rotateBrick()
        }
    }
    start() {
        this.intervalHandler = setInterval(function(){
            this.updateFrame()
        }.bind(this), 50 / 3)
        document.addEventListener("keydown", this.thisBoundHandleUsercontrol)
    }
    pause() {
        if(this.intervalHandler !== null) {
            clearInterval(this.intervalHandler)
        }
        document.removeEventListener("keydown", this.thisBoundHandleUsercontrol)
    }
    gameover() {
        this.pause()
        console.log("Game Over !!!")
    }

}

let tetris = new Tetris()
tetris.start()