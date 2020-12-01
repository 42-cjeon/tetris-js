class Tetris {
    constructor() {
        this.board = document.createElement("div")
        this.board.id = "board"
        this.state = []
        this.intervalHandler = null
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

        let row_state = []
        for (let i = 0; i < 10; i++) {
            row_state.push(-1)
        }
        for (let i = 0; i < 20; i++) {
            this.state.push(row_state.slice())
        }
        document.getElementById("main").appendChild(this.board)
    }
    getNewBrick = function() {
        const kind = Math.floor(Math.random() * 7)
        return {
            x: 3,
            y: -4,
            kind: kind,
            prevShape: this.bricks[kind],
            currentShape: this.bricks[kind]
        }
    }
}

let tetris = new Tetris()