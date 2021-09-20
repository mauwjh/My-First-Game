const main = () => {
// Variable declaration
    let diceResults = []
    let bet = 0
    let numOfPlayers = 3
    let turnCounter = 1
    let squaresWon = []
    
// Declaring Player class
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

// Declaring Player objects
    const playerOne = new Player()
    const playerTwo = new Player()
    const playerThree = new Player()

// Disabling betting squares at the start of the game
    $('.button').addClass('disabled')

    const tempBet = (player, value) => () => {
        if(player.bank >= value) {
            bet += value
            player.bank -= value
        }
        render()
        $('.button').removeClass('disabled')
    }

    const playerBet = (event) => {
        if(turnCounter === 1) {
            playerOne.bets[parseInt($(event.currentTarget).attr('id'))] = bet
            bet = 0
            render()
            $('.button').addClass('disabled')
        } else if(turnCounter === 2) {
            playerTwo.bets[parseInt($(event.currentTarget).attr('id'))] = bet
            bet = 0
            render()
            $('.button').addClass('disabled')
        } else if(turnCounter === 3) {
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
        }, 5000)
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
            setInterval(enableNextClearChips(turnCounter), 5000)
        }
    }

    const reset = (player) => {
        player.bets = []
        player.payout = []
    }

    const clear = (player) => () => {
        player.bank += bet
        bet = 0
        $('.button').addClass('disabled')
        render()
    }

    const runSinglePlayer = () => {
        rollDice()
        calcPayout(playerOne)
        playerOne.transferPayout()
        highlightWinSquares()
        reset(playerOne)
    }

    const runTwoPlayer = () => {
        rollDice()
        calcPayout(playerOne)
        calcPayout(playerTwo)
        playerOne.transferPayout()
        playerTwo.transferPayout()
        highlightWinSquares()
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
        highlightWinSquares()
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
