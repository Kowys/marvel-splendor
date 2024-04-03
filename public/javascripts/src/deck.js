import { Card } from './card.js';
import cardsJson from './cards.json' assert { type: 'json' };
export class Deck {
    levelOneCards = [];
    levelTwoCards = [];
    levelThreeCards = [];
    locationCards = [];
    takeCard(level) {
        if (level === 1) {
            return this.takeLevelOneCard();
        }
        else if (level === 2) {
            return this.takeLevelTwoCard();
        }
        else if (level === 3) {
            return this.takeLevelThreeCard();
        }
    }
    takeNamedCard(name) {
        var targetCard = null;
        this.levelOneCards.forEach(card => {
            if (card.cardInfo.name === name) {
                targetCard = card;
                this.levelOneCards = this.levelOneCards.filter(c => c.cardInfo.name !== targetCard.cardInfo.name);
                return;
            }
        });
        this.levelTwoCards.forEach(card => {
            if (card.cardInfo.name === name) {
                targetCard = card;
                this.levelTwoCards = this.levelTwoCards.filter(c => c.cardInfo.name !== targetCard.cardInfo.name);
                return;
            }
        });
        this.levelThreeCards.forEach(card => {
            if (card.cardInfo.name === name) {
                targetCard = card;
                this.levelThreeCards = this.levelThreeCards.filter(c => c.cardInfo.name !== targetCard.cardInfo.name);
                return;
            }
        });
        this.locationCards.forEach(card => {
            if (card.cardInfo.name === name) {
                targetCard = card;
                this.locationCards = this.locationCards.filter(c => c.cardInfo.name !== targetCard.cardInfo.name);
                return;
            }
        });
        return targetCard;
    }
    takeLevelOneCard() {
        if (this.levelOneCards.length > 0) {
            return this.levelOneCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 1 deck.");
        }
    }
    takeLevelTwoCard() {
        if (this.levelTwoCards.length > 0) {
            return this.levelTwoCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 2 deck.");
        }
    }
    takeLevelThreeCard() {
        if (this.levelThreeCards.length > 0) {
            return this.levelThreeCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 3 deck.");
        }
    }
    takeLocationCard() {
        if (this.locationCards.length > 0) {
            return this.locationCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in locations deck.");
        }
    }
    resetDeck() {
        cardsJson.cards.forEach(cardJson => {
            const card = new Card();
            card.setInfo({ name: cardJson.name, level: cardJson.level, isLocation: cardJson.isLocation, imageLink: cardJson.imageLink });
            card.setPoints({ points: cardJson.points, avengerPoints: cardJson.avengerPoints });
            card.setCosts({ blueCost: cardJson.blueCost, redCost: cardJson.redCost, yellowCost: cardJson.yellowCost, purpleCost: cardJson.purpleCost, orangeCost: cardJson.orangeCost });
            card.setIncomes({ blueIncome: cardJson.blueIncome, redIncome: cardJson.redIncome, yellowIncome: cardJson.yellowIncome, purpleIncome: cardJson.purpleIncome, orangeIncome: cardJson.orangeIncome });
            if (cardJson.level === 1) {
                this.levelOneCards.push(card);
            }
            else if (cardJson.level === 2) {
                this.levelTwoCards.push(card);
            }
            else if (cardJson.level === 3) {
                this.levelThreeCards.push(card);
            }
            else if (cardJson.isLocation === true) {
                this.locationCards.push(card);
            }
        });
        const shuffle = (array) => {
            return array.sort(() => Math.random() - 0.5);
        };
        this.levelOneCards = shuffle(this.levelOneCards);
        this.levelTwoCards = shuffle(this.levelTwoCards);
        this.levelThreeCards = shuffle(this.levelThreeCards);
        this.locationCards = shuffle(this.locationCards);
    }
}
const deck1 = new Deck();
deck1.resetDeck();
console.log(deck1.takeLevelOneCard().getCardAttributes());
console.log(deck1.takeLevelOneCard().getCardAttributes());
console.log(deck1.takeLevelTwoCard().getCardAttributes());
console.log(deck1.takeLevelThreeCard().getCardAttributes());
console.log(deck1.takeLocationCard().getCardAttributes());
