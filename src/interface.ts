import {Engine} from './engine.js'

const btnCounter = document.querySelector("#btncounter");
const permCounter = document.querySelector("#permcounter");

const startButton = document.querySelector("#start-game");

const pick3Button = document.querySelector("#pick-3-button");
const pick2Button = document.querySelector("#pick-2-button");
const reserveButton = document.querySelector("#reserve-button");
const pickCardButton = document.querySelector("#pick-card-button");

var counter = 0;

const engine = new Engine();

updateDisplay(counter);

async function getPermCount() {
    const response = await fetch('/game/get-counter', {
        method: 'get'
    })
    const data = await response.json();
    return data.count;
}

async function incrementPermCount(i: number) {
    await fetch('/game/increment-counter', {
        method: 'post',
        body: JSON.stringify({
            increment: i,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
}

async function updateDisplay(c) {
    document.querySelector("#counter-value")!.innerHTML = `Count: ${c}`;

    // var permCounter = await getPermCount();
    // document.querySelector("#permanent-counter-value")!.innerHTML = `Perm count: ${permCounter}`;
};


async function incrementAndUpdateDisplay(i) {
    await incrementPermCount(i);
    await updateDisplay(counter);
}

btnCounter!.addEventListener('click', () => {
    counter += 3;
    console.log(counter);
    updateDisplay(counter);
});

permCounter!.addEventListener('click', () => {
    // incrementAndUpdateDisplay(2);
});

startButton!.addEventListener('click', () => {
    engine.startGame(1);
});

function submitAction(actionName: string, actionVal: string[]) {
    const player = engine.getCurrentPlayer();
    try {
        const outcome = player.takeAction(actionName, actionVal);
        engine.nextPlayerTurn();
    } catch (error) {
        alert(`${error.message}`);
    }
}

function addPick3Form() {         
    document.getElementById("pick-3-options").style.display = "block";

    var pick3Form = document.getElementById("pick3-form")
    pick3Form.addEventListener("submit", (event) => {
        event.preventDefault();
        const pick3List = ["blue", "red", "yellow", "purple", "orange"];
        var pick3Selected = [];
        pick3List.forEach(color => {
            const pick3Present = (<HTMLInputElement>document.getElementById(`pick3-${color}`)).checked;
            if (pick3Present) {
                pick3Selected.push(color)
            }
        });

        submitAction("pick3", pick3Selected);
    });
}

function addPick2Form() {
    document.getElementById("pick-2-options").style.display = "block";

    var pick2Form = document.getElementById("pick2-form")
    pick2Form.addEventListener("submit", (event) => {
        event.preventDefault();
        const pick2List = ["blue", "red", "yellow", "purple", "orange"];
        var pick2Selected = [];
        pick2List.forEach(color => {
            const pick2Present = (<HTMLInputElement>document.getElementById(`pick2-${color}`)).checked;
            if (pick2Present) {
                pick2Selected.push(color)
            }
        });

        submitAction("pick2", pick2Selected);
    });
}

function addReserveForm() {
    document.getElementById("reserve-options").style.display = "block";

    var reserveForm = document.getElementById("reserve-form")
    reserveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        var reserveSelected = [];
        var reserveList = document.querySelectorAll('.card-container img') as NodeListOf<HTMLInputElement>;
        reserveList.forEach(reservedCard => {
            if (reservedCard.checked) {
                reserveSelected.push(reservedCard.id)
            }
        });

        submitAction("reserve", reserveSelected);
    });
}

function addPickCardForm() {
    document.getElementById("pick-card-options").style.display = "block";

    var pickCardForm = document.getElementById("pick-card-form")
    pickCardForm.addEventListener("submit", (event) => {
        event.preventDefault();

        var pickCardSelected = [];
        var pickCardList = document.querySelectorAll('.card-container img') as NodeListOf<HTMLInputElement>;
        pickCardList.forEach(pickedCard => {
            if (pickedCard.checked) {
                pickCardSelected.push(pickedCard.id)
            }
        });

        submitAction("pick-card", pickCardSelected);
    });
}

pick3Button!.addEventListener('click', () => {
    engine.resetActionButtonsAndForms();
    document.getElementById("pick-3-button").style.backgroundColor = "red";
    addPick3Form();
});

pick2Button!.addEventListener('click', () => {
    engine.resetActionButtonsAndForms();
    document.getElementById("pick-2-button").style.backgroundColor = "red";
    addPick2Form();
});

reserveButton!.addEventListener('click', () => {
    engine.resetActionButtonsAndForms();
    document.getElementById("reserve-button").style.backgroundColor = "red";
    addReserveForm();
});

pickCardButton!.addEventListener('click', () => {
    engine.resetActionButtonsAndForms();
    document.getElementById("pick-card-button").style.backgroundColor = "red";
    addPickCardForm();
});

