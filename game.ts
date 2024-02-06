const btnCounter = document.querySelector("#btncounter");
let counter = 0;

updateDisplay(counter);

btnCounter!.addEventListener('click', () => {
    counter += 1;
    console.log(counter);
    updateDisplay(counter);
});


function updateDisplay(c) {
    document.querySelector("#result")!.innerHTML = `Count: ${c}`;
};