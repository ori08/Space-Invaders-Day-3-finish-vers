'use strict'

const EMPTY = "";
const BOARD_SIZE = 14;
const SUPER_MODE = "╦╤─"
const SHIELD = '🔰'
const CANDY = '<img  src="img/candy.png"/>'
const LIVE = "♥"
const BUNKER = '<img  src="img/Wall.png"/>'

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0,
    lives: 3
}

var gInterval_Move_Allien;
var gInterval_Add_Bonus;
var gInterval_HERO
var gInterval_ALLIEN

var skin_Img_Num = 1
var isGameStartFromBrowser = false
var isTimerOn = false

function init() {
    renderGroup()
    gBoard = createBoard()
    gHero = createHero(gBoard)
    createAlliens(gBoard)
    startIntervals()
    renderBoard(gBoard)
}

// Board build function:

function createBoard() {

    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = EMPTY
        }

    }

    board[BOARD_SIZE - 4][3] = BUNKER
    board[BOARD_SIZE - 8][9] = BUNKER
    board[BOARD_SIZE - 7][7] = BUNKER
    board[BOARD_SIZE - 5][1] = BUNKER
    return board;
}

// Startup functions:

function resetGame() {
    startGame()
}

function startGame() {
    isGameStartFromBrowser = true
    setLevel("Easy")//defult level
}

function setLevel(lv) {
    switch (lv) {
        case 'Easy': {
            setGameLevelParmeters(3, 700)
        }
            break;
        case 'Normal': {
            setGameLevelParmeters(4, 500)
        }
            break;
        case 'Hard': {
            setGameLevelParmeters(5, 300)
        }
            break;
    }
}

function setGameLevelParmeters(AliienRows, AllienSpeed) {
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = AliienRows
    ALIENS_ROW_COUNT = AliienRows
    Allien_SPEED = AllienSpeed
    resetAllVarable()
    init()
}

function resetAllVarable() {
    gGame = {
        isOn: true,
        aliensCount: 0,
        score: 0
    }
    gAlliens = []
    gHero.isShoot = false
    gRock.isShoot = false
    gRock.isIntervalClear = true
    gGame.lives = 3
    isHitWall = false
    gFirstMove = true
    Super_Mode_For_Used = 3
    Shield_For_Used = 3
    clearInterval(gInterval_Move_Laser)
    clearInterval(gInterval_Move_Allien)
    clearInterval(gInterval_Add_Bonus)
    clearInterval(gInterval_Rock)
}

function isWin() {
    if (gAlliens.length === 0) {
        BestScore()
        gGame.isOn = false
        openModal(".winModal")
    }
}

function isGameOver() {
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.i === BOARD_SIZE - 2 || gGame.lives === 0) {
            BestScore()
            gGame.isOn = false
            openModal(".gameOverModal")
        }
    }
}

function startIntervals() {
    gInterval_Move_Allien = setInterval(moveAlliens, Allien_SPEED)
    gInterval_Add_Bonus = setInterval(addRandomBonus, 10000)
    gInterval_HERO = setInterval(renderHero, 20)
    gInterval_ALLIEN = setInterval(renderAlliens, 20)
}

//Render Functions:

function renderBoard(board) {
    var strHtml = ""
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board[0].length; j++) {

            strHtml += `<td class="cell-${i}-${j}">
             ${board[i][j]}`
        }
        strHtml += `</td ></tr > `
    }
    document.querySelector(`.gameBoard`).innerHTML = strHtml
    changeBackgroundImgCell('Bg', skin_Img_Num)
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function renderScore(score) {
    gGame.score += score
    var elScore = document.querySelector(".score")
    elScore.innerText = gGame.score
}

function renderGameMode(className, title, symbol, count) {
    var elSuperMode = document.querySelector(className);
    var value = symbol.repeat(count)
    elSuperMode.innerText = `${title} : \n ${value}`;
}

function renderCustimizeModal() {
    var strHtml_Allien = ""
    var strHtml_Spaceship = ""
    var strHtml_CellBackgronud = ""

    var elAllien = document.querySelector(".allienGroup")
    var elSpaceship = document.querySelector(".spaceshipGroup")
    var elCell_Background = document.querySelector(".cellBackground")

    for (var i = 1; i <= 5; i++) {
        strHtml_Allien += `<img class="Beast${i}" src="img/Beast${i}.png" onclick="setSpirtImg('Beast',${i},'ALIEN')">`
        strHtml_Spaceship += `<img class="Spaceship${i}" src="img/Spaceship${i}.png" onclick="setSpirtImg('Spaceship',${i},'HERO')">`
        strHtml_CellBackgronud += `<img class="Bg${i}" src="img/cell${i}.png" onclick="changeBackgroundImgCell('Bg',${i})">`
    }

    elAllien.innerHTML = strHtml_Allien
    elSpaceship.innerHTML = strHtml_Spaceship
    elCell_Background.innerHTML = strHtml_CellBackgronud
}

function renderGroup() {
    BestScore()
    renderCustimizeModal()
    renderScore(0)
    renderGameMode(".superMode", "Super-Mode", SUPER_MODE, Super_Mode_For_Used)
    renderGameMode(".shiled", "Shield", SHIELD, Shield_For_Used)
    renderGameMode(".lives", "Lives", LIVE, gGame.lives)
    closeModal(".winModal")
    closeModal(".gameOverModal")
}

function openModal(modalName) {
    gGame.isOn = false
    var elModal = document.querySelector(modalName)
    elModal.style.display = "flex"
}

function closeModal(modalName) {
    var elModal = document.querySelector(modalName)
    elModal.style.display = "none"

    if (isGameStartFromBrowser === true
        && (modalName === ".costomizeModal"
            || modalName === ".Manual")) gGame.isOn = true
}

//read keyboard key from user 
function readKeyboard(ev) {
    if (!gGame.isOn) return

    switch (ev.code) {
        case 'ArrowLeft': {
            moveHero(ev)
        }
            break;
        case 'ArrowRight': {
            moveHero(ev)
        }
            break;
        case "Space": {
            LASER = '<img src="img/laser.png" />';
            gLaser.speed = 60;
            gLaser.startPoint = gHero.pos.j
            if (!gHero.isShoot) gInterval_Move_Laser = setInterval(shotLaser, gLaser.speed)
            gHero.isShoot = true
        }
            break;
        case "KeyN": {
            killNeighbors()
        }
            break;
        case "KeyX": {
            if (Super_Mode_For_Used === 0) return
            superMode()
            //print on html the Super Mode in used ammount
            renderGameMode(".superMode", "Super-Mode", SUPER_MODE, Super_Mode_For_Used)
        }
            break;
        case "KeyZ": {
            if (gHero.isShield || Shield_For_Used === 0) return
            shieldMode()
            renderGameMode(".shiled", "Shield", SHIELD, Shield_For_Used)
        }
            break;
    }
}

// Bonus add every 10 sec functions: 

function findEmetyCells() {
    var board = gBoard
    var emptyCells = []
    var i = BOARD_SIZE - 2
    for (var j = 0; j < BOARD_SIZE - 1; j++) {
        if (board[i][j] !== HERO) emptyCells.push({ i: i, j: j })
    }

    return emptyCells
}

function getRandomEmetyCell() {
    var emptyCells = findEmetyCells()
    var randomEmptyCell = emptyCells[getRandomIntInc(0, emptyCells.length - 1)]
    return randomEmptyCell
}

function addRandomBonus() {
    if (!gGame.isOn) return
    var board = gBoard
    var cellPos = getRandomEmetyCell()
    board[cellPos.i][cellPos.j] = CANDY
    renderCell(cellPos, CANDY)

    setTimeout(() => {
        board[cellPos.i][cellPos.j] = EMPTY;

        // prevent rerendering a game after a win
        renderCell(cellPos, EMPTY)
    }, 5000);

}





