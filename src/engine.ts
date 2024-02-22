import {Card} from './card.js'
import {Deck} from './deck.js'
import {Board} from './board.js'
import {Player} from './player.js'

export class Engine {
    public deck: Deck
    public board: Board
    public players: Player[]

    public numberOfPlayers: number
    public turn: number
    public playerTurn: number
    public gameEnded: boolean

    private hoverBrightness: string = "brightness(1.1)"

    public startGame(numPlayers: number) {
        this.numberOfPlayers = numPlayers;
        this.players = [];
        this.turn = 1;
        this.playerTurn = 1;
        this.gameEnded = false;
        
        this.deck = new Deck();
        this.board = new Board();

        this.resetActionButtonsAndForms();
        this.initPlayers();
        this.deck.resetDeck();
        this.dealCards();
        this.initCurrency();
        this.updateDisplay();
    }

    public initPlayers() {
        document.getElementById("player-display").style.display = "block";
        for (var i = 1; i <= this.numberOfPlayers; i++) {
            const player = new Player(i, this);
            this.players.push(player);
        }
    }

    public getCurrentPlayer() {
        return this.players[this.playerTurn-1]
    }

    public resetActionButtonsAndForms() {
        document.getElementById("pick-3-button").style.backgroundColor = null;
        document.getElementById("pick-2-button").style.backgroundColor = null;
        document.getElementById("reserve-button").style.backgroundColor = null;
        document.getElementById("pick-card-button").style.backgroundColor = null;

        document.getElementById("pick-3-options").style.display = null;
        document.getElementById("pick-2-options").style.display = null;
        document.getElementById("reserve-options").style.display = null;
        document.getElementById("pick-card-options").style.display = null;

        var pick3Form = document.getElementById("pick3-form");
        pick3Form.replaceWith(pick3Form.cloneNode(true));
        var pick2Form = document.getElementById("pick2-form");
        pick2Form.replaceWith(pick2Form.cloneNode(true));
        var reserveForm = document.getElementById("reserve-form");
        reserveForm.replaceWith(reserveForm.cloneNode(true));
        var pickCardForm = document.getElementById("pick-card-form");
        pickCardForm.replaceWith(pickCardForm.cloneNode(true));

        var cardContainerImgs = document.querySelectorAll('.card-container img') as NodeListOf<HTMLInputElement>;
        cardContainerImgs.forEach(cardImg => {
            cardImg.checked = false
            cardImg.style.filter = null
        });
    }

    private mouseEnterStyle(cardImg: HTMLInputElement, color: string) {
        if (cardImg.checked) {
            cardImg.style.filter = `${this.hoverBrightness} drop-shadow(0 0 0.75rem ${color})`;
        } else {
            cardImg.style.filter = `${this.hoverBrightness}`
        }
    }

    private mouseLeaveStyle(cardImg: HTMLInputElement, color: string) {
        if (cardImg.checked) {
            cardImg.style.filter = `drop-shadow(0 0 0.75rem ${color})`;
        } else {
            cardImg.style.filter = null
        }
    }

    private mouseClickStyle(cardImg: HTMLInputElement, color: string) {
        if (!cardImg.checked) {
            var cImgs = document.querySelectorAll('.card-container img') as NodeListOf<HTMLInputElement>;
            cImgs.forEach(cImg => {
                if (cImg.checked) {
                    cImg.checked = false
                    cImg.style.filter = null;
                }
            });
            cardImg.checked = true
            cardImg.style.filter = `${this.hoverBrightness} drop-shadow(0 0 0.75rem ${color})`;
        } else {
            cardImg.checked = false
            cardImg.style.filter = `${this.hoverBrightness}`;
        }
    }
 
    public dealCards() {
        const levels = ["1","2","3"]
        levels.forEach(cardLevel => {
            const positions = ["1","2","3","4"];
            positions.forEach(cardPosition => {
                const card = this.deck.takeCard(+cardLevel);
                this.board.placeCard(+cardLevel, +cardPosition, card);

                // Event listeners
                var cardImg = document.querySelector(`#level${cardLevel}-${cardPosition} img`) as HTMLInputElement;

                // Mouseover card
                var reserveDiv = document.getElementById("reserve-options");
                var pickCardDiv = document.getElementById("pick-card-options");
                cardImg.addEventListener("mouseenter", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseEnterStyle(cardImg, "crimson");
                    } else
                    if (pickCardDiv.style.display === "block") {
                        this.mouseEnterStyle(cardImg, "green");
                    } 
                });
                cardImg.addEventListener("mouseleave", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseLeaveStyle(cardImg, "crimson")
                    } else
                    if (pickCardDiv.style.display === "block") {
                        this.mouseLeaveStyle(cardImg, "green")
                    }
                });
        
                // Select card
                cardImg.addEventListener("click", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseClickStyle(cardImg, "crimson");
                    } else
                    if (pickCardDiv.style.display === "block") {
                        this.mouseClickStyle(cardImg, "green");
                    }
                });
            });
        });
    }

    public initCurrency() {
        const numPlayersToCurrencyMap: Map<number, number> = new Map();
        numPlayersToCurrencyMap.set(1, 4)
                                .set(2, 4)
                                .set(3, 5)
                                .set(4, 7)

        this.board.updateCurrency("blue", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("red", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("yellow", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("purple", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("orange", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("shield", 5);
    }

    public updateDisplay() {
        document.querySelector("#player-count").innerHTML = `Number of players: ${this.numberOfPlayers}`;
        document.querySelector("#turn-number").innerHTML = `Turn: ${this.turn}`;
        document.querySelector("#player-turn").innerHTML = `Player ${this.playerTurn}'s turn`;

        document.querySelector("#blue-gems").innerHTML = `Blue gems: ${this.board.currency.blue}`;
        document.querySelector("#red-gems").innerHTML = `Red gems: ${this.board.currency.red}`;
        document.querySelector("#yellow-gems").innerHTML = `Yellow gems: ${this.board.currency.yellow}`;
        document.querySelector("#purple-gems").innerHTML = `Purple gems: ${this.board.currency.purple}`;
        document.querySelector("#orange-gems").innerHTML = `Orange gems: ${this.board.currency.orange}`;
        document.querySelector("#shield-tokens").innerHTML = `Shield tokens: ${this.board.currency.shield}`;
    }

    private hasOneOfEachCard(player: Player) {
        var colors = ["blue","red","yellow","purple","orange"];
        var hasCards = true;
        colors.forEach(color => {
            if (player.cards[`${color}`].length === 0) {
                hasCards = false;
            }
        });
        return hasCards;
    }

    private checkWinConditions() {
        var winner = null;
        this.players.forEach(player => {
            if (this.hasOneOfEachCard(player) && player.score.points >= 16 && player.score.greenGems >= 1) {
                winner = player;
            }
        });

        return winner;
    }

    private declareWinner(player: Player) {
        document.querySelector("#game-winner").innerHTML = `Player ${player.playerId} has won the game!`;
        this.gameEnded = true;
    }

    public nextPlayerTurn() {
        if (this.playerTurn % this.numberOfPlayers === 0) {
            const winner = this.checkWinConditions();
            if (winner !== null) {
                this.declareWinner(winner);
                return
            }
            this.turn += 1;
        }

        this.playerTurn = (this.playerTurn % this.numberOfPlayers) + 1;
        this.updateDisplay();
    }
}