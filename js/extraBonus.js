'use strict'

function BestScore() {
    if (loadFromStorage("score")) {
        var bestScore = loadFromStorage("score")
        if (gGame.score > bestScore) saveToStorage("score", gGame.score)
    }
    else {
        saveToStorage("score", gGame.score)
        var bestScore = loadFromStorage("score")
    }
    document.querySelector(".best-score").innerText = bestScore
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}