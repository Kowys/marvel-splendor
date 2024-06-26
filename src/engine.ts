import {Card} from './card.js'
import {Deck} from './deck.js'
import {Board} from './board.js'
import {Player} from './player.js'

export class Engine {
    public deck: Deck
    public board: Board
    public players: Player[]

    public tableName: string
    public thisPlayerId: number
    public numberOfPlayers: number
    public round: number
    public playerTurn: number
    public gameState: string
    public avengersTilePlayer: number

    private hoverBrightness: string = "brightness(1.1)"

    public async setupGame(currentUrl: string, firstInit: boolean) {
        const data = await this.getGameStateFromDB(currentUrl);
        console.log(`Player count: ${data.num_players}`);
        console.log(`Player id: ${data.player_id}`);

        this.tableName = data.table_name;

        this.thisPlayerId = data.player_id;
        this.numberOfPlayers = data.num_players;
        this.players = [];
        this.round = data.round;
        this.playerTurn = data.player_turn;
        this.gameState = data.game_state;
        this.avengersTilePlayer = data.avengers_tile_player;
        
        this.deck = new Deck();
        this.deck.resetDeck();
        this.board = new Board();

        this.resetActionButtonsAndForms();
        this.initPlayers(data, firstInit);
        this.initCards(data, firstInit);
        this.initCurrency(data);
        this.updateDisplay();
    }

    public async getGameStateFromDB(currentUrl: string) {
        var urlId = currentUrl.split('/').pop();
        var params = new URLSearchParams({
            url_id: urlId,
        });
        const response = await fetch('/get-game-state?' + params, {
            method: 'get'
        });
        const data = await response.json();
        return data;
    }

    public initPlayers(data: object, firstInit: boolean) {
        document.getElementById("player-display").style.display = "block";
        for (var i = 1; i <= this.numberOfPlayers; i++) {
            const player = new Player(i, this);
            player.initState(data, firstInit);
            this.players.push(player);
        }
    }

    public getPlayer() {
        return this.players[this.thisPlayerId - 1];
    }

    public resetActionButtonsAndForms() {
        document.getElementById("pick-3-button").style.backgroundColor = null;
        document.getElementById("pick-2-button").style.backgroundColor = null;
        document.getElementById("reserve-button").style.backgroundColor = null;
        document.getElementById("pick-card-button").style.backgroundColor = null;
        document.getElementById("discard-gems-button").style.backgroundColor = null;

        document.getElementById("pick-3-options").style.display = null;
        document.getElementById("pick-2-options").style.display = null;
        document.getElementById("reserve-options").style.display = null;
        document.getElementById("pick-card-options").style.display = null;
        document.getElementById("discard-gems-options").style.display = null;

        var cardContainerImgs = document.querySelectorAll('.card-container img') as NodeListOf<HTMLInputElement>;
        cardContainerImgs.forEach(cardImg => {
            cardImg.checked = false;
            cardImg.style.filter = null;
        });
    }

    public mouseEnterStyle(cardImg: HTMLInputElement, color: string) {
        if (cardImg.checked) {
            cardImg.style.filter = `${this.hoverBrightness} drop-shadow(0 0 0.75rem ${color})`;
        } else {
            cardImg.style.filter = `${this.hoverBrightness}`
        }
    }

    public mouseLeaveStyle(cardImg: HTMLInputElement, color: string) {
        if (cardImg.checked) {
            cardImg.style.filter = `drop-shadow(0 0 0.75rem ${color})`;
        } else {
            cardImg.style.filter = null
        }
    }

    public mouseClickStyle(cardImg: HTMLInputElement, color: string) {
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

    private addListenersToCard(cardImg: HTMLInputElement) {
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
    }
 
    public initCards(data: any, firstInit: boolean) {
        const levels = ["1","2","3"];
        levels.forEach(cardLevel => {
            const positions = ["1","2","3","4"];
            positions.forEach(cardPosition => {
                var cardName = data[`card_level_${cardLevel}_${cardPosition}`];
                const card = this.deck.takeNamedCard(cardName);
                this.board.placeCard(cardLevel, +cardPosition, card);

                // Event listeners
                var cardImg = document.querySelector(`#level${cardLevel}-${cardPosition} img`) as HTMLInputElement;
                if (firstInit) {
                    this.addListenersToCard(cardImg);
                }
            });
        });

        // Locations
        const positions = ["1","2","3","4"];
        positions.forEach(cardPosition => {
            var cardName = data[`location_${cardPosition}`];
            const card = this.deck.takeNamedCard(cardName);
            this.board.placeCard("loc", +cardPosition, card);
        });
    }

    public initCurrency(data: any) {
        this.board.updateCurrency("blue", data.board_currency_blue);
        this.board.updateCurrency("red", data.board_currency_red);
        this.board.updateCurrency("yellow", data.board_currency_yellow);
        this.board.updateCurrency("purple", data.board_currency_purple);
        this.board.updateCurrency("orange", data.board_currency_orange);
        this.board.updateCurrency("shield", data.board_currency_shield);
    }

    public updateDisplay() {
        if (this.gameState === "ended") {
            const winner = this.checkWinConditions();
            this.declareWinner(winner);
        }

        document.querySelector("#player-count").innerHTML = `Number of players: ${this.numberOfPlayers}`;
        document.querySelector("#round-number").innerHTML = `Round: ${this.round}`;
        document.querySelector("#player-turn").innerHTML = `Player ${this.playerTurn}'s turn`;

        var avengers_text = "Not claimed";
        if (this.avengersTilePlayer !== 0) {
            avengers_text = `Player ${this.avengersTilePlayer}`;
        };
        document.querySelector("#avengers-tile-holder").innerHTML = `Avengers tile: ${avengers_text}`;

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

    private tieBreaker(winner: Player, player: Player) {
        if (player.score.points > winner.score.points) {
            return player;
        } else 
        if (player.score.points < winner.score.points) {
            return winner;
        } else
        if (player.playerId === this.avengersTilePlayer) {
            return player;
        } else
        if (winner.playerId === this.avengersTilePlayer) {
            return winner;
        } else {
            const colors = ["blue","red","yellow","purple","orange"];
            var playerCardCount = 0;
            var winnerCardCount = 0;
            colors.forEach(color => {
                playerCardCount += player.cards[`${color}`].length;
                winnerCardCount += winner.cards[`${color}`].length;
            });
            if (playerCardCount < winnerCardCount) {
                return player;
            } else {
                return winner;
            }
        }
    }

    private checkWinConditions() {
        var winner = null;
        this.players.forEach(player => {
            if (this.hasOneOfEachCard(player) && player.score.points >= 16 && player.score.greenGems >= 1) {
                if (winner === null) {
                    winner = player;
                } else {
                    winner = this.tieBreaker(winner, player);
                }
            }
        });

        return winner;
    }

    private declareWinner(player: Player) {
        document.querySelector("#game-winner").innerHTML = `Player ${player.playerId} has won the game!`;
    }

    public nextPlayerTurn() {
        if (this.playerTurn % this.numberOfPlayers === 0) {
            const winner = this.checkWinConditions();
            if (winner !== null) {
                this.gameState = "ended";
            }
            this.round += 1;
        }

        this.playerTurn = (this.playerTurn % this.numberOfPlayers) + 1;
    }
}