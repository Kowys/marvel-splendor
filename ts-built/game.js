var btnCounter = document.querySelector("#btncounter");
var counter = 0;
updateDisplay(counter);
btnCounter.addEventListener('click', function () {
    counter += 2;
    console.log(counter);
    updateDisplay(counter);
});
function updateDisplay(c) {
    document.querySelector("#result").innerHTML = "Count: ".concat(c);
}
;
