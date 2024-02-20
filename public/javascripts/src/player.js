export class Player {
    playerId;
    currency = { blue: null, red: null, yellow: null, purple: null, orange: null, shield: null };
    constructor(id) {
        this.playerId = id;
    }
    takeAction(actionType, actionVal) {
        if (actionType === "pick3") {
            return this.pick3Action(actionVal);
        }
        else if (actionType === "pick2") {
            return this.pick2Action(actionVal);
        }
        else if (actionType === "reserve") {
            return this.reserveAction(actionVal);
        }
        else if (actionType === "pick-card") {
            return this.pickCardAction(actionVal);
        }
    }
    pick3Action(actionVal) {
        if (actionVal.length !== 3) {
            throw new Error("Exactly 3 gems need to be selected.");
        }
        return "Success";
    }
    pick2Action(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select one gem type");
        }
        return "Success";
    }
    reserveAction(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        return "Success";
    }
    pickCardAction(actionVal) {
        if (actionVal.length !== 1) {
            throw new Error("Select a card");
        }
        return "Success";
    }
}
