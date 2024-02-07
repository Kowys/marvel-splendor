var btnCounter = document.querySelector("#btncounter");
var counter = 0;
updateDisplay(counter);
btnCounter.addEventListener('click', function () {
    counter += 1;
    console.log(counter);
    updateDisplay(counter);
});
function updateDisplay(c) {
    document.querySelector("#result").innerHTML = "Count: ".concat(c);
}
;
