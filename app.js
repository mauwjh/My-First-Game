// Variable declaration
let diceResults = []
let bet = 0
let numOfPlayers = 0
let turnCounter = 1
let squaresWon = []
let chipsRemove = []
let gameMode = ''
let totalTurnCounter = 0
const TOTAL_TURNS = 10
const DICE_ANIMATION_LENGTH = 4000
const HIGHLIGHT_SQUARES_LENGTH = 5000
const PLACE_CHIP_LENGTH = 500
const REMOVE_CHIP_LENGTH = 1000
const TOTAL_ANIMATION_LENGTH = DICE_ANIMATION_LENGTH + HIGHLIGHT_SQUARES_LENGTH + REMOVE_CHIP_LENGTH

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
    constructor(name, number) {
        this.name = name
        this.bets = Array(50).fill(0);
        this.bank = 2000;
        this.payout = [];
        this.number = number
    }

    transferPayout() {
        if(this.payout.length > 0) {
            let payout = this.payout.reduce((a,b) => a + b)
            this.bank += payout
            setTimeout(() => {
                $(`#p${this.number}-winnings`).text(`+$${payout}`)
                $(`#p${this.number}-winnings`).addClass('slide-animation')
            }, TOTAL_ANIMATION_LENGTH)
            setTimeout(() => {
                $(`#p${this.number}-winnings`).removeClass('slide-animation')
            }, TOTAL_ANIMATION_LENGTH+1500)
           
        }
        setTimeout(render, TOTAL_ANIMATION_LENGTH)
    }
}

// Player objects declaration
const players = [new Player('Player 1', 1), new Player('Player 2', 2), new Player('Player 3', 3)]

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
    const chipText = $('<span>').text(bet)
    const chipImg = $('<img>').attr('src', playerChipColors[turnCounter-1][1])
    const chip = $('<div>').addClass('square-chips').attr('id', playerChipColors[turnCounter-1][2]).append(chipImg).append(chipText)
    $(event.currentTarget).children().eq(0).append(chip)
    chipOffset = chip.offset()
    chip.hide()

    const bankOffset = $(`#p${turnCounter}-bank`).offset() 

    const temp = $('<div>').addClass('temp-chip').append($('<img>').attr('src', playerChipColors[turnCounter-1][1]))
    temp.appendTo('html')
    temp.css('top', bankOffset.top)
    temp.css('left', bankOffset.left)
    temp.animate({'top': chipOffset.top, 'left': chipOffset.left}, PLACE_CHIP_LENGTH, () => {
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

const disableNextClearChips = (player) => () =>{
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

const removeChips = () => {
    chipsRemove = chipsRemove.filter((a, b, c) => c.indexOf(a) == b)
    console.log(chipsRemove)
    for(const squaresIndex of chipsRemove) {
        for(let i = 0; i < players.length; i++) {
            for(let j = 0; j < $(`#${squaresIndex}`).find(`#${playerChipColors[i][2]}`).length; j++) {
                chip = $(`#${squaresIndex}`).find(`#${playerChipColors[i][2]}`).eq(j)
                console.log(chip)
                chipOffset = chip.offset()
                chip.hide()
            
                const bankOffset = $(`#p${i+1}-bank`).offset() 
            
                const temp = $('<div>').addClass('temp-chip').append($('<img>').attr('src', playerChipColors[i][1]))
                temp.appendTo('html')
                temp.css('top', chipOffset.top)
                temp.css('left', chipOffset.left)
                temp.animate({'top': bankOffset.top, 'left': bankOffset.left}, REMOVE_CHIP_LENGTH, () => {
                    temp.remove()
                })
            }
        }
    }
    chipsRemove = []
    $('.square-chips').remove()
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

    setTimeout(removeChips,HIGHLIGHT_SQUARES_LENGTH)
}

const nextPlayer = (player) => () => {
    player.bank += bet
    bet = 0
    render()
    disableNextClearChips(turnCounter)()
    if(turnCounter < numOfPlayers) {
        turnCounter += 1
        enableNextClearChips(turnCounter)()
    } else {
        run()
        turnCounter = 1
        setTimeout(enableNextClearChips(turnCounter), TOTAL_ANIMATION_LENGTH)
    }
}

const reset = (player) => {
    player.bets = Array(50).fill(0)
    player.payout = []
}

const clear = (player) => () => {
    player.bank += bet
    bet = 0

    render()
}

const turnsRemaining = () => {
    $('.turns-remaining').css('display', 'flex')
    $('.turns-remaining').text(`${10 - totalTurnCounter} turns remaining`)
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
    if(gameMode === 'choice2') {
        turnsRemaining()
    }
    for(const i in diceResults) {
        $('.dice-roll-dice').eq(i).addClass(diceAnimationClasses[i])
    }
    setTimeout(changeDice, 1300)
    setTimeout(resetDiceAnimation, DICE_ANIMATION_LENGTH)
}

const gameOver = () => {
    let winner = ''
    let winnerBank = 0
    $('.dice-roll').css('opacity', '1')
    $('.dice-container').hide()
    $('.turns-remaining').hide()
    for(let i = 0; i < players.length; i++) {
        if(players[i].bank > winnerBank) {
            winnerBank = players[i].bank
            winner = players[i].name
        }
    }
    for(let i = 0; i < numOfPlayers; i++) {
        if(players[i].name !== winner && players[i].bank === winnerBank) {
            $('.dice-roll-text').text('It\'s a tie!')
        } else {
            $('.dice-roll-text').text(`${winner} won with $${winnerBank} in the bank!`)
        }
    }
    for(let j = 0; j < numOfPlayers; j++) {
        $('.dice-roll').append($('<div>').addClass('turns-remaining').css('display', 'flex').text(`${players[j].name}: $${players[j].bank}`))
    }
}

const run = () => {
    rollDice()  
    for(let i = 0; i < numOfPlayers; i++) {
        calcPayout(players[i])
        players[i].transferPayout()
        reset(players[i])
    }
    totalTurnCounter++
    diceAnimation()
    setTimeout(highlightWinSquares, DICE_ANIMATION_LENGTH)
    if(totalTurnCounter === TOTAL_TURNS && gameMode === 'choice2') {
        setTimeout(disableNextClearChips('1'), TOTAL_ANIMATION_LENGTH+1)
        setTimeout(gameOver,TOTAL_ANIMATION_LENGTH+REMOVE_CHIP_LENGTH)
    }
}

const buttonInit = () => {
    for(let i = 0; i < players.length; i++) {
        let playerNumber = i + 1
        $(`#p${playerNumber}-chips-5`).on('click', tempBet(players[i], 5))
        $(`#p${playerNumber}-chips-10`).on('click', tempBet(players[i], 10))
        $(`#p${playerNumber}-chips-50`).on('click', tempBet(players[i], 50))
        $(`#p${playerNumber}-chips-100`).on('click', tempBet(players[i], 100))
        $(`#p${playerNumber}-clear`).on('click', clear(players[i]))
        $(`#p${playerNumber}-next`).on('click', nextPlayer(players[i]))
    }

    $('.button').prepend($('<div>').addClass('square-chips-container'))
    $('.button').on('click', playerBet)

    // disable betting squares at the start of the game
    $('.button').addClass('disabled')
    disableNextClearChips('2')()
    disableNextClearChips('3')()
}

const boardInit = () => {
    if(numOfPlayers == 1) {
    $('#p1-board').css('border-right', '0')
    $('#p2-board').hide()
    $('#p3-board').hide()
    } else if(numOfPlayers == 2) {
        $('#p2-board').css('border-right', '0')
        $('#p3-board').hide()  
    }
}

const allowSubmit = () => {
    if($('#game-mode').find(':selected').val() !== 'none' && $('#numOfPlayers').find(':selected').val() !== 'none') {
        $('.submit').css({'opacity': '1', 'pointer-events': 'auto'})
    } else {
        $('.submit').css({'opacity': '0', 'pointer-events': 'none'})
    }
}

const landingPageInit = () => {
    $('.submit').css('opacity', '0')
    $('#numOfPlayers').on('change', () => {
        numOfPlayers = $('#numOfPlayers').find(':selected').val()
        allowSubmit()
    })

    $('.game-desc').hide()
    $('#game-mode').on('change', () => {
        $('.game-desc').hide()
        var x = $('#game-mode').find(':selected').val()
        $('#' + x).show()
        if(x === 'choice2') {
            $('#numOfPlayers').children().eq(1).hide()
        } else {
            $('#numOfPlayers').children().show()
        }
        if(x === 'choice2' && $('#numOfPlayers').find(':selected').val() == 1) {
            $('#numOfPlayers').val('none')
        }
        gameMode = x
        allowSubmit()
    })

    $('.submit').on('click', () => {
        boardInit()
        buttonInit()
        $('#landing-page').css('opacity', '0')
        setTimeout(() => {$('#landing-page').hide()}, 500)
    })
}

const render = () => {
    for(let i = 0; i < players.length; i++) {
        $(`#p${i+1}-bank`).text(players[i].bank)
    }
    $(`#p${turnCounter}-bet`).text(bet)
    $('.button').addClass('disabled')
}

const main = () => {
    // initial render
    render()

    // landing page initialisation
    landingPageInit()
}

$(main)
