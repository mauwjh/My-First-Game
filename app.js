// Variable declaration
let diceResults = []
let bet = 0
let numOfPlayers = 3
let turnCounter = 1
let squaresWon = []
let chipsRemove = []
const DICE_ANIMATION_LENGTH = 4000
const HIGHLIGHT_SQUARES_LENGTH = 5000
const TOTAL_ANIMATION_LENGTH = DICE_ANIMATION_LENGTH + HIGHLIGHT_SQUARES_LENGTH

const diceImg = 
['Images/dice-six-faces-one.png',
'Images/dice-six-faces-two.png',
'Images/dice-six-faces-three.png',
'Images/dice-six-faces-four.png',
'Images/dice-six-faces-five.png',
'Images/dice-six-faces-six.png']

const diceAnimationClasses = [
    'shake',
    'reverse-shake',
    'shake',
]

// Player class declaration
class Player {
    constructor() {
        this.bets = Array(49).fill(0);
        this.bank = 2000;
        this.payout = [];
    }

    transferPayout() {
        if(this.payout.length > 0) {
            this.bank += this.payout.reduce((a,b) => a + b)
        }
        setTimeout(render, TOTAL_ANIMATION_LENGTH)
    }
}

// Player objects declaration
const players = [new Player(), new Player(), new Player()]

const playerChipColors = [
    [players[0], 'Images/Black-Chip.png', 'p1-chip'],
    [players[1], 'Images/Blue-Chip.png', 'p2-chip'],
    [players[2], 'Images/Grey-Chip.png', 'p3-chip'],
]

// tempBet function adds the value of the chip clicked to the global bet variable
const tempBet = (player, value) => () => {
    if(player.bank >= value) {
        bet += value
        player.bank -= value
    }
    render()
    $('.button').removeClass('disabled')
}

// playerBet function adds the value of the global bet variable to the relevant player's bet array with the player object. The position in the player's bet array is determined by which square is clicked on the board
const playerBet = (event) => {
    const chip = $('<div>').addClass('square-chips').attr('id', playerChipColors[turnCounter-1][2]).append($('<img>').attr('src', playerChipColors[turnCounter-1][1])).append($('<span>').text(bet))
    $(event.currentTarget).children().eq(0).append(chip)
    chipOffset = chip.offset()
    chip.hide()

    const bankOffset = $(`#p${turnCounter}-bank`).offset() 

    const temp = $('<div>').addClass('temp-chip').append($('<img>').attr('src', playerChipColors[turnCounter-1][1]))
    temp.appendTo('html')
    temp.css('top', bankOffset.top)
    temp.css('left', bankOffset.left)
    temp.animate({'top': chipOffset.top, 'left': chipOffset.left}, 500, () => {
        temp.remove()
        chip.show()
    })

    // $(event.currentTarget).children().eq(0).append($('<div>').addClass('square-chips').append($('<img>').attr('src', playerChipColors[turnCounter-1][1])).append($('<span>').text(bet)))
    players[turnCounter-1].bets[parseInt($(event.currentTarget).attr('id'))] += bet 
    bet = 0
    render()
}

// Roll dice 3 times and push into diceResults variable
const rollDice = () => {
    diceResults = []
    for(let i = 0; i < 3; i++) {
        diceResults.push(Math.floor(Math.random()*6)+1) 
    }
}

// Evaluate if win condition is met for each square
const winCheck = () => 
([
    {pos: 0, win: diceResults.reduce((a,b) => a+b) >= 4 && diceResults.reduce((a,b) => a+b) <= 10 && diceResults.filter(a => a === 1).length !== 3 && diceResults.filter(a => a === 2).length !== 3 && diceResults.filter(a => a === 3).length !== 3 && diceResults.filter(a => a === 4).length !== 3 && diceResults.filter(a => a === 5).length !== 3 && diceResults.filter(a => a === 6).length !== 3, odds: 1},
    {pos: 1, win: diceResults.filter(a => a === 1).length >= 2, odds: 11},
    {pos: 2, win: diceResults.filter(a => a === 2).length >= 2, odds: 11},
    {pos: 3, win: diceResults.filter(a => a === 3).length >= 2, odds: 11},
    {pos: 4, win: diceResults.filter(a => a === 1).length === 3, odds: 180},
    {pos: 5, win: diceResults.filter(a => a === 2).length === 3, odds: 180},
    {pos: 6, win: diceResults.filter(a => a === 3).length === 3, odds: 180},
    {pos: 7, win: diceResults.filter(a => a === 1).length === 3 || diceResults.filter(a => a === 2).length === 3 || diceResults.filter(a => a === 3).length === 3 || diceResults.filter(a => a === 4).length === 3 || diceResults.filter(a => a === 5).length === 3 || diceResults.filter(a => a === 6).length === 3, odds: 30},
    {pos: 8, win: diceResults.filter(a => a === 4).length === 3, odds: 180},
    {pos: 9, win: diceResults.filter(a => a === 5).length === 3, odds: 180},
    {pos: 10, win: diceResults.filter(a => a === 6).length === 3, odds: 180},
    {pos: 11, win: diceResults.filter(a => a === 4).length >= 2, odds: 11},
    {pos: 12, win: diceResults.filter(a => a === 5).length >= 2, odds: 11},
    {pos: 13, win: diceResults.filter(a => a === 6).length >= 2, odds: 11},
    {pos: 14, win: diceResults.reduce((a,b) => a+b) >= 11 && diceResults.reduce((a,b) => a+b) <= 17 && diceResults.filter(a => a === 1).length !== 3 && diceResults.filter(a => a === 2).length !== 3 && diceResults.filter(a => a === 3).length !== 3 && diceResults.filter(a => a === 4).length !== 3 && diceResults.filter(a => a === 5).length !== 3 && diceResults.filter(a => a === 6).length !== 3, odds: 1},
    {pos: 15, win: diceResults.reduce((a,b) => a+b) === 4, odds: 60},
    {pos: 16, win: diceResults.reduce((a,b) => a+b) === 5, odds: 20},
    {pos: 17, win: diceResults.reduce((a,b) => a+b) === 6, odds: 18},
    {pos: 18, win: diceResults.reduce((a,b) => a+b) === 7, odds: 12},
    {pos: 19, win: diceResults.reduce((a,b) => a+b) === 8, odds: 8},
    {pos: 20, win: diceResults.reduce((a,b) => a+b) === 9, odds: 6},
    {pos: 21, win: diceResults.reduce((a,b) => a+b) === 10, odds: 6},
    {pos: 22, win: diceResults.reduce((a,b) => a+b) === 11, odds: 6},
    {pos: 23, win: diceResults.reduce((a,b) => a+b) === 12, odds: 6},
    {pos: 24, win: diceResults.reduce((a,b) => a+b) === 13, odds: 8},
    {pos: 25, win: diceResults.reduce((a,b) => a+b) === 14, odds: 12},
    {pos: 26, win: diceResults.reduce((a,b) => a+b) === 15, odds: 18},
    {pos: 27, win: diceResults.reduce((a,b) => a+b) === 16, odds: 20},
    {pos: 28, win: diceResults.reduce((a,b) => a+b) === 17, odds: 60},
    {pos: 29, win: diceResults.filter(a => a === 1).length >= 1 && diceResults.filter(a => a === 2).length >= 1, odds: 6},
    {pos: 30, win: diceResults.filter(a => a === 1).length >= 1 && diceResults.filter(a => a === 3).length >= 1, odds: 6},
    {pos: 31, win: diceResults.filter(a => a === 1).length >= 1 && diceResults.filter(a => a === 4).length >= 1, odds: 6},
    {pos: 32, win: diceResults.filter(a => a === 1).length >= 1 && diceResults.filter(a => a === 5).length >= 1, odds: 6},
    {pos: 33, win: diceResults.filter(a => a === 1).length >= 1 && diceResults.filter(a => a === 6).length >= 1, odds: 6},
    {pos: 34, win: diceResults.filter(a => a === 2).length >= 1 && diceResults.filter(a => a === 3).length >= 1, odds: 6},
    {pos: 35, win: diceResults.filter(a => a === 2).length >= 1 && diceResults.filter(a => a === 4).length >= 1, odds: 6},
    {pos: 36, win: diceResults.filter(a => a === 2).length >= 1 && diceResults.filter(a => a === 5).length >= 1, odds: 6},
    {pos: 37, win: diceResults.filter(a => a === 2).length >= 1 && diceResults.filter(a => a === 6).length >= 1, odds: 6},
    {pos: 38, win: diceResults.filter(a => a === 3).length >= 1 && diceResults.filter(a => a === 4).length >= 1, odds: 6},
    {pos: 39, win: diceResults.filter(a => a === 3).length >= 1 && diceResults.filter(a => a === 5).length >= 1, odds: 6},
    {pos: 40, win: diceResults.filter(a => a === 3).length >= 1 && diceResults.filter(a => a === 6).length >= 1, odds: 6},
    {pos: 41, win: diceResults.filter(a => a === 4).length >= 1 && diceResults.filter(a => a === 5).length >= 1, odds: 6},
    {pos: 42, win: diceResults.filter(a => a === 4).length >= 1 && diceResults.filter(a => a === 6).length >= 1, odds: 6},
    {pos: 43, win: diceResults.filter(a => a === 5).length >= 1 && diceResults.filter(a => a === 6).length >= 1, odds: 6},
    {pos: 44, win: diceResults.filter(a => a === 1).length === 1, odds: 1},
    {pos: 44, win: diceResults.filter(a => a === 1).length === 2, odds: 2},
    {pos: 44, win: diceResults.filter(a => a === 1).length === 3, odds: 3},
    {pos: 45, win: diceResults.filter(a => a === 2).length === 1, odds: 1},
    {pos: 45, win: diceResults.filter(a => a === 2).length === 2, odds: 2},
    {pos: 45, win: diceResults.filter(a => a === 2).length === 3, odds: 3},
    {pos: 46, win: diceResults.filter(a => a === 3).length === 1, odds: 1},
    {pos: 46, win: diceResults.filter(a => a === 3).length === 2, odds: 2},
    {pos: 46, win: diceResults.filter(a => a === 3).length === 3, odds: 3},
    {pos: 47, win: diceResults.filter(a => a === 4).length === 1, odds: 1},
    {pos: 47, win: diceResults.filter(a => a === 4).length === 2, odds: 2},
    {pos: 47, win: diceResults.filter(a => a === 4).length === 3, odds: 3},
    {pos: 48, win: diceResults.filter(a => a === 5).length === 1, odds: 1},
    {pos: 48, win: diceResults.filter(a => a === 5).length === 2, odds: 2},
    {pos: 48, win: diceResults.filter(a => a === 5).length === 3, odds: 3},
    {pos: 49, win: diceResults.filter(a => a === 6).length === 1, odds: 1},
    {pos: 49, win: diceResults.filter(a => a === 6).length === 2, odds: 2},
    {pos: 49, win: diceResults.filter(a => a === 6).length === 3, odds: 3},
])

// Based on whether win condition is met for each square, determine if a bet has been placed on that particular square and calculate payout for each player
const calcPayout = (player) => {
    squaresWon = []
    for(const square of winCheck()) {
        if(square.win) {
            squaresWon.push([square.pos, square.odds])
        }
    }
    for(const i of squaresWon) {
        let betAmount = player.bets[i[0]]
        if(betAmount > 0) {
            player.payout.push(betAmount*i[1]+betAmount)
            chipsRemove.push(i[0])
        }
    }
}

const enableNextClearChips = (player) => () => {
    let buttonsArray = [$(`#p${player}-next`),$(`#p${player}-clear`)]
    let chipsArray = [$(`#p${player}-chips-5`), $(`#p${player}-chips-10`), $(`#p${player}-chips-50`), $(`#p${player}-chips-100`)]
    for(const buttons of buttonsArray) {
        buttons.removeClass('disabled-grey')
    }
    for(const chips of chipsArray) {
        chips.removeClass('disabled')
    }
    $(`#p${player}-arrow`).show()
}

const disableNextClearChips = (player) => {
    let buttonsArray = [$(`#p${player}-next`),$(`#p${player}-clear`)]
    let chipsArray = [$(`#p${player}-chips-5`), $(`#p${player}-chips-10`), $(`#p${player}-chips-50`), $(`#p${player}-chips-100`)]
    for(const buttons of buttonsArray) {
        buttons.addClass('disabled-grey')
    }
    for(const chips of chipsArray) {
        chips.addClass('disabled')
    }
    $(`#p${player}-arrow`).hide()
}

// Highlights squares that have met the win conditions
const highlightWinSquares = () => {
    for(let i of squaresWon) {
        $(`#${i}`).addClass('blink-win')
    }

    setTimeout(() => {
        for(let i of squaresWon) {
            $(`#${i}`).removeClass('blink-win')
        }
    }, HIGHLIGHT_SQUARES_LENGTH)
}

const nextPlayer = (player) => () => {
    player.bank += bet
    bet = 0
    render()
    disableNextClearChips(turnCounter)
    if(turnCounter < numOfPlayers) {
        turnCounter += 1
        enableNextClearChips(turnCounter)()
    } else {
        turnCounter = 1
        setTimeout(enableNextClearChips(turnCounter), TOTAL_ANIMATION_LENGTH)
    }
}

const removeChips = () => {
    chipsRemove = chipsRemove.filter((a, b, c) => c.indexOf(a) == b)
    for(const squaresIndex of chipsRemove) {
        for(let i = 0; i < players.length; i++) {
            for(let j = 0; j < $(`#${squaresIndex}`).find(`#${playerChipColors[i][2]}`).length; j++) {
                chip = $(`#${squaresIndex}`).find(`#${playerChipColors[i][2]}`)
                console.log(chip)
                chipOffset = chip.offset()
                chip.hide()
            
                const bankOffset = $(`#p${i+1}-bank`).offset() 
            
                const temp = $('<div>').addClass('temp-chip').append($('<img>').attr('src', playerChipColors[i][1]))
                temp.appendTo('html')
                temp.css('top', chipOffset.top)
                temp.css('left', chipOffset.left)
                temp.animate({'top': bankOffset.top, 'left': bankOffset.left}, 1000, () => {
                    temp.remove()
                })
            }
        }
    }
}

const reset = (player) => {
    player.bets = Array(49).fill(0)
    player.payout = []

    setTimeout(removeChips,TOTAL_ANIMATION_LENGTH)
    setTimeout(() => {$('.square-chips').remove()},TOTAL_ANIMATION_LENGTH)
}

const clear = (player) => () => {
    player.bank += bet
    bet = 0

    render()
}

const changeDice = () => {
    for(const i in diceResults) {
        $('.dice-roll-dice').eq(i).attr('src', diceImg[diceResults[i]-1])
    }
    $('.dice-roll-text').text(`You rolled ${diceResults[0]}, ${diceResults[1]}, and ${diceResults[2]}`)
}

const resetDiceAnimation = () => {
    $('.dice-roll').css('opacity', '0')
    for(const i in diceResults) {
        $('.dice-roll-dice').eq(i).removeClass(diceAnimationClasses[i])
    }
    setTimeout(() => {$('.dice-roll-text').text('You rolled . . .')}, 500)
}

const diceAnimation = () => {
    $('.dice-roll').css('opacity', '1')
    for(const i in diceResults) {
        $('.dice-roll-dice').eq(i).addClass(diceAnimationClasses[i])
    }
    setTimeout(changeDice, 1300)
    setTimeout(resetDiceAnimation, DICE_ANIMATION_LENGTH)
}

const run = () => {
    rollDice()
    for(let i = 0; i < numOfPlayers; i++) {
        calcPayout(players[i])
        players[i].transferPayout()
        reset(players[i])
    }
    diceAnimation()
    setTimeout(highlightWinSquares, DICE_ANIMATION_LENGTH)
}

const render = () => {
    $('#p1-bank').text(players[0].bank)
    $('#p2-bank').text(players[1].bank)
    $('#p3-bank').text(players[2].bank)
    if(turnCounter===1) {
        $('#p1-bet').text(bet)
    } else if (turnCounter===2) {
        $('#p2-bet').text(bet)
    } else if (turnCounter===3) {
        $('#p3-bet').text(bet)
    }   
    $('.button').addClass('disabled')
}

const main = () => {
    $('#p1-chips-5').on('click', tempBet(players[0], 5))
    $('#p1-chips-10').on('click', tempBet(players[0], 10))
    $('#p1-chips-50').on('click', tempBet(players[0], 50))
    $('#p1-chips-100').on('click', tempBet(players[0], 100))
    $('#p2-chips-5').on('click', tempBet(players[1], 5))
    $('#p2-chips-10').on('click', tempBet(players[1], 10))
    $('#p2-chips-50').on('click', tempBet(players[1], 50))
    $('#p2-chips-100').on('click', tempBet(players[1], 100))
    $('#p3-chips-5').on('click', tempBet(players[2], 5))
    $('#p3-chips-10').on('click', tempBet(players[2], 10))
    $('#p3-chips-50').on('click', tempBet(players[2], 50))
    $('#p3-chips-100').on('click', tempBet(players[2], 100))
    $('#p1-clear').on('click', clear(players[0]))
    $('#p2-clear').on('click', clear(players[1]))
    $('#p3-clear').on('click', clear(players[2]))
    $('.button').prepend($('<div>').addClass('square-chips-container'))

    if(numOfPlayers === 1) {
        $('#p1-board').css('border-right', '0')
        $('#p2-board').hide()
        $('#p3-board').hide()
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(players[0]))
        $('#p1-next').on('click', run)
    } else if(numOfPlayers === 2) {
        $('#p2-board').css('border-right', '0')
        $('#p3-board').hide()  
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(players[0]))
        $('#p2-next').on('click', nextPlayer(players[1]))
        $('#p2-next').on('click', run)
    } else if(numOfPlayers === 3) {
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(players[0]))
        $('#p2-next').on('click', nextPlayer(players[1]))
        $('#p3-next').on('click', nextPlayer(players[2]))
        $('#p3-next').on('click', run)
    }

    // Disable betting squares at the start of the game
    $('.button').addClass('disabled')
    disableNextClearChips('2')
    disableNextClearChips('3')

    // initial render
    render()
}

$(main)
