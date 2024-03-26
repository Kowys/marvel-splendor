const newGameBtn = document.querySelector("#create-new-game");

newGameBtn!.addEventListener('click', () => {
    newGameState();
});

async function newGameState() {
    const newUrls = await generateNewGame();
    console.log(`New url 1: ${newUrls[0][0]}`)
    console.log(`Unique URLs: ${newUrls}`)

    for (var i = 1; i <= newUrls.length; i++) {
        var gameLink = document.getElementById(`new-game-link-player-${i}`);
        gameLink.setAttribute("href", `game/${newUrls[i-1][0]}`);
        gameLink.innerHTML = `Player ${newUrls[i-1][1]}`;
        gameLink.style.display = "inline-block";
    }
}

async function generateNewGame() {
    const response = await fetch('/new-game-state', {
        method: 'get'
    })
    const data = await response.json();
    return data.uniqueUrls;
}

