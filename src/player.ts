export class Player {
    public playerId: number
    public currency: Currency = {blue: null, red: null, yellow: null, purple: null, orange: null, shield: null}

    constructor(id: number) {
        this.playerId = id;
    }

    public takeAction(actionType: string, actionVal: string[]) {
        if (actionType === "pick3") {
            return this.pick3Action(actionVal);
        } else 
        if (actionType === "pick2") {
            return this.pick2Action(actionVal);
        } else
        if (actionType === "reserve") {
            return this.reserveAction(actionVal);
        } else
        if (actionType === "pick-card") {
            return this.pickCardAction(actionVal);
        }
    }

    public pick3Action(actionVal: string[]) {
        if (actionVal.length !== 3) {
            throw new Error("Exactly 3 gems need to be selected.");
        }
        
        return "Success";
    }

    public pick2Action(actionVal: string[]) {
        if (actionVal.length !== 1) {
            throw new Error("Select one gem type");
        }
        
        return "Success";
    }

    public reserveAction(actionVal: string[]) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        
        return "Success";
    }

    public pickCardAction(actionVal: string[]) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        
        return "Success";
    }
}

type Currency = {
    blue: number
    red: number
    yellow: number
    purple: number
    orange: number
    shield: number
}