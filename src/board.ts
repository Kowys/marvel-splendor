import {Card} from './card.js'

export class Board {
    public levelOneCards: LevelOneCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public levelTwoCards: LevelTwoCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public levelThreeCards: LevelThreeCards = {pos1: null, pos2: null, pos3: null, pos4: null}
    public locationCards: LocationCards = {pos1: null, pos2: null, pos3: null, pos4: null}

    public currency: Currency = {blue: null, red: null, yellow: null, purple: null, orange: null, shield: null}

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
        this.updateCardDisplay(level, position, card);
    }

    public placeLevelOneCard(position: number, card: Card) {
        this.levelOneCards[`pos${position}`] = card;
    }

    public placeLevelTwoCard(position: number, card: Card) {
        this.levelTwoCards[`pos${position}`] = card;
    }

    public placeLevelThreeCard(position: number, card: Card) {
        this.levelThreeCards[`pos${position}`] = card;
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
        return this.levelOneCards[`pos${position}`];
    }

    public getLevelTwoCard(position: number) {
        return this.levelTwoCards[`pos${position}`];
    }

    public getLevelThreeCard(position: number) {
        return this.levelThreeCards[`pos${position}`];
    }

    public updateCurrency(colour: string, amount: number) {
        this.currency[`${colour}`] = amount
    }

    public addCurrency(colour: string, amount: number) {
        this.currency[`${colour}`] += amount
    }

    public takeCurrency(colour: string, amount: number) {
        this.currency[`${colour}`] -= amount
    }

    public updateCardDisplay(level: number, position: number, card: Card) {
        const cardElement = document.querySelector(`#card-${level}-${position}`) as HTMLInputElement;
        if (card === null) {
            cardElement.style.display = "none";
            cardElement.checked = false;
        } else {
            cardElement.style.display = "block";
            cardElement.src = `./images/cards/${card.cardInfo.imageLink}`;
            cardElement.checked = false;
            cardElement.style.filter = null;
        }
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
    shield: number
}