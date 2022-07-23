'use strict'
var HERO = '<img src="img/Spaceship1.png" />';
var LASER = '<img src="img/laser.png" />';

var gHero;
var gLaser = {
    pos: null,
    speed: 60,
    distance: 1,
    startPoint: null,
}
var Super_Mode_For_Used = 3
var Shield_For_Used = 3
var gInterval_Move_Laser


//Hero part functions:

function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        isShield: false
    }
    board[gHero.pos.i][gHero.pos.j] = HERO
    return gHero
}

function moveHero(ev) {
    if (!gGame.isOn) return

    var nextLocation = getNextLocation(ev)
    // varified that hero not pass the wall
    if (nextLocation.j < 0 || nextLocation.j > BOARD_SIZE - 1) return

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === CANDY) spaceCandy()
    //Update the board
    gBoard[gHero.pos.i][gHero.pos.j] = EMPTY
    // TODO: update the DOM
    renderCell(gHero.pos, EMPTY)

    gHero.pos = nextLocation
    //Update the board
    gBoard[gHero.pos.i][gHero.pos.j] = HERO
    // TODO: update the DOM
    renderCell(gHero.pos, HERO)
}

function getNextLocation(ev) {

    var nextLocation = {
        i: gHero.pos.i,
        j: gHero.pos.j,
    }

    switch (ev.code) {

        case 'ArrowLeft': {
            nextLocation.j--
        }
            break;

        case 'ArrowRight': {
            nextLocation.j++
        }
            break;
    }
    return nextLocation;
}

function renderHero() {
    gBoard[gHero.pos.i][gHero.pos.j] = HERO
    renderCell(gHero.pos, HERO)
}


// Laser part functions: 

function shotLaser() {
    if (!gGame.isOn) return

    gLaser.pos = { i: gHero.pos.i - gLaser.distance, j: gLaser.startPoint }
    // If the laser pass the board top limit TODO
    if (gLaser.pos.i < 0) {
        gLaser.pos = null
        gBoard[0][gLaser.startPoint] = EMPTY
        renderCell({ i: 0, j: gLaser.startPoint }, EMPTY)
        clearInterval(gInterval_Move_Laser)
        gHero.isShoot = false
        gLaser.distance = 1
        return
    }
    renderLaser()
    gLaser.distance++
}

function renderLaser() {
    var board = gBoard
    var pos_Before_Laser = { i: gLaser.pos.i + 1, j: gLaser.pos.j }
    var cell_After_Laser = board[gLaser.pos.i][gLaser.pos.j]
    var cell_Before_Laser = board[pos_Before_Laser.i][pos_Before_Laser.j]

    if (cell_After_Laser === ALIEN || cell_After_Laser === BUNKER) {
        // Remove the allien from the alliens array 
        if (cell_After_Laser === ALIEN) killAliien(gLaser.pos)

        //Update the board 
        board[gLaser.pos.i][gLaser.pos.j] = EMPTY
        board[pos_Before_Laser.i][pos_Before_Laser.j] = EMPTY

        //When laser hit Allien or Bunker remove laser from board and exit the Interval
        clearInterval(gInterval_Move_Laser)
        gHero.isShoot = false
        gLaser.distance = 1
        //Update the DOM
        renderCell(gLaser.pos, EMPTY)
        renderCell(pos_Before_Laser, EMPTY)
        gLaser.pos = null
        return
    }

    if (cell_Before_Laser !== HERO) {
        board[pos_Before_Laser.i][pos_Before_Laser.j] = EMPTY
        renderCell(pos_Before_Laser, EMPTY)
    }

    board[gLaser.pos.i][gLaser.pos.j] = LASER
    renderCell(gLaser.pos, LASER)
}

function killNeighbors() {
    var board = gBoard
    var curCell_I = gLaser.pos.i
    var curCell_J = gLaser.pos.j

    for (var i = curCell_I - 1; i <= curCell_I + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = curCell_J - 1; j <= curCell_J + 1; j++) {

            if (j < 0 || j >= board[0].length) continue;
            if (i === curCell_I && j === curCell_J) continue;
            if (board[i][j] === ALIEN) {
                markCell(i, j)
                board[i][j] = EMPTY
                killAliien({ i: i, j: j })
                renderCell({ i: i, j: j }, EMPTY)
            }
        }
    }
}

function markCell(i, j) {
    document.querySelector(`.cell-${i}-${j}`).style.border = "1px solid red "
}

// Hero mode and bonus functions:

function superMode() {
    Super_Mode_For_Used--
    LASER = '<img src="img/super-mode.png" />';
    gLaser.speed = 40;
    gLaser.startPoint = gHero.pos.j
    if (!gHero.isShoot) gInterval_Move_Laser = setInterval(shotLaser, gLaser.speed)
}

function spaceCandy() {
    gAlliansFreaze = true
    renderScore(50)
    clearInterval(gInterval_Move_Allien)
    setTimeout(freazeAlliens, 5000)
    startTimer()

    function freazeAlliens() {
        gInterval_Move_Allien = setInterval(moveAlliens, Allien_SPEED)
        killTimer()
    }
}

function shieldMode() {

    HERO = '<img src="img/Shield.png" />'
    gHero.isShield = true
    Shield_For_Used--
    setTimeout(shieldModeOff, 5000)

    function shieldModeOff() {
        HERO = '<img src="img/Spaceship1.png" />';
        gHero.isShield = false
    }
}




