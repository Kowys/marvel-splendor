"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var Card = /** @class */ (function () {
    function Card() {
        this.info = { name: "", level: 0, isLocation: false, imageLink: '' };
        this.points = { points: 0, avengerPoints: 0 };
        this.costs = { blueCost: 0, redCost: 0, yellowCost: 0, purpleCost: 0, orangeCost: 0 };
        this.incomes = { blueIncome: 0, redIncome: 0, yellowIncome: 0, purpleIncome: 0, orangeIncome: 0 };
    }
    Card.prototype.setInfo = function (info) {
        this.info = info;
    };
    Card.prototype.setPoints = function (points) {
        this.points = points;
    };
    Card.prototype.setCosts = function (costs) {
        this.costs = costs;
    };
    Card.prototype.setIncomes = function (incomes) {
        this.incomes = incomes;
    };
    Card.prototype.getCardAttributes = function () {
        var attr = '';
        attr += "Card name: ".concat(this.info.name, "\n");
        attr += "Level: ".concat(this.info.level, "\n");
        if (this.info.isLocation) {
            attr += "Location card\n";
        }
        else {
            attr += "Character card\n";
        }
        attr += "Image link: ".concat(this.info.imageLink, "\n\n");
        attr += "Points: ".concat(this.points.points, "\n");
        attr += "Avenger points: ".concat(this.points.avengerPoints, "\n\n");
        attr += "Blue cost: ".concat(this.costs.blueCost, "\n");
        attr += "Red cost: ".concat(this.costs.redCost, "\n");
        attr += "Yellow cost: ".concat(this.costs.yellowCost, "\n");
        attr += "Purple cost: ".concat(this.costs.purpleCost, "\n");
        attr += "Orange cost: ".concat(this.costs.orangeCost, "\n\n");
        attr += "Blue income: ".concat(this.incomes.blueIncome, "\n");
        attr += "Red income: ".concat(this.incomes.redIncome, "\n");
        attr += "Yellow income: ".concat(this.incomes.yellowIncome, "\n");
        attr += "Purple income: ".concat(this.incomes.purpleIncome, "\n");
        attr += "Orange income: ".concat(this.incomes.orangeIncome, "\n");
        return attr;
    };
    return Card;
}());
exports.Card = Card;
// const card1: any = new Card()
// console.log(card1.getCardAttributes())
// card1.setInfo({name: 'avenger', level: 1, isLocation: true, imageLink: ''})
// card1.setPoints({points: 2, avengerPoints: 0})
// card1.setCosts({blueCost: 1, redCost: 3, yellowCost: 0, purpleCost: 2, orangeCost: 0})
// card1.setIncomes({blueIncome: 0, redIncome: 0, yellowIncome: 1, purpleIncome: 0, orangeIncome: 0})
// console.log(card1.getCardAttributes())
