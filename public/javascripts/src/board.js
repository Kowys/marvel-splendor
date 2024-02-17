export class Board {
    levelOneCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    levelTwoCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    levelThreeCards = { pos1: null, pos2: null, pos3: null, pos4: null };
    locationCards;
    currency;
    placeCard(level, position, card) {
        if (level === 1) {
            this.placeLevelOneCard(position, card);
        }
        else if (level === 2) {
            this.placeLevelTwoCard(position, card);
        }
        else if (level === 3) {
            this.placeLevelThreeCard(position, card);
        }
    }
    placeLevelOneCard(position, card) {
        if (position === 1) {
            this.levelOneCards.pos1 = card;
        }
        else if (position == 2) {
            this.levelOneCards.pos2 = card;
        }
        else if (position === 3) {
            this.levelOneCards.pos3 = card;
        }
        else if (position === 4) {
            this.levelOneCards.pos4 = card;
        }
    }
    placeLevelTwoCard(position, card) {
        if (position === 1) {
            this.levelTwoCards.pos1 = card;
        }
        else if (position == 2) {
            this.levelTwoCards.pos2 = card;
        }
        else if (position === 3) {
            this.levelTwoCards.pos3 = card;
        }
        else if (position === 4) {
            this.levelTwoCards.pos4 = card;
        }
    }
    placeLevelThreeCard(position, card) {
        if (position === 1) {
            this.levelThreeCards.pos1 = card;
        }
        else if (position == 2) {
            this.levelThreeCards.pos2 = card;
        }
        else if (position === 3) {
            this.levelThreeCards.pos3 = card;
        }
        else if (position === 4) {
            this.levelThreeCards.pos4 = card;
        }
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
        if (position === 1) {
            return this.levelOneCards.pos1;
        }
        else if (position == 2) {
            return this.levelOneCards.pos2;
        }
        else if (position === 3) {
            return this.levelOneCards.pos3;
        }
        else if (position === 4) {
            return this.levelOneCards.pos4;
        }
    }
    getLevelTwoCard(position) {
        if (position === 1) {
            return this.levelTwoCards.pos1;
        }
        else if (position == 2) {
            return this.levelTwoCards.pos2;
        }
        else if (position === 3) {
            return this.levelTwoCards.pos3;
        }
        else if (position === 4) {
            return this.levelTwoCards.pos4;
        }
    }
    getLevelThreeCard(position) {
        if (position === 1) {
            return this.levelThreeCards.pos1;
        }
        else if (position == 2) {
            return this.levelThreeCards.pos2;
        }
        else if (position === 3) {
            return this.levelThreeCards.pos3;
        }
        else if (position === 4) {
            return this.levelThreeCards.pos4;
        }
    }
    updateCurrency(colour, amount) {
    }
}
