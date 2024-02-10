const btnCounter = document.querySelector("#btncounter");
const dealCards = document.querySelector("#deal");
let counter = 0;

updateDisplay(counter);

// document.querySelector("#level")!.innerHTML = `abc`;

function updateDisplay(c) {
    document.querySelector("#result")!.innerHTML = `Count: ${c}`;
};

btnCounter!.addEventListener('click', () => {
    counter += 1;
    console.log(counter);
    updateDisplay(counter);
});

dealCards!.addEventListener('click', () => {
    console.log("Card dealt!");
    const imgURL = `<img src="./images/cards/captain-america.jpg" alt="Level 3 card" width="200", height="auto"/>`
    document.querySelector("#level3-1")!.innerHTML = imgURL;
});