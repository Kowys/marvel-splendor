var btnCounter = document.querySelector("#btncounter");
var dealCards = document.querySelector("#deal");
var counter = 0;
updateDisplay(counter);
// document.querySelector("#level")!.innerHTML = `abc`;
function updateDisplay(c) {
    document.querySelector("#result").innerHTML = "Count: ".concat(c);
}
;
btnCounter.addEventListener('click', function () {
    counter += 1;
    console.log(counter);
    updateDisplay(counter);
});
dealCards.addEventListener('click', function () {
    console.log("Card dealt!");
    var imgURL = "<img src=\"./images/cards/captain-america.jpg\" alt=\"Level 3 card\" width=\"200\", height=\"auto\"/>";
    document.querySelector("#level3-1").innerHTML = imgURL;
});
