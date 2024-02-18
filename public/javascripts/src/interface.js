import { Deck } from './deck.js';
import { Board } from './board.js';
const btnCounter = document.querySelector("#btncounter");
const dealButton = document.querySelector("#deal");
const pick3Button = document.querySelector("#pick-3");
const pick2Button = document.querySelector("#pick-2");
const reserveButton = document.querySelector("#reserve");
const pickCardButton = document.querySelector("#pick-card");
var counter = 0;
var pick3Select = false;
var pick2Select = false;
var reserveSelect = false;
var pickCardSelect = false;
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
dealButton.addEventListener('click', () => {
    dealCards();
});
function updateActionButtons(buttonName) {
    document.getElementById("pick-3").style.backgroundColor = null;
    document.getElementById("pick-2").style.backgroundColor = null;
    document.getElementById("reserve").style.backgroundColor = null;
    document.getElementById("pick-card").style.backgroundColor = null;
    document.getElementById(`${buttonName}`).style.backgroundColor = "red";
}
function addConfirmButton() {
    document.querySelector("#confirm-button-div").innerHTML = `<button id="confirm-button">Confirm</button>`;
}
pick3Button.addEventListener('click', () => {
    pick3Select = true;
    pick2Select = false;
    reserveSelect = false;
    pickCardSelect = false;
    updateActionButtons("pick-3");
    addConfirmButton();
});
pick2Button.addEventListener('click', () => {
    pick3Select = false;
    pick2Select = true;
    reserveSelect = false;
    pickCardSelect = false;
    updateActionButtons("pick-2");
    addConfirmButton();
});
reserveButton.addEventListener('click', () => {
    pick3Select = false;
    pick2Select = false;
    reserveSelect = true;
    pickCardSelect = false;
    updateActionButtons("reserve");
    addConfirmButton();
});
pickCardButton.addEventListener('click', () => {
    pick3Select = false;
    pick2Select = false;
    reserveSelect = false;
    pickCardSelect = true;
    updateActionButtons("pick-card");
    addConfirmButton();
});
