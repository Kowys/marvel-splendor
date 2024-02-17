import {Card} from './card.js'

export class Board {
    public levelOneCards: LevelOneCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public levelTwoCards: LevelTwoCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public levelThreeCards: LevelThreeCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public locationCards: LocationCards

    public currency: Currency

    public placeCard(level: number, position: number, card: Card) {
        if (level === 1) {
            this.placeLevelOneCard(position, card);
        } else
        if (level === 2) {
            this.placeLevelTwoCard(position, card);
        } else
        if (level === 3) {
            this.placeLevelThreeCard(position, card);
        }
    }

    public placeLevelOneCard(position: number, card: Card) {
        if (position === 1) {
            this.levelOneCards.pos1 = card;
        } else 
        if (position == 2) {
            this.levelOneCards.pos2 = card;
        } else
        if (position === 3) {
            this.levelOneCards.pos3 = card;
        } else
        if (position === 4) {
            this.levelOneCards.pos4 = card;
        }
    }

    public placeLevelTwoCard(position: number, card: Card) {
        if (position === 1) {
            this.levelTwoCards.pos1 = card;
        } else 
        if (position == 2) {
            this.levelTwoCards.pos2 = card;
        } else
        if (position === 3) {
            this.levelTwoCards.pos3 = card;
        } else
        if (position === 4) {
            this.levelTwoCards.pos4 = card;
        }
    }

    public placeLevelThreeCard(position: number, card: Card) {
        if (position === 1) {
            this.levelThreeCards.pos1 = card;
        } else 
        if (position == 2) {
            this.levelThreeCards.pos2 = card;
        } else
        if (position === 3) {
            this.levelThreeCards.pos3 = card;
        } else
        if (position === 4) {
            this.levelThreeCards.pos4 = card;
        }
    }

    public getCard(level: number, position: number) {
        if (level === 1) {
            return this.getLevelOneCard(position);
        } else
        if (level === 2) {
            return this.getLevelTwoCard(position);
        } else
        if (level === 3) {
            return this.getLevelThreeCard(position);
        }
    }

    public getLevelOneCard(position: number) {
        if (position === 1) {
            return this.levelOneCards.pos1;
        } else 
        if (position == 2) {
            return this.levelOneCards.pos2;
        } else
        if (position === 3) {
            return this.levelOneCards.pos3;
        } else
        if (position === 4) {
            return this.levelOneCards.pos4;
        }
    }

    public getLevelTwoCard(position: number) {
        if (position === 1) {
            return this.levelTwoCards.pos1;
        } else 
        if (position == 2) {
            return this.levelTwoCards.pos2;
        } else
        if (position === 3) {
            return this.levelTwoCards.pos3;
        } else
        if (position === 4) {
            return this.levelTwoCards.pos4;
        }
    }

    public getLevelThreeCard(position: number) {
        if (position === 1) {
            return this.levelThreeCards.pos1;
        } else 
        if (position == 2) {
            return this.levelThreeCards.pos2;
        } else
        if (position === 3) {
            return this.levelThreeCards.pos3;
        } else
        if (position === 4) {
            return this.levelThreeCards.pos4;
        }
    }

    public updateCurrency(colour: string, amount: number) {
        
    }
}

type LevelOneCards = {
	pos1: Card
	pos2: Card
	pos3: Card
	pos4: Card
}

type LevelTwoCards = {
	pos1: Card
	pos2: Card
	pos3: Card
	pos4: Card
}

type LevelThreeCards = {
	pos1: Card
	pos2: Card
	pos3: Card
	pos4: Card
}

type LocationCards = {
	pos1: Card
	pos2: Card
	pos3: Card
	pos4: Card
}

type Currency = {
    blue: number
    red: number
    yellow: number
    purple: number
    orange: number
}