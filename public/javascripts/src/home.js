const newGameBtn = document.querySelector("#create-new-game");
newGameBtn.addEventListener('click', () => {
    newGameState();
});
async function newGameState() {
    const newUrls = await generateNewGame();
    console.log(`Unique URLs: ${newUrls}`);
    var gameLink = document.getElementById("new-game-link");
    gameLink.setAttribute("href", `game/${newUrls}`);
    gameLink.innerHTML = `Player 1`;
    gameLink.style.display = "inline-block";
}
async function generateNewGame() {
    const response = await fetch('/new-game-state', {
        method: 'get'
    });
    const data = await response.json();
    return data.uniqueUrls;
}
