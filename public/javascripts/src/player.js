export class Player {
    playerId;
    engine;
    score = { points: 0, avengerPoints: 0, greenGems: 0 };
    currency = { blue: 0, red: 0, yellow: 0, purple: 0, orange: 0, shield: 0 };
    cards = { blue: [], red: [], yellow: [], purple: [], orange: [], location: [] };
    reserved = [];
    gemTypes = new Set(["blue", "red", "yellow", "purple", "orange"]);
    constructor(id, engine) {
        this.playerId = id;
        this.engine = engine;
    }
    initState(data, firstinit) {
        // Player currency
        this.currency.blue = data[`player_${this.playerId}_currency_blue`];
        this.currency.red = data[`player_${this.playerId}_currency_red`];
        this.currency.yellow = data[`player_${this.playerId}_currency_yellow`];
        this.currency.purple = data[`player_${this.playerId}_currency_purple`];
        this.currency.orange = data[`player_${this.playerId}_currency_orange`];
        this.currency.shield = data[`player_${this.playerId}_currency_shield`];
        // Player bought cards
        var cardNames = data[`player_${this.playerId}_cards`].split(',');
        if (cardNames[0] !== '') {
            cardNames.forEach(name => {
                var card = this.engine.deck.takeNamedCard(name);
                var cardColor = null;
                if (card.incomes.blueIncome === 1) {
                    cardColor = 'blue';
                }
                else if (card.incomes.redIncome === 1) {
                    cardColor = 'red';
                }
                else if (card.incomes.yellowIncome === 1) {
                    cardColor = 'yellow';
                }
                else if (card.incomes.purpleIncome === 1) {
                    cardColor = 'purple';
                }
                else if (card.incomes.orangeIncome === 1) {
                    cardColor = 'orange';
                }
                else if (card.cardInfo.isLocation === true) {
                    cardColor = 'location';
                }
                this.score.points += card.points.points;
                this.score.avengerPoints += card.points.avengerPoints;
                if (card.cardInfo.level === 3) {
                    this.score.greenGems += 1;
                }
                this.cards[`${cardColor}`].push(card);
            });
        }
        ;
        // Player reserved cards
        var reservedCardNames = data[`player_${this.playerId}_cards_reserved`].split(',');
        if (reservedCardNames[0] !== '') {
            reservedCardNames.forEach(name => {
                var card = this.engine.deck.takeNamedCard(name);
                this.reserved.push(card);
            });
        }
        ;
        // Avenger points update
        if (data[`avengers_tile_player`] === this.playerId) {
            this.score.points += 3;
        }
        ;
        if (this.playerId === data.player_id) {
            if (firstinit) {
                this.addListenersToReserved();
            }
            this.updateDisplay();
        }
        else {
            this.updateOtherPlayerDisplay(data.player_id);
        }
    }
    addListenersToReserved() {
        for (var i = 1; i <= 3; i++) {
            const cardImg = document.querySelector(`#reserved-${i} img`);
            // Mouseover card
            var pickCardDiv = document.getElementById("pick-card-options");
            cardImg.addEventListener("mouseenter", () => {
                if (pickCardDiv.style.display === "block") {
                    this.engine.mouseEnterStyle(cardImg, "green");
                }
            });
            cardImg.addEventListener("mouseleave", () => {
                if (pickCardDiv.style.display === "block") {
                    this.engine.mouseLeaveStyle(cardImg, "green");
                }
            });
            // Select card
            cardImg.addEventListener("click", () => {
                if (pickCardDiv.style.display === "block") {
                    this.engine.mouseClickStyle(cardImg, "green");
                }
            });
        }
    }
    takeGems(color, amount) {
        this.currency[`${color}`] += amount;
        this.engine.board.takeCurrency(color, amount);
    }
    discardGems(color, amount) {
        this.currency[`${color}`] -= amount;
        this.engine.board.addCurrency(color, amount);
    }
    buyable(card) {
        var shieldAmt = this.currency.shield;
        var colors = ["blue", "red", "yellow", "purple", "orange"];
        colors.forEach(color => {
            const cost = card.costs[`${color}Cost`];
            const cash = this.currency[`${color}`] + this.cards[`${color}`].length;
            var diff = cash - cost;
            if (diff < 0) {
                if (shieldAmt - Math.abs(diff) >= 0) {
                    shieldAmt -= Math.abs(diff);
                }
                else {
                    throw new Error(`Not enough ${color} gems to purchase card.`);
                }
            }
        });
        return true;
    }
    updateAvengersTile() {
        var maxAvengerPoints = 0;
        this.engine.players.forEach(player => {
            if (player.playerId !== this.playerId) {
                maxAvengerPoints = Math.max(maxAvengerPoints, player.score.avengerPoints);
            }
        });
        // If avengers tile changes hands to current player
        if (this.engine.avengersTilePlayer !== this.playerId && this.score.avengerPoints >= 3 && this.score.avengerPoints > maxAvengerPoints) {
            if (this.engine.avengersTilePlayer !== 0) {
                var prevHolder = this.engine.players[this.engine.avengersTilePlayer - 1];
                prevHolder.score.points -= 3;
            }
            this.score.points += 3;
            this.engine.avengersTilePlayer = this.playerId;
        }
    }
    buyCard(card) {
        try {
            this.buyable(card);
        }
        catch (error) {
            throw error;
        }
        var colors = ["blue", "red", "yellow", "purple", "orange"];
        colors.forEach(color => {
            // Pay gem cost for each color
            const toPay = Math.max(0, card.costs[`${color}Cost`] - this.cards[`${color}`].length);
            if (this.currency[`${color}`] < toPay) {
                const shieldCost = (toPay - this.currency[`${color}`]);
                this.engine.board.addCurrency("shield", shieldCost);
                this.currency.shield -= shieldCost;
                this.engine.board.addCurrency(color, this.currency[`${color}`]);
                this.currency[`${color}`] = 0;
            }
            else {
                this.engine.board.addCurrency(color, toPay);
                this.currency[`${color}`] -= toPay;
            }
            // Add card to player (Increase income for each color the card has)
            if (card.incomes[`${color}Income`] === 1) {
                this.cards[color].push(card);
                this.score.points += card.points.points;
                this.score.avengerPoints += card.points.avengerPoints;
                this.updateAvengersTile();
                if (card.cardInfo.level === 3) {
                    this.score.greenGems += 1;
                }
            }
        });
    }
    takeLocationCard() {
        var locationCards = this.engine.board.locationCards;
        for (const [pos, card] of Object.entries(locationCards)) {
            var takenCard = false;
            if (card !== null) {
                var isEligibleLocation = true;
                var colors = ["blue", "red", "yellow", "purple", "orange"];
                colors.forEach(color => {
                    if (this.cards[`${color}`].length < card.costs[`${color}Cost`]) {
                        isEligibleLocation = false;
                    }
                    ;
                });
                if (isEligibleLocation === true) {
                    this.cards.location.push(card);
                    this.score.points += card.points.points;
                    this.engine.board.placeCard("loc", +pos.slice(3, 4), null);
                    takenCard = true;
                }
                ;
            }
            ;
            if (takenCard === true) {
                break;
            }
        }
        ;
    }
    actionUpdateDB(actionType, actionString) {
        var data = {
            "table_name": this.engine.tableName,
            "previous_move_type": actionType,
            "previous_move_info": actionString,
            "game_state": this.engine.gameState,
            "num_players": this.engine.numberOfPlayers,
            "round": this.engine.round,
            "turn": this.engine.playerTurn,
            "player_turn": this.engine.playerTurn,
            "board_currency_blue": this.engine.board.currency.blue,
            "board_currency_red": this.engine.board.currency.red,
            "board_currency_yellow": this.engine.board.currency.yellow,
            "board_currency_purple": this.engine.board.currency.purple,
            "board_currency_orange": this.engine.board.currency.orange,
            "board_currency_shield": this.engine.board.currency.shield,
            "card_level_1_1": this.engine.board.levelOneCards.pos1 !== null ? this.engine.board.levelOneCards.pos1.cardInfo.name : null,
            "card_level_1_2": this.engine.board.levelOneCards.pos2 !== null ? this.engine.board.levelOneCards.pos2.cardInfo.name : null,
            "card_level_1_3": this.engine.board.levelOneCards.pos3 !== null ? this.engine.board.levelOneCards.pos3.cardInfo.name : null,
            "card_level_1_4": this.engine.board.levelOneCards.pos4 !== null ? this.engine.board.levelOneCards.pos4.cardInfo.name : null,
            "card_level_2_1": this.engine.board.levelTwoCards.pos1 !== null ? this.engine.board.levelTwoCards.pos1.cardInfo.name : null,
            "card_level_2_2": this.engine.board.levelTwoCards.pos2 !== null ? this.engine.board.levelTwoCards.pos2.cardInfo.name : null,
            "card_level_2_3": this.engine.board.levelTwoCards.pos3 !== null ? this.engine.board.levelTwoCards.pos3.cardInfo.name : null,
            "card_level_2_4": this.engine.board.levelTwoCards.pos4 !== null ? this.engine.board.levelTwoCards.pos4.cardInfo.name : null,
            "card_level_3_1": this.engine.board.levelThreeCards.pos1 !== null ? this.engine.board.levelThreeCards.pos1.cardInfo.name : null,
            "card_level_3_2": this.engine.board.levelThreeCards.pos2 !== null ? this.engine.board.levelThreeCards.pos2.cardInfo.name : null,
            "card_level_3_3": this.engine.board.levelThreeCards.pos3 !== null ? this.engine.board.levelThreeCards.pos3.cardInfo.name : null,
            "card_level_3_4": this.engine.board.levelThreeCards.pos4 !== null ? this.engine.board.levelThreeCards.pos4.cardInfo.name : null,
            "location_1": this.engine.board.locationCards.pos1 !== null ? this.engine.board.locationCards.pos1.cardInfo.name : "",
            "location_2": this.engine.board.locationCards.pos2 !== null ? this.engine.board.locationCards.pos2.cardInfo.name : "",
            "location_3": this.engine.board.locationCards.pos3 !== null ? this.engine.board.locationCards.pos3.cardInfo.name : "",
            "location_4": this.engine.board.locationCards.pos4 !== null ? this.engine.board.locationCards.pos4.cardInfo.name : "",
            "avengers_tile_player": this.engine.avengersTilePlayer
        };
        for (var i = 1; i <= this.engine.numberOfPlayers; i++) {
            var player = this.engine.players[i - 1];
            data[`player_${i}_currency_blue`] = player.currency.blue;
            data[`player_${i}_currency_red`] = player.currency.red;
            data[`player_${i}_currency_yellow`] = player.currency.yellow;
            data[`player_${i}_currency_purple`] = player.currency.purple;
            data[`player_${i}_currency_orange`] = player.currency.orange;
            data[`player_${i}_currency_shield`] = player.currency.shield;
            var reservedCardString = player.reserved.map(card => card.cardInfo.name).toString();
            data[`player_${i}_cards_reserved`] = reservedCardString;
            var boughtCards = [].concat(player.cards.blue, player.cards.red, player.cards.yellow, player.cards.purple, player.cards.orange, player.cards.location);
            var boughtCardString = boughtCards.map(card => card.cardInfo.name).toString();
            data[`player_${i}_cards`] = boughtCardString;
        }
        this.sendActionUpdateDB(data);
    }
    async sendActionUpdateDB(data) {
        await fetch('/action-update', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }
    updateReservedDisplay() {
        for (var i = 1; i <= 3; i++) {
            var cardElement = document.querySelector(`#card-r-${i}`);
            if (i <= this.reserved.length) {
                var card = this.reserved[i - 1];
                cardElement.style.display = "block";
                cardElement.src = `./images/cards/${card.cardInfo.imageLink}`;
                cardElement.checked = false;
                cardElement.style.filter = null;
            }
            else {
                cardElement.style.display = "none";
                cardElement.checked = false;
            }
        }
    }
    updateDisplay() {
        var turnAlertBar = document.getElementById("current-turn-player");
        if (this.playerId === this.engine.playerTurn) {
            turnAlertBar.innerHTML = `Your turn`;
            turnAlertBar.style.backgroundColor = "#34d414";
        }
        else {
            turnAlertBar.innerHTML = `Waiting for Player ${this.engine.playerTurn}`;
            turnAlertBar.style.backgroundColor = "red";
        }
        document.querySelector("#player-number").innerHTML = `Player ${this.engine.thisPlayerId}`;
        document.querySelector("#player-score").innerHTML = `Score: ${this.score.points}`;
        document.querySelector("#player-avenger-points").innerHTML = `Avenger points: ${this.score.avengerPoints}`;
        document.querySelector("#player-blue-gems").innerHTML = `Blue gems: ${this.currency.blue}`;
        document.querySelector("#player-red-gems").innerHTML = `Red gems: ${this.currency.red}`;
        document.querySelector("#player-yellow-gems").innerHTML = `Yellow gems: ${this.currency.yellow}`;
        document.querySelector("#player-purple-gems").innerHTML = `Purple gems: ${this.currency.purple}`;
        document.querySelector("#player-orange-gems").innerHTML = `Orange gems: ${this.currency.orange}`;
        document.querySelector("#player-shield-tokens").innerHTML = `Shield tokens: ${this.currency.shield}`;
        document.querySelector("#player-blue-cards").innerHTML = `Blue cards: ${this.cards.blue.length}`;
        document.querySelector("#player-red-cards").innerHTML = `Red cards: ${this.cards.red.length}`;
        document.querySelector("#player-yellow-cards").innerHTML = `Yellow cards: ${this.cards.yellow.length}`;
        document.querySelector("#player-purple-cards").innerHTML = `Purple cards: ${this.cards.purple.length}`;
        document.querySelector("#player-orange-cards").innerHTML = `Orange cards: ${this.cards.orange.length}`;
        document.querySelector("#player-location-cards").innerHTML = `Location cards: ${this.cards.location.length}`;
        document.querySelector("#player-reserved-cards").innerHTML = `Reserved cards: ${this.reserved.length}`;
        this.updateReservedDisplay();
    }
    updateOtherPlayerDisplay(currentPlayerId) {
        var i = this.playerId;
        if (this.playerId >= currentPlayerId) {
            i -= 1;
        }
        var playerDisplay = document.querySelector(`#p${i}-display`);
        playerDisplay.style.display = "block";
        document.querySelector(`#p${i}-number`).innerHTML = `Player ${this.playerId}`;
        document.querySelector(`#p${i}-score`).innerHTML = `Score: ${this.score.points}`;
        document.querySelector(`#p${i}-avenger-points`).innerHTML = `Avenger points: ${this.score.avengerPoints}`;
        document.querySelector(`#p${i}-blue-gems`).innerHTML = `Blue gems: ${this.currency.blue}`;
        document.querySelector(`#p${i}-red-gems`).innerHTML = `Red gems: ${this.currency.red}`;
        document.querySelector(`#p${i}-yellow-gems`).innerHTML = `Yellow gems: ${this.currency.yellow}`;
        document.querySelector(`#p${i}-purple-gems`).innerHTML = `Purple gems: ${this.currency.purple}`;
        document.querySelector(`#p${i}-orange-gems`).innerHTML = `Orange gems: ${this.currency.orange}`;
        document.querySelector(`#p${i}-shield-tokens`).innerHTML = `Shield tokens: ${this.currency.shield}`;
        document.querySelector(`#p${i}-blue-cards`).innerHTML = `Blue cards: ${this.cards.blue.length}`;
        document.querySelector(`#p${i}-red-cards`).innerHTML = `Red cards: ${this.cards.red.length}`;
        document.querySelector(`#p${i}-yellow-cards`).innerHTML = `Yellow cards: ${this.cards.yellow.length}`;
        document.querySelector(`#p${i}-purple-cards`).innerHTML = `Purple cards: ${this.cards.purple.length}`;
        document.querySelector(`#p${i}-orange-cards`).innerHTML = `Orange cards: ${this.cards.orange.length}`;
        document.querySelector(`#p${i}-location-cards`).innerHTML = `Location cards: ${this.cards.location.length}`;
        document.querySelector(`#p${i}-reserved-cards`).innerHTML = `Reserved cards: ${this.reserved.length}`;
    }
    takeAction(actionType, actionVal) {
        if (this.engine.gameState === "ended") {
            throw new Error("Game has ended.");
        }
        if (this.engine.playerTurn !== this.playerId) {
            throw new Error("It is not your turn to move.");
        }
        if (actionType === "pick3") {
            return this.pick3Action(actionVal);
        }
        else if (actionType === "pick2") {
            return this.pick2Action(actionVal);
        }
        else if (actionType === "reserve") {
            return this.reserveAction(actionVal);
        }
        else if (actionType === "pick-card") {
            return this.pickCardAction(actionVal);
        }
        if (actionType === "discard-gem") {
            return this.discardGemAction(actionVal);
        }
    }
    pick3Action(actionVal) {
        if (actionVal.length > 3) {
            throw new Error("Maximum of 3 gems can be selected.");
        }
        if (actionVal.length < 1) {
            throw new Error("At least one gem needs to be selected.");
        }
        if ((new Set(actionVal)).size !== actionVal.length) {
            throw new Error("Each gem cannot be selected more than once.");
        }
        actionVal.forEach(gem => {
            if (!this.gemTypes.has(gem)) {
                throw new Error(`Selected gem: ${gem} is not a valid gem type.`);
            }
            if (this.engine.board.currency[`${gem}`] < 1) {
                throw new Error(`Not enough ${gem} gems, please make another selection.`);
            }
        });
        var gemCount = 0;
        var colors = ["blue", "red", "yellow", "purple", "orange", "shield"];
        colors.forEach(color => {
            gemCount += this.currency[`${color}`];
        });
        if (gemCount + actionVal.length > 10) {
            throw new Error(`Maximum of 10 total gems, please spend or discard some gems first.`);
        }
        var actionString = "";
        actionVal.forEach(gem => {
            this.takeGems(gem, 1);
            if (actionString === "") {
                actionString = gem;
            }
            else {
                actionString = actionString.concat(",", gem);
            }
        });
        this.takeLocationCard();
        this.engine.nextPlayerTurn();
        this.engine.updateDisplay();
        this.updateDisplay();
        this.actionUpdateDB("pick3", actionString);
        return "Success";
    }
    pick2Action(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select one gem type");
        }
        actionVal.forEach(gem => {
            if (!this.gemTypes.has(gem)) {
                throw new Error(`Selected gem: ${gem} is not a valid gem type.`);
            }
            if (this.engine.board.currency[`${gem}`] < 4) {
                throw new Error(`Not enough ${gem} gems (pile must have at least 4 gems).`);
            }
        });
        var gemCount = 0;
        var colors = ["blue", "red", "yellow", "purple", "orange", "shield"];
        colors.forEach(color => {
            gemCount += this.currency[`${color}`];
        });
        if (gemCount + 2 > 10) {
            throw new Error(`Maximum of 10 total gems, please spend or discard some gems first.`);
        }
        var actionString = "";
        actionVal.forEach(gem => {
            this.takeGems(gem, 2);
            actionString = gem;
        });
        this.takeLocationCard();
        this.engine.nextPlayerTurn();
        this.engine.updateDisplay();
        this.updateDisplay();
        this.actionUpdateDB("pick2", actionString);
        return "Success";
    }
    reserveAction(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        actionVal.forEach(cardId => {
            // id: card-${cardLevel}-${cardPosition}
            var level = cardId.split("-")[1];
            var position = cardId.split("-")[2];
            const card = this.engine.board.getCard(+level, +position);
            if (card === null) {
                throw new Error(`Card id ${cardId} does not exist`);
            }
            if (this.reserved.length >= 3) {
                throw new Error(`Cannot have more than 3 reserved cards at a time.`);
            }
            var gemCount = 0;
            var colors = ["blue", "red", "yellow", "purple", "orange", "shield"];
            colors.forEach(color => {
                gemCount += this.currency[`${color}`];
            });
            if (gemCount + 1 > 10) {
                throw new Error(`Maximum of 10 total gems, please spend or discard some gems first.`);
            }
            this.reserved.push(card);
            try {
                const newCard = this.engine.deck.takeCard(+level);
                this.engine.board.placeCard(level, +position, newCard);
            }
            catch (error) {
                this.engine.board.placeCard(level, +position, null);
            }
            if (this.engine.board.currency["shield"] >= 1) {
                this.takeGems("shield", 1);
            }
            var actionString = card.cardInfo.name;
            this.takeLocationCard();
            this.engine.nextPlayerTurn();
            this.engine.updateDisplay();
            this.updateDisplay();
            this.actionUpdateDB("reserve", actionString);
        });
        return "Success";
    }
    pickCardAction(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        actionVal.forEach(cardId => {
            // id: card-${cardLevel}-${cardPosition}
            var level = cardId.split("-")[1];
            var position = cardId.split("-")[2];
            var card = null;
            if (level === "r") {
                card = this.reserved[`${+position - 1}`];
            }
            else {
                card = this.engine.board.getCard(+level, +position);
            }
            if (!card) {
                throw new Error(`Card id ${cardId} does not exist`);
            }
            // Attempt to buy card
            try {
                this.buyCard(card);
            }
            catch (error) {
                throw error;
            }
            // Update board after successfully buying card
            if (level === "r") {
                this.reserved = this.reserved.filter(reservedCard => reservedCard.cardInfo.name !== card.cardInfo.name);
            }
            else {
                try {
                    const newCard = this.engine.deck.takeCard(+level);
                    this.engine.board.placeCard(level, +position, newCard);
                }
                catch (error) {
                    this.engine.board.placeCard(level, +position, null);
                }
            }
            var actionString = card.cardInfo.name;
            this.takeLocationCard();
            this.engine.nextPlayerTurn();
            this.engine.updateDisplay();
            this.updateDisplay();
            this.actionUpdateDB("buy", actionString);
        });
        return "Success";
    }
    discardGemAction(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select one gem type");
        }
        actionVal.forEach(gem => {
            if (!this.gemTypes.has(gem)) {
                throw new Error(`Selected gem: ${gem} is not a valid gem type.`);
            }
            if (this.currency[`${gem}`] < 1) {
                throw new Error(`You do not have any ${gem} gems to discard.`);
            }
            this.discardGems(gem, 1);
        });
        this.engine.updateDisplay();
        this.updateDisplay();
        return "Success";
    }
}
