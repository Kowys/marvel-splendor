export class Card {
    cardInfo = { name: "", level: 0, isLocation: false, imageLink: '' };
    points = { points: 0, avengerPoints: 0 };
    costs = { blueCost: 0, redCost: 0, yellowCost: 0, purpleCost: 0, orangeCost: 0 };
    incomes = { blueIncome: 0, redIncome: 0, yellowIncome: 0, purpleIncome: 0, orangeIncome: 0 };
    setInfo(info) {
        this.cardInfo = info;
    }
    setPoints(points) {
        this.points = points;
    }
    setCosts(costs) {
        this.costs = costs;
    }
    setIncomes(incomes) {
        this.incomes = incomes;
    }
    getCardAttributes() {
        var attr = '';
        attr += `Card name: ${this.cardInfo.name}\n`;
        attr += `Level: ${this.cardInfo.level}\n`;
        if (this.cardInfo.isLocation) {
            attr += `Location card\n`;
        }
        else {
            attr += `Character card\n`;
        }
        attr += `Image link: ${this.cardInfo.imageLink}\n\n`;
        attr += `Points: ${this.points.points}\n`;
        attr += `Avenger points: ${this.points.avengerPoints}\n\n`;
        attr += `Blue cost: ${this.costs.blueCost}\n`;
        attr += `Red cost: ${this.costs.redCost}\n`;
        attr += `Yellow cost: ${this.costs.yellowCost}\n`;
        attr += `Purple cost: ${this.costs.purpleCost}\n`;
        attr += `Orange cost: ${this.costs.orangeCost}\n\n`;
        attr += `Blue income: ${this.incomes.blueIncome}\n`;
        attr += `Red income: ${this.incomes.redIncome}\n`;
        attr += `Yellow income: ${this.incomes.yellowIncome}\n`;
        attr += `Purple income: ${this.incomes.purpleIncome}\n`;
        attr += `Orange income: ${this.incomes.orangeIncome}\n`;
        return attr;
    }
}
// const card1: any = new Card()
// console.log(card1.getCardAttributes())
// card1.setInfo({name: 'avenger', level: 1, isLocation: true, imageLink: ''})
// card1.setPoints({points: 2, avengerPoints: 0})
// card1.setCosts({blueCost: 1, redCost: 3, yellowCost: 0, purpleCost: 2, orangeCost: 0})
// card1.setIncomes({blueIncome: 0, redIncome: 0, yellowIncome: 1, purpleIncome: 0, orangeIncome: 0})
// console.log(card1.getCardAttributes())
