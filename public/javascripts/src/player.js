export class Player {
    playerId;
    engine;
    score = { points: 0, avengerPoints: 0, greenGems: 0 };
    currency = { blue: 0, red: 0, yellow: 0, purple: 0, orange: 0, shield: 0 };
    cards = { blue: [], red: [], yellow: [], purple: [], orange: [] };
    reserved = [];
    gemTypes = new Set(["blue", "red", "yellow", "purple", "orange"]);
    constructor(id, engine) {
        this.playerId = id;
        this.engine = engine;
    }
    takeGems(color, amount) {
        this.currency[`${color}`] += amount;
        this.engine.board.takeCurrency(color, amount);
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
                if (card.cardInfo.level === 3) {
                    this.score.greenGems += 1;
                }
            }
        });
    }
    updateDisplay() {
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
        document.querySelector("#player-reserved-cards").innerHTML = `Reserved cards: ${this.reserved.length}`;
    }
    takeAction(actionType, actionVal) {
        if (this.engine.gameEnded) {
            throw new Error("Game has ended.");
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
        actionVal.forEach(gem => {
            this.takeGems(gem, 1);
        });
        this.engine.updateDisplay();
        this.updateDisplay();
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
        actionVal.forEach(gem => {
            this.takeGems(gem, 2);
        });
        this.engine.updateDisplay();
        this.updateDisplay();
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
            this.reserved.push(card);
            try {
                const newCard = this.engine.deck.takeCard(+level);
                this.engine.board.placeCard(+level, +position, newCard);
            }
            catch (error) {
                this.engine.board.updateCardDisplay(+level, +position, null);
            }
            if (this.engine.board.currency["shield"] >= 1) {
                this.takeGems("shield", 1);
            }
            this.engine.updateDisplay();
            this.updateDisplay();
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
            const card = this.engine.board.getCard(+level, +position);
            if (card === undefined) {
                throw new Error(`Card id ${cardId} does not exist`);
            }
            // Attempt to buy card
            try {
                this.buyCard(card);
            }
            catch (error) {
                throw error;
            }
            // Update all displays after successfully buying card
            try {
                const newCard = this.engine.deck.takeCard(+level);
                this.engine.board.placeCard(+level, +position, newCard);
            }
            catch (error) {
                this.engine.board.updateCardDisplay(+level, +position, null);
            }
            this.engine.updateDisplay();
            this.updateDisplay();
        });
        return "Success";
    }
}
