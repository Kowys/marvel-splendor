import { Deck } from './deck.js';
import { Board } from './board.js';
import { Engine } from './engine.js';
const btnCounter = document.querySelector("#btncounter");
const dealButton = document.querySelector("#deal");
const startButton = document.querySelector("#start-game");
const pick3Button = document.querySelector("#pick-3");
const pick2Button = document.querySelector("#pick-2");
const reserveButton = document.querySelector("#reserve");
const pickCardButton = document.querySelector("#pick-card");
var counter = 0;
var pick3Select = false;
var pick2Select = false;
var reserveSelect = false;
var pickCardSelect = false;
const engine = new Engine();
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
startButton.addEventListener('click', () => {
    engine.startGame(1);
    document.getElementById("player-display").style.display = "block";
});
function updateActionButtonsAndForms(buttonName) {
    document.getElementById("pick-3").style.backgroundColor = null;
    document.getElementById("pick-2").style.backgroundColor = null;
    document.getElementById("reserve").style.backgroundColor = null;
    document.getElementById("pick-card").style.backgroundColor = null;
    document.getElementById("pick-3-options").style.display = null;
    document.getElementById("pick-2-options").style.display = null;
    document.getElementById("reserve-options").style.display = null;
    document.getElementById("pick-card-options").style.display = null;
    var reserveForm = document.getElementById("reserve-form");
    reserveForm.replaceWith(reserveForm.cloneNode(true));
    var pickCardForm = document.getElementById("pick-card-form");
    pickCardForm.replaceWith(pickCardForm.cloneNode(true));
    var cardContainerImgs = document.querySelectorAll('.card-container img');
    cardContainerImgs.forEach(cardImg => {
        cardImg.checked = false;
        cardImg.style.filter = null;
    });
    document.getElementById(`${buttonName}`).style.backgroundColor = "red";
}
function submitAction(actionName, actionVal) {
    const player = engine.getCurrentPlayer();
    try {
        const outcome = player.takeAction(actionName, actionVal);
        console.log(outcome);
    }
    catch (error) {
        alert(`${error.message}`);
    }
}
function addPick3Form() {
    document.getElementById("pick-3-options").style.display = "block";
    var pick3Form = document.getElementById("pick3-form");
    pick3Form.addEventListener("submit", (event) => {
        event.preventDefault();
        const pick3List = ["blue", "red", "yellow", "purple", "orange"];
        var pick3Selected = [];
        pick3List.forEach(color => {
            const pick3Present = document.getElementById(`pick3-${color}`).checked;
            if (pick3Present) {
                pick3Selected.push(color);
            }
        });
        submitAction("pick3", pick3Selected);
    });
}
function addPick2Form() {
    document.getElementById("pick-2-options").style.display = "block";
    var pick2Form = document.getElementById("pick2-form");
    pick2Form.addEventListener("submit", (event) => {
        event.preventDefault();
        const pick2List = ["blue", "red", "yellow", "purple", "orange"];
        var pick2Selected = [];
        pick2List.forEach(color => {
            const pick2Present = document.getElementById(`pick2-${color}`).checked;
            if (pick2Present) {
                pick2Selected.push(color);
            }
        });
        submitAction("pick2", pick2Selected);
    });
}
function addReserveForm() {
    document.getElementById("reserve-options").style.display = "block";
    var reserveForm = document.getElementById("reserve-form");
    reserveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        var reserveSelected = [];
        var reserveList = document.querySelectorAll('.card-container img');
        reserveList.forEach(reservedCard => {
            if (reservedCard.checked) {
                reserveSelected.push(reservedCard);
            }
        });
        submitAction("reserve", reserveSelected);
    });
}
function addPickCardForm() {
    document.getElementById("pick-card-options").style.display = "block";
    var pickCardForm = document.getElementById("pick-card-form");
    pickCardForm.addEventListener("submit", (event) => {
        event.preventDefault();
        var pickCardSelected = [];
        var pickCardList = document.querySelectorAll('.card-container img');
        pickCardList.forEach(pickCard => {
            if (pickCard.checked) {
                pickCardSelected.push(pickCard);
            }
        });
        submitAction("pick-card", pickCardSelected);
    });
}
pick3Button.addEventListener('click', () => {
    updateActionButtonsAndForms("pick-3");
    addPick3Form();
});
pick2Button.addEventListener('click', () => {
    updateActionButtonsAndForms("pick-2");
    addPick2Form();
});
reserveButton.addEventListener('click', () => {
    updateActionButtonsAndForms("reserve");
    addReserveForm();
});
pickCardButton.addEventListener('click', () => {
    updateActionButtonsAndForms("pick-card");
    addPickCardForm();
});
