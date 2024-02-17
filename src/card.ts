export class Card {
    public cardInfo: cardInfo = {name: "", level: 0, isLocation: false, imageLink: ''}
    public points: Points = {points: 0, avengerPoints: 0}
    public costs: Costs = {blueCost: 0, redCost: 0, yellowCost: 0, purpleCost: 0, orangeCost: 0}
    public incomes: Incomes = {blueIncome: 0, redIncome: 0, yellowIncome: 0, purpleIncome: 0, orangeIncome: 0}

    public setInfo(info: cardInfo) {
    	this.cardInfo = info
    }

    public setPoints(points: Points) {
    	this.points = points
    }

    public setCosts(costs: Costs) {
		this.costs = costs
    }

    public setIncomes(incomes: Incomes) {
		this.incomes = incomes
    }
 
    public getCardAttributes(){
		var attr = ''
		attr += `Card name: ${this.cardInfo.name}\n`
		attr += `Level: ${this.cardInfo.level}\n`
		if (this.cardInfo.isLocation) {
			attr += `Location card\n`
		} else {
			attr += `Character card\n`
		}
		attr += `Image link: ${this.cardInfo.imageLink}\n\n`
		attr += `Points: ${this.points.points}\n`
		attr += `Avenger points: ${this.points.avengerPoints}\n\n`

		attr += `Blue cost: ${this.costs.blueCost}\n`
		attr += `Red cost: ${this.costs.redCost}\n`
		attr += `Yellow cost: ${this.costs.yellowCost}\n`
		attr += `Purple cost: ${this.costs.purpleCost}\n`
		attr += `Orange cost: ${this.costs.orangeCost}\n\n`

		attr += `Blue income: ${this.incomes.blueIncome}\n`
		attr += `Red income: ${this.incomes.redIncome}\n`
		attr += `Yellow income: ${this.incomes.yellowIncome}\n`
		attr += `Purple income: ${this.incomes.purpleIncome}\n`
		attr += `Orange income: ${this.incomes.orangeIncome}\n`

		return attr
    }
 }

 type cardInfo = {
	name: string
	level: number
	isLocation: boolean
	imageLink: string
}

type Points = {
	points: number
	avengerPoints: number
}

type Costs = {
	blueCost: number
	redCost: number
	yellowCost: number
	purpleCost: number
	orangeCost: number
}

type Incomes = {
	blueIncome: number
	redIncome: number
	yellowIncome: number
	purpleIncome: number
	orangeIncome: number
}


// const card1: any = new Card()
// console.log(card1.getCardAttributes())
// card1.setInfo({name: 'avenger', level: 1, isLocation: true, imageLink: ''})
// card1.setPoints({points: 2, avengerPoints: 0})
// card1.setCosts({blueCost: 1, redCost: 3, yellowCost: 0, purpleCost: 2, orangeCost: 0})
// card1.setIncomes({blueIncome: 0, redIncome: 0, yellowIncome: 1, purpleIncome: 0, orangeIncome: 0})

// console.log(card1.getCardAttributes())

