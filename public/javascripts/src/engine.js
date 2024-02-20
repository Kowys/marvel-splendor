import { Deck } from './deck.js';
import { Board } from './board.js';
import { Player } from './player.js';
export class Engine {
    deck;
    board;
    players;
    numberOfPlayers;
    turn;
    playerTurn;
    startGame(numPlayers) {
        this.numberOfPlayers = numPlayers;
        this.players = [];
        this.turn = 1;
        this.playerTurn = 1;
        this.initPlayers();
        this.deck = new Deck();
        this.board = new Board();
        this.deck.resetDeck();
        this.dealCards();
        this.initCurrency();
        this.updateDisplay();
    }
    initPlayers() {
        for (var i = 1; i <= this.numberOfPlayers; i++) {
            const player = new Player(i);
            this.players.push(player);
        }
    }
    getCurrentPlayer() {
        return this.players[this.playerTurn - 1];
    }
    mouseEnterStyle(cardImg, color) {
        if (cardImg.checked) {
            cardImg.style.filter = `brightness(1.2) drop-shadow(0 0 0.75rem ${color})`;
        }
        else {
            cardImg.style.filter = "brightness(1.2)";
        }
    }
    mouseLeaveStyle(cardImg, color) {
        if (cardImg.checked) {
            cardImg.style.filter = `drop-shadow(0 0 0.75rem ${color})`;
        }
        else {
            cardImg.style.filter = null;
        }
    }
    mouseClickStyle(cardImg, color) {
        if (!cardImg.checked) {
            var cImgs = document.querySelectorAll('.card-container img');
            cImgs.forEach(cImg => {
                if (cImg.checked) {
                    cImg.checked = false;
                    cImg.style.filter = null;
                }
            });
            cardImg.checked = true;
            cardImg.style.cssText = `filter:brightness(1.2) drop-shadow(0 0 0.75rem ${color})`;
        }
        else {
            cardImg.checked = false;
            cardImg.style.cssText = "filter:brightness(1.2)";
        }
    }
    dealCards() {
        const levelMap = new Map();
        levelMap.set("1", () => this.deck.takeLevelOneCard())
            .set("2", () => this.deck.takeLevelTwoCard())
            .set("3", () => this.deck.takeLevelThreeCard());
        const levels = ["1", "2", "3"];
        levels.forEach(cardLevel => {
            const positions = ['1', '2', '3', '4'];
            positions.forEach(cardPosition => {
                const card = levelMap.get(cardLevel)();
                this.board.placeCard(+cardLevel, +cardPosition, card);
                const boardCard = this.board.getCard(+cardLevel, +cardPosition);
                const imgURL = `<img class="card" id=card-${cardLevel}-${cardPosition} src="./images/cards/${boardCard.cardInfo.imageLink}" alt="Card"/>`;
                document.querySelector(`#level${cardLevel}-${cardPosition}`).innerHTML = imgURL;
                // Event listeners
                var cardImg = document.querySelector(`#level${cardLevel}-${cardPosition} img`);
                // Mouseover card
                var reserveDiv = document.getElementById("reserve-options");
                var pickCardDiv = document.getElementById("pick-card-options");
                cardImg.addEventListener("mouseenter", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseEnterStyle(cardImg, "crimson");
                    }
                    else if (pickCardDiv.style.display === "block") {
                        this.mouseEnterStyle(cardImg, "green");
                    }
                });
                cardImg.addEventListener("mouseleave", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseLeaveStyle(cardImg, "crimson");
                    }
                    else if (pickCardDiv.style.display === "block") {
                        this.mouseLeaveStyle(cardImg, "green");
                    }
                });
                // Select card
                cardImg.addEventListener("click", () => {
                    if (reserveDiv.style.display === "block") {
                        this.mouseClickStyle(cardImg, "crimson");
                    }
                    else if (pickCardDiv.style.display === "block") {
                        this.mouseClickStyle(cardImg, "green");
                    }
                });
            });
        });
    }
    initCurrency() {
        const numPlayersToCurrencyMap = new Map();
        numPlayersToCurrencyMap.set(1, 4)
            .set(2, 4)
            .set(3, 5)
            .set(4, 7);
        this.board.updateCurrency("blue", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("red", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("yellow", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("purple", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("orange", numPlayersToCurrencyMap.get(this.numberOfPlayers));
        this.board.updateCurrency("shield", 5);
    }
    updateDisplay() {
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
    nextPlayerTurn() {
        this.playerTurn = (this.playerTurn % this.numberOfPlayers) + 1;
    }
}
