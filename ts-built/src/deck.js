"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("./card");
var cardsJson = __importStar(require("./cards.json"));
var Deck = /** @class */ (function () {
    function Deck() {
        this.levelOneCards = [];
        this.levelTwoCards = [];
        this.levelThreeCards = [];
        this.locationCards = [];
    }
    Deck.prototype.takeLevelOneCard = function () {
        if (this.levelOneCards.length > 0) {
            return this.levelOneCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 1 deck.");
        }
    };
    Deck.prototype.takeLevelTwoCard = function () {
        if (this.levelTwoCards.length > 0) {
            return this.levelTwoCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 2 deck.");
        }
    };
    Deck.prototype.takeLevelThreeCard = function () {
        if (this.levelThreeCards.length > 0) {
            return this.levelThreeCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in level 3 deck.");
        }
    };
    Deck.prototype.takeLocationCard = function () {
        if (this.locationCards.length > 0) {
            return this.locationCards.pop();
        }
        else {
            throw new RangeError("No cards remaining in locations deck.");
        }
    };
    Deck.prototype.resetDeck = function () {
        var _this = this;
        cardsJson.cards.forEach(function (cardJson) {
            var card = new card_1.Card();
            card.setInfo({ name: cardJson.name, level: cardJson.level, isLocation: cardJson.isLocation, imageLink: cardJson.imageLink });
            card.setPoints({ points: cardJson.points, avengerPoints: cardJson.avengerPoints });
            card.setCosts({ blueCost: cardJson.blueCost, redCost: cardJson.redCost, yellowCost: cardJson.yellowCost, purpleCost: cardJson.purpleCost, orangeCost: cardJson.orangeCost });
            card.setIncomes({ blueIncome: cardJson.blueIncome, redIncome: cardJson.redIncome, yellowIncome: cardJson.yellowIncome, purpleIncome: cardJson.purpleIncome, orangeIncome: cardJson.orangeIncome });
            if (cardJson.level === 1) {
                _this.levelOneCards.push(card);
            }
            else if (cardJson.level === 2) {
                _this.levelTwoCards.push(card);
            }
            else if (cardJson.level === 3) {
                _this.levelThreeCards.push(card);
            }
            else if (cardJson.isLocation === true) {
                _this.locationCards.push(card);
            }
        });
        var shuffle = function (array) {
            return array.sort(function () { return Math.random() - 0.5; });
        };
        this.levelOneCards = shuffle(this.levelOneCards);
        this.levelTwoCards = shuffle(this.levelTwoCards);
        this.levelThreeCards = shuffle(this.levelThreeCards);
        this.locationCards = shuffle(this.locationCards);
    };
    return Deck;
}());
var deck1 = new Deck();
deck1.resetDeck();
console.log(deck1.takeLevelOneCard().getCardAttributes());
console.log(deck1.takeLevelOneCard().getCardAttributes());
console.log(deck1.takeLevelTwoCard().getCardAttributes());
console.log(deck1.takeLevelThreeCard().getCardAttributes());
console.log(deck1.takeLocationCard().getCardAttributes());
