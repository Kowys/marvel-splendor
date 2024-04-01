import {Engine} from './engine.js'

const btnCounter = document.querySelector("#btncounter");
const permCounter = document.querySelector("#permcounter");

const pick3Button = document.querySelector("#pick-3-button");
const pick2Button = document.querySelector("#pick-2-button");
const reserveButton = document.querySelector("#reserve-button");
const pickCardButton = document.querySelector("#pick-card-button");

var pick2Form = document.getElementById("pick2-form")
var pick3Form = document.getElementById("pick3-form")
var reserveForm = document.getElementById("reserve-form")
var pickCardForm = document.getElementById("pick-card-form")

const engine = new Engine();
engine.setupGame(window.location.pathname, true);

const evtSource = new EventSource(`${window.location.origin}/events`);

evtSource.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);

    engine.setupGame(window.location.pathname, false);

    console.log(`Server sent data: ${parsedData}`);
};

var counter = 0;

displayUniqueId();

updateDisplay(counter);

function displayUniqueId() {
    const currentUrl = window.location.pathname;
    document.querySelector("#unique-id")!.innerHTML = `Unique Id: ${currentUrl}`;
}

async function getPermCount() {
    const response = await fetch('/get-counter', {
        method: 'get'
    })
    const data = await response.json();
    return data.count;
}

async function incrementPermCountPost(i: number) {
    await fetch('/increment-counter', {
        method: 'post',
        body: JSON.stringify({
            increment: i,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
}

async function incrementPermCountGet(i: number) {
    var params = new URLSearchParams({
        inc: i.toString(),
    });
    await fetch('/increment-counter?' + params, {
        method: 'get',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
}

async function updateDisplay(c) {
    document.querySelector("#counter-value")!.innerHTML = `Count: ${c}`;

    var permCounter = await getPermCount();
    document.querySelector("#permanent-counter-value")!.innerHTML = `Perm count: ${permCounter}`;
};


async function incrementAndUpdateDisplay(i) {
    await incrementPermCountGet(i);
    await updateDisplay(counter);
}

btnCounter!.addEventListener('click', () => {
    counter += 3;
    console.log(counter);
    updateDisplay(counter);
});

permCounter!.addEventListener('click', () => {
    incrementAndUpdateDisplay(2);
});

function submitAction(actionName: string, actionVal: string[]) {
    try {
        const player = engine.getPlayer();
        player.takeAction(actionName, actionVal);
    } catch (error) {
        alert(`${error.message}`);
    }
}

function addPick3Form() {         
    document.getElementById("pick-3-options").style.display = "block";
}

function addPick2Form() {
    document.getElementById("pick-2-options").style.display = "block";
}

function addReserveForm() {
    document.getElementById("reserve-options").style.display = "block";
}

function addPickCardForm() {
    document.getElementById("pick-card-options").style.display = "block";
}

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

