class Tetris {
    constructor() {
        this.board = document.createElement("div")
        this.board.id = "board"
        this.state = []
        this.intervalHandler = null
        this.brickFallPeriod = 60
        this.waitedFrames = 0
        this.Directions = Object.freeze({LEFT: 0, DOWN: 1, RIGHT: 2})
        this.bricks = 
        [
            [
                [0, 0, 0, 0], 
                [0, 1, 1, 0], 
                [0, 1, 1, 0], 
                [0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0], 
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0], 
                [0, 0, 1, 1], 
                [0, 1, 1, 0], 
                [0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0], 
                [0, 1, 1, 0], 
                [0, 0, 1, 1], 
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0], 
                [0, 1, 0, 0], 
                [0, 1, 1, 1], 
                [0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0], 
                [0, 0, 0, 1], 
                [0, 1, 1, 1], 
                [0, 0, 0, 0]
            ], 
            [
                [0, 0, 0, 0], 
                [0, 0, 1, 0], 
                [0, 1, 1, 1], 
                [0, 0, 0, 0]
            ]
        ]
        this.currentBrick = this.getNewBrick()
        
        let row
        let cell
        for (let i = 0; i < 20; i++) {
            row = document.createElement("div")
            row.className = "row"
            row.id = "row_" + i
            for (let j = 0; j < 10; j++) {
                cell = document.createElement("div")
                cell.className = "cell"
                cell.id = "cell_" + j + "_" + i
                row.appendChild(cell)
            }
            this.board.appendChild(row)
        }

        let stateRow = []
        for (let i = 0; i < 10; i++) {
            stateRow.push(-1)
        }
        for (let i = 0; i < 20; i++) {
            this.state.push(stateRow.slice())
        }
        document.getElementById("main").appendChild(this.board)

        this.eraseBrick = this.forEachPartOfBricks(this.eraseBrick)
        this.drawBrick = this.forEachPartOfBricks(this.drawBrick)
        this.isPlaceable = this.forEachPartOfBricks(this.isPlaceable)

        document.addEventListener("keydown", this.handleUserControl.bind(this))
    }
    getNewBrick() {
        const kind = Math.floor(Math.random() * 7)
        return {
            x: 3,
            y: -3,
            kind: kind,
            shape: this.bricks[kind]
        }
    }
    drawPart(y, x, color) {
        let cellElem = document.createElement("div")
        cellElem.className = "cell"
        if(color >= 0) {
            cellElem.className += (" color-" + color)
        }
        const id = "cell_" + x + "_" + y
        cellElem.id = id
        document.getElementById(id).replaceWith(cellElem)
        this.state[y][x] = color
    }

    //decorator
    forEachPartOfBricks(func) {
        return function() {
            for(let partY = 0; partY < 4; partY++) {
                for(let partX = 0; partX < 4; partX++) {
                    if(this.currentBrick.shape[partY][partX] == 1) {
                        const absPartX = this.currentBrick.x + partX
                        const absPartY = this.currentBrick.y + partY
                        if(absPartY < 0) continue
                        const result = func.call(this, absPartY, absPartX)
                        if (result !== undefined && result !== true) return result
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
    isPlaceable(absPartY, absPartX) {
        // 화면 벗어났을 때 (위로 벗어나는경우 제외)
        if(absPartY >= 20 || absPartX < 0 || absPartX >= 10) {
            return false
        }
        // 이미 블럭이 있을 때
        else if(this.state[absPartY][absPartX] !== -1) {
            return false
        }
        else {
            return true
        }
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
        this.start()
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
                this.currentBrick = this.getNewBrick()
            }
            this.waitedFrames = 0
        }
        this.waitedFrames += 1
    }
    handleUserControl(event) {
        console.log(this.Directions)
        switch(event.key) {
            case "ArrowLeft":
                this.moveBrick(this.Directions.LEFT)
                break
            case "ArrowRight":
                this.moveBrick(this.Directions.RIGHT)
                break
            case "ArrowDown":
                this.moveBrick(this.Directions.DOWN)
        }
    }
    start() {
        this.intervalHandler = setInterval(function(){
            this.updateFrame()
        }.bind(this), 50 / 3)
    }
    pause() {
        if(this.intervalHandler !== null) {
            clearInterval(this.intervalHandler)
        }
    }

}

let tetris = new Tetris()
tetris.start()