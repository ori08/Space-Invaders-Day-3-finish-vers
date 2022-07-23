'use strict'
var ALIEN = '<img  src="img/Beast1.png" />';
const ROCK = '<img src="img/Stone.png" />'
var ALIENS_ROW_LENGTH = 8
var ALIENS_ROW_COUNT = 3
var Allien_SPEED = 700
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 3;

var isHitWall = false
var gAlliansFreaze = false
var gRandomAliien
var gInterval_Rock
var gFirstMove = true

var gAlliens = []
var gRock = {
    pos: null,
    speed: 140,
    distance: 1,
    startPoint: null,
    isIntervalClear: true,
    isShoot: false
}

// Aliiens functions:

function createAlliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {

        for (var j = BOARD_SIZE - 1; j >= BOARD_SIZE - ALIENS_ROW_LENGTH; j--) {

            var allien = {
                pos: { i: i, j: j },
                isShoot: false
            }
            board[i][j] = ALIEN
            gAlliens.push(allien)

        }
    }

}

function renderAlliens() {
    for (var i = 0; i < gAlliens.length; i++) {
        gBoard[gAlliens[i].pos.i][gAlliens[i].pos.j] = ALIEN
        renderCell(gAlliens[i].pos, ALIEN)
    }

}

function killAliien(pos) {
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.i === pos.i && gAlliens[i].pos.j === pos.j) {
            gAlliens.splice(i, 1)
            isWin()
            renderScore(10)
        }
    }
}


// Allien move functions: 

function moveAlliens() {
    if (!gGame.isOn) return

    var lastAllienIdx = 0
    var firstAllienIdx = Infinity

    // find the first and last allign in the j index
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.j < firstAllienIdx) firstAllienIdx = gAlliens[i].pos.j
        if (gAlliens[i].pos.j > lastAllienIdx) lastAllienIdx = gAlliens[i].pos.j
    }

    //if one of the allien hit the wall:
    //TODO shift down all the alliens 
    if (firstAllienIdx === 0 && isHitWall === false) {
        isHitWall = true
        shiftBoardDown(gBoard, firstAllienIdx, lastAllienIdx)
        return
    }
    //TODO shift down all the alliens 
    else if (lastAllienIdx === BOARD_SIZE - 1 && !gFirstMove && isHitWall === true) {
        isHitWall = false
        shiftBoardDown(gBoard, firstAllienIdx, lastAllienIdx)
        return
    }

    //Thorow rock from random allien
    if (gRock.isIntervalClear) {
        gRandomAliien = getRandomAllienCell()
        gRock.startPoint = gRandomAliien.j
        gInterval_Rock = setInterval(shotRock, gRock.speed)
    }


    // Tell the aliiens wheich side to move by boolean var
    //False for go left, and true for go right  
    for (var i = 0; i < gAlliens.length; i++) {
        if (!isHitWall) gAlliens[i].pos.j--
        else gAlliens[i].pos.j++
    }
    if (isHitWall) shiftBoardRight(gBoard, firstAllienIdx, lastAllienIdx)
    else shiftBoardLeft(gBoard, firstAllienIdx, lastAllienIdx)


    renderBoard(gBoard)
    gFirstMove = false
    isGameOver()
}

function shiftBoardRight(board, from, to) {
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = to; j >= from; j--) {
            var curCell = board[i][j]
            if (curCell === ALIEN) {
                board[i][j] = EMPTY
                board[i][j + 1] = ALIEN
            }
        }
    }
}

function shiftBoardLeft(board, from, to) {
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = from; j <= to; j++) {
            var curCell = board[i][j]
            if (curCell === ALIEN) {
                board[i][j] = EMPTY
                board[i][j - 1] = ALIEN
            }
        }
    }
}

function shiftBoardDown(board, from, to) {
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    //Update the gAliiens location array 
    for (var i = 0; i < gAlliens.length; i++) {
        gAlliens[i].pos.i++
    }
    //Update the board 
    for (var i = gAliensBottomRowIdx - 1; i >= gAliensTopRowIdx - 1; i--) {
        for (var j = to; j >= from; j--) {
            if (board[i][j] === ALIEN) {
                board[i + 1][j] = ALIEN
                board[i][j] = EMPTY
            }
        }
    }
    // Update the DOM
    renderBoard(gBoard)
}

// Return random cell contain allien functions: 

function findAlliensCells() {
    var board = gBoard
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === ALIEN) emptyCells.push({ i: i, j: j })
        }
    }
    return emptyCells
}

function getRandomAllienCell() {
    var emptyCells = findAlliensCells()
    var randomEmptyCell = emptyCells[getRandomIntInc(0, emptyCells.length - 1)]
    return randomEmptyCell
}

// Rock thorwn by the Aliien functions: 

function shotRock() {
    if (!gGame.isOn) return

    gRock.isIntervalClear = false
    gRock.pos = { i: gRandomAliien.i + gRock.distance, j: gRock.startPoint }
    // If the laser pass the board bottom limit TODO
    if (gRock.pos.i > BOARD_SIZE - 1) {
        removeRockFromBoard()
    }
    renderRock()
    gRock.distance++

}

function renderRock() {

    var board = gBoard
    var posBeforeRock = { i: gRock.pos.i - 1, j: gRock.pos.j }
    var cell_After_Rock = board[gRock.pos.i][gRock.pos.j]
    var cell_Before_Rock = board[posBeforeRock.i][posBeforeRock.j]

    if (cell_Before_Rock !== ALIEN) {
        board[posBeforeRock.i][posBeforeRock.j] = EMPTY
        renderCell(posBeforeRock, EMPTY)
    }

    if (cell_After_Rock === HERO && !gHero.isShield) {
        gGame.lives--
        renderGameMode(".lives", "Lives", LIVE, gGame.lives)
        removeRockFromBoard()
        redScrean()
    }

    if (cell_After_Rock === HERO && gHero.isShield) {
        removeRockFromBoard()
    }

    if (cell_After_Rock === BUNKER) {
        board[posBeforeRock.i][posBeforeRock.j] = EMPTY
        board[gRock.pos.i][gRock.pos.j] = EMPTY
        renderCell(posBeforeRock, EMPTY)
        renderCell(gRock.pos, EMPTY)
        gRock.pos = null
        clearInterval(gInterval_Rock)
        gRock.isShoot = false
        gRock.isIntervalClear = true
        gRock.distance = 1
        return
    }

    board[gRock.pos.i][gRock.pos.j] = ROCK
    renderCell(gRock.pos, ROCK)
}

function removeRockFromBoard() {
    gRock.pos = null
    gBoard[BOARD_SIZE - 1][gRock.startPoint] = EMPTY
    renderCell({ i: 0, j: gRock.startPoint }, EMPTY)
    clearInterval(gInterval_Rock)
    gRock.isShoot = false
    gRock.isIntervalClear = true
    gRock.distance = 1
    return
}

function redScrean() {
    document.body.style.filter = "hue-rotate(120deg)"
    setTimeout(removeRedScrean, 1000)

    function removeRedScrean() {
        document.body.style.filter = "hue-rotate(0deg)"
    }
}





