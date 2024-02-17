import { Deck } from './deck.js';
import { Board } from './board.js';
const btnCounter = document.querySelector("#btncounter");
const dealButton = document.querySelector("#deal");
let counter = 0;
updateDisplay(counter);
function updateDisplay(c) {
    document.querySelector("#result").innerHTML = `Count: ${c}`;
}
;
btnCounter.addEventListener('click', () => {
    counter += 3;
    console.log(counter);
    updateDisplay(counter);
});
function dealCards() {
    const deck = new Deck();
    deck.resetDeck();
    const board = new Board();
    const levelMap = new Map();
    levelMap.set("1", () => deck.takeLevelOneCard())
        .set("2", () => deck.takeLevelTwoCard())
        .set("3", () => deck.takeLevelThreeCard());
    const levels = ["1", "2", "3"];
    levels.forEach(cardLevel => {
        const positions = ['1', '2', '3', '4'];
        positions.forEach(cardPosition => {
            const card = levelMap.get(cardLevel)();
            board.placeCard(+cardLevel, +cardPosition, card);
            const boardCard = board.getCard(+cardLevel, +cardPosition);
            const imgURL = `<img class="card" src="./images/cards/${boardCard.cardInfo.imageLink}" alt="Card"/>`;
            document.querySelector(`#level${cardLevel}-${cardPosition}`).innerHTML = imgURL;
        });
    });
}
function refreshCardsDisplay(updated) {
    // if (updated === true) {
    //     const cardElement = document.querySelector(".card") as HTMLElement;
    //     console.log("updating opacity");
    //     cardElement.style.opacity = "1.0";
    // }
    dealCards();
}
dealButton.addEventListener('click', () => {
    refreshCardsDisplay(true);
});
