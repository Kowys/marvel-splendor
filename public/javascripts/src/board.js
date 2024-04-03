export class Board {
    levelOneCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    levelTwoCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    levelThreeCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    locationCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    currency = { blue: null, red: null, yellow: null, purple: null, orange: null, shield: null };
    placeCard(level, position, card) {
        if (level === "1") {
            this.placeLevelOneCard(position, card);
        }
        else if (level === "2") {
            this.placeLevelTwoCard(position, card);
        }
        else if (level === "3") {
            this.placeLevelThreeCard(position, card);
        }
        if (level === "loc") {
            this.placeLocationCard(position, card);
        }
        this.updateCardDisplay(level, position, card);
    }
    placeLevelOneCard(position, card) {
        this.levelOneCards[`pos${position}`] = card;
    }
    placeLevelTwoCard(position, card) {
        this.levelTwoCards[`pos${position}`] = card;
    }
    placeLevelThreeCard(position, card) {
        this.levelThreeCards[`pos${position}`] = card;
    }
    placeLocationCard(position, card) {
        this.locationCards[`pos${position}`] = card;
    }
    getCard(level, position) {
        if (level === 1) {
            return this.getLevelOneCard(position);
        }
        else if (level === 2) {
            return this.getLevelTwoCard(position);
        }
        else if (level === 3) {
            return this.getLevelThreeCard(position);
        }
    }
    getLevelOneCard(position) {
        return this.levelOneCards[`pos${position}`];
    }
    getLevelTwoCard(position) {
        return this.levelTwoCards[`pos${position}`];
    }
    getLevelThreeCard(position) {
        return this.levelThreeCards[`pos${position}`];
    }
    updateCurrency(colour, amount) {
        this.currency[`${colour}`] = amount;
    }
    addCurrency(colour, amount) {
        this.currency[`${colour}`] += amount;
    }
    takeCurrency(colour, amount) {
        this.currency[`${colour}`] -= amount;
    }
    updateCardDisplay(level, position, card) {
        var cardElement = null;
        if (level === "loc") {
            cardElement = document.querySelector(`#location-img-${position}`);
        }
        else {
            cardElement = document.querySelector(`#card-${level}-${position}`);
        }
        if (card === null) {
            cardElement.style.display = "none";
            cardElement.checked = false;
        }
        else {
            cardElement.style.display = "block";
            if (level === "loc") {
                cardElement.src = `./images/locations/${card.cardInfo.imageLink}`;
            }
            else {
                cardElement.src = `./images/cards/${card.cardInfo.imageLink}`;
            }
            cardElement.checked = false;
            cardElement.style.filter = null;
        }
    }
}
