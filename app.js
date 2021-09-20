const main = () => {
// Variable declaration
    let diceResults = []
    let bet = 0
    let numOfPlayers = 3
    let turnCounter = 1
    let squaresWon = []
    const diceAnimationLength = 4000
    const highlightSquaresLength = 5000
    const totalAnimationLength = diceAnimationLength + highlightSquaresLength

    diceImg = 
    ['Images/dice-six-faces-one.png',
    'Images/dice-six-faces-two.png',
    'Images/dice-six-faces-three.png',
    'Images/dice-six-faces-four.png',
    'Images/dice-six-faces-five.png',
    'Images/dice-six-faces-six.png']
    
// Player class declaration
    class Player {
        constructor() {
            this.bets = [];
            this.bank = 2000;
            this.payout = [];
        }

        transferPayout() {
            if(this.payout.length > 0) {
                this.bank += this.payout.reduce((a,b) => a + b)
            }
            render()
        }
    }

// Player objects declaration
    const playerOne = new Player()
    const playerTwo = new Player()
    const playerThree = new Player()

// Disable betting squares at the start of the game
    $('.button').addClass('disabled')

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
        if(turnCounter === 1) {
            $(event.currentTarget).children().eq(0).append($('<div>').addClass('square-chips').append($('<img>').attr('src', 'Images/Black-Chip.png')).append($('<span>').text(bet)))
            playerOne.bets[parseInt($(event.currentTarget).attr('id'))] = bet
            bet = 0
            render()
            $('.button').addClass('disabled')
        } else if(turnCounter === 2) {
            $(event.currentTarget).children().eq(0).append($('<div>').addClass('square-chips').append($('<img>').attr('src', 'Images/Blue-Chip.png')).append($('<span>').text(bet)))            
            playerTwo.bets[parseInt($(event.currentTarget).attr('id'))] = bet
            bet = 0
            render()
            $('.button').addClass('disabled')
        } else if(turnCounter === 3) {
            $(event.currentTarget).children().eq(0).append($('<div>').addClass('square-chips').append($('<img>').attr('src', 'Images/Grey-Chip.png')).append($('<span>').text(bet)))            
            playerThree.bets[parseInt($(event.currentTarget).attr('id'))] = bet
            bet = 0
            render()
            $('.button').addClass('disabled')
        }
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
            if(square.win === true) {
                squaresWon.push([square.pos, square.odds])
            }
        }
        for(const i of squaresWon) {
            if(player.bets[i[0]] >= 0) {
                player.payout.push(player.bets[i[0]]*i[1]+player.bets[i[0]])
            }
        }
    }

    const enableNextClearChips = (player) => () => {
        $(`#p${player}-next`).removeClass('disabled')
        $(`#p${player}-clear`).removeClass('disabled')
        $(`#p${player}-chips-5`).removeClass('disabled')
        $(`#p${player}-chips-10`).removeClass('disabled')
        $(`#p${player}-chips-50`).removeClass('disabled')
        $(`#p${player}-chips-100`).removeClass('disabled')
    }

    const disableNextClearChips = (player) => {
        $(`#p${player}-next`).addClass('disabled')
        $(`#p${player}-clear`).addClass('disabled')
        $(`#p${player}-chips-5`).addClass('disabled')
        $(`#p${player}-chips-10`).addClass('disabled')
        $(`#p${player}-chips-50`).addClass('disabled')
        $(`#p${player}-chips-100`).addClass('disabled')
    }

    disableNextClearChips('2')
    disableNextClearChips('3')

// Highlights squares that have met the win conditions
    const highlightWinSquares = () => {
        for(let i of squaresWon) {
            $(`#${i}`).addClass('blink-win')
        }
    
        setTimeout(() => {
            for(let i of squaresWon) {
                $(`#${i}`).removeClass('blink-win')
            }
        }, highlightSquaresLength)
    }

    const nextPlayer = (player) => () => {
        player.bank += bet
        bet = 0
        render()
        $('.button').addClass('disabled')
        disableNextClearChips(turnCounter)
        if(turnCounter < numOfPlayers) {
            turnCounter += 1
            enableNextClearChips(turnCounter)()
        } else {
            turnCounter = 1
            setTimeout(enableNextClearChips(turnCounter), totalAnimationLength)
        }
    }

    const reset = (player) => {
        player.bets = []
        player.payout = []
        setTimeout(() => {$('.square-chips').remove()},totalAnimationLength)
    }

    const clear = (player) => () => {
        player.bank += bet
        bet = 0
        $('.button').addClass('disabled')
        render()
    }

    const changeDice = () => {
        $('.dice-roll-dice').eq(0).attr('src', diceImg[diceResults[0]-1])
        $('.dice-roll-dice').eq(1).attr('src', diceImg[diceResults[1]-1])
        $('.dice-roll-dice').eq(2).attr('src', diceImg[diceResults[2]-1])
    }

    const resetDiceAnimation = () => {
        $('.dice-roll').css('opacity', '0')
        $('.dice-roll-dice').eq(0).removeClass('shake')
        $('.dice-roll-dice').eq(1).removeClass('reverse-shake')
        $('.dice-roll-dice').eq(2).removeClass('shake')
    }

    const diceAnimation = () => {
        $('.dice-roll').css('opacity', '1')
        $('.dice-roll-dice').eq(0).addClass('shake')
        $('.dice-roll-dice').eq(1).addClass('reverse-shake')
        $('.dice-roll-dice').eq(2).addClass('shake')
        setTimeout(changeDice, 1300)
        setTimeout(resetDiceAnimation, diceAnimationLength)
    }

    const runSinglePlayer = () => {
        rollDice()
        calcPayout(playerOne)
        playerOne.transferPayout()
        diceAnimation()
        setTimeout(highlightWinSquares, diceAnimationLength)
        reset(playerOne)
    }

    const runTwoPlayer = () => {
        rollDice()
        calcPayout(playerOne)
        calcPayout(playerTwo)
        playerOne.transferPayout()
        playerTwo.transferPayout()
        diceAnimation()
        setTimeout(highlightWinSquares, diceAnimationLength)
        reset(playerOne)
        reset(playerTwo)
    }

    const runThreePlayer = () => {
        rollDice()
        calcPayout(playerOne)
        calcPayout(playerTwo)
        calcPayout(playerThree)
        playerOne.transferPayout()
        playerTwo.transferPayout()
        playerThree.transferPayout()
        diceAnimation()
        setTimeout(highlightWinSquares, diceAnimationLength)
        reset(playerOne)
        reset(playerTwo)
        reset(playerThree)
    }

    $('#p1-chips-5').on('click', tempBet(playerOne, 5))
    $('#p1-chips-10').on('click', tempBet(playerOne, 10))
    $('#p1-chips-50').on('click', tempBet(playerOne, 50))
    $('#p1-chips-100').on('click', tempBet(playerOne, 100))
    $('#p2-chips-5').on('click', tempBet(playerTwo, 5))
    $('#p2-chips-10').on('click', tempBet(playerTwo, 10))
    $('#p2-chips-50').on('click', tempBet(playerTwo, 50))
    $('#p2-chips-100').on('click', tempBet(playerTwo, 100))
    $('#p3-chips-5').on('click', tempBet(playerThree, 5))
    $('#p3-chips-10').on('click', tempBet(playerThree, 10))
    $('#p3-chips-50').on('click', tempBet(playerThree, 50))
    $('#p3-chips-100').on('click', tempBet(playerThree, 100))
    $('#p1-clear').on('click', clear(playerOne))
    $('#p2-clear').on('click', clear(playerTwo))
    $('#p3-clear').on('click', clear(playerThree))
    $('.button').prepend($('<div>').addClass('square-chips-container'))


    if(numOfPlayers === 1) {
        $('#p1-board').css('border-right', '0')
        $('#p2-board').hide()
        $('#p3-board').hide()
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(playerOne))
        $('#p1-next').on('click', runSinglePlayer)
    } else if(numOfPlayers === 2) {
        $('#p2-board').css('border-right', '0')
        $('#p3-board').hide()  
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(playerOne))
        $('#p2-next').on('click', nextPlayer(playerTwo))
        $('#p2-next').on('click', runTwoPlayer)
    } else if(numOfPlayers === 3) {
        $('.button').on('click', playerBet)
        $('#p1-next').on('click', nextPlayer(playerOne))
        $('#p2-next').on('click', nextPlayer(playerTwo))
        $('#p3-next').on('click', nextPlayer(playerThree))
        $('#p3-next').on('click', runThreePlayer)
    }

    const render = () => {
        $('#p1-bank').text(playerOne.bank)
        $('#p2-bank').text(playerTwo.bank)
        $('#p3-bank').text(playerThree.bank)
        if(turnCounter===1) {
            $('#p1-bet').text(bet)
        } else if (turnCounter===2) {
            $('#p2-bet').text(bet)
        } else if (turnCounter===3) {
            $('#p3-bet').text(bet)
        }   
    }

    render()
}

$(main)
