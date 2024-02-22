import {Card} from './card.js'
import cardsJson from './cards.json' assert {type: 'json'};

export class Deck {
    public levelOneCards: Card[] = []
    public levelTwoCards: Card[] = []
    public levelThreeCards: Card[] = []
    public locationCards: Card[] = []

    public takeCard(level: number): Card {
        if (level === 1) {
            return this.takeLevelOneCard()
        } else
        if (level === 2) {
            return this.takeLevelTwoCard()
        } else
        if (level === 3) {
            return this.takeLevelThreeCard()
        }
    }

    public takeLevelOneCard(): Card {
        if (this.levelOneCards.length > 0) {
            return this.levelOneCards.pop()
        } else {
            throw new RangeError("No cards remaining in level 1 deck.")
        }
    }

    public takeLevelTwoCard(): Card {
        if (this.levelTwoCards.length > 0) {
            return this.levelTwoCards.pop()
        } else {
            throw new RangeError("No cards remaining in level 2 deck.")
        }
    }

    public takeLevelThreeCard(): Card {
        if (this.levelThreeCards.length > 0) {
            return this.levelThreeCards.pop()
        } else {
            throw new RangeError("No cards remaining in level 3 deck.")
        }
    }

    public takeLocationCard(): Card {
        if (this.locationCards.length > 0) {
            return this.locationCards.pop()
        } else {
            throw new RangeError("No cards remaining in locations deck.")
        }
    }

    public resetDeck() {
        cardsJson.cards.forEach(cardJson => {
            const card: any = new Card()
            card.setInfo({name: cardJson.name, level: cardJson.level, isLocation: cardJson.isLocation, imageLink: cardJson.imageLink})
            card.setPoints({points: cardJson.points, avengerPoints: cardJson.avengerPoints})
            card.setCosts({blueCost: cardJson.blueCost, redCost: cardJson.redCost, yellowCost: cardJson.yellowCost, purpleCost: cardJson.purpleCost, orangeCost: cardJson.orangeCost})
            card.setIncomes({blueIncome: cardJson.blueIncome, redIncome: cardJson.redIncome, yellowIncome: cardJson.yellowIncome, purpleIncome: cardJson.purpleIncome, orangeIncome: cardJson.orangeIncome})

            if (cardJson.level === 1) {
                this.levelOneCards.push(card)
            } else 
            if (cardJson.level === 2) {
                this.levelTwoCards.push(card)
            } else
            if (cardJson.level === 3) {
                this.levelThreeCards.push(card)
            } else
            if (cardJson.isLocation === true) {
                this.locationCards.push(card)
            }
        });

        const shuffle = (array: Card[]) => { 
            return array.sort(() => Math.random() - 0.5); 
        };

        this.levelOneCards = shuffle(this.levelOneCards)
        this.levelTwoCards = shuffle(this.levelTwoCards)
        this.levelThreeCards = shuffle(this.levelThreeCards)
        this.locationCards = shuffle(this.locationCards)
    }
}
    
const deck1: any = new Deck()
deck1.resetDeck()

console.log(deck1.takeLevelOneCard().getCardAttributes())
console.log(deck1.takeLevelOneCard().getCardAttributes())
console.log(deck1.takeLevelTwoCard().getCardAttributes())
console.log(deck1.takeLevelThreeCard().getCardAttributes())
console.log(deck1.takeLocationCard().getCardAttributes())