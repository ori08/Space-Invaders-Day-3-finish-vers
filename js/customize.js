'use strict'

function setSpirtImg(imgName, imgNum, Sprit) {
    if (Sprit === "ALIEN") {
        ALIEN = `<img src="img/${imgName}${imgNum}.png" />`
        markSelectedImg(imgName, imgNum)
    }
    else if (Sprit === "HERO") {
        HERO = `<img src="img/${imgName}${imgNum}.png" />`
        markSelectedImg(imgName, imgNum)
        gBoard[gHero.pos.i][gHero.pos.j] = HERO
        renderCell(gHero.pos, HERO)
    }
}

function markSelectedImg(typeOfImg, imgNum) {
    for (var i = 1; i <= 5; i++) {
        document.querySelector(`.${typeOfImg}${i}`).style.border = ""
    }
    document.querySelector(`.${typeOfImg}${imgNum}`).style.border = "1px solid red"
}

function changeBackgroundImgCell(class_Name, imgNum = 1) {
    document.body.style.backgroundImage = `url(img/background${imgNum}.png)`
    var elTd = document.querySelectorAll("td")
    elTd.forEach(td => {
        return td.style.backgroundImage = `url(img/cell${imgNum}.png)`
    })
    markSelectedImg(class_Name, imgNum)
    skin_Img_Num = imgNum
}