const newGameBtn = document.querySelector("#create-new-game");

newGameBtn!.addEventListener('click', () => {
    updateWithUniqueId();
});

async function updateWithUniqueId() {
    const newId = await generateUniqueId();
    console.log(`Unique id: ${newId}`)
    var gameLink = document.getElementById("new-game-link");
    gameLink.setAttribute("href", `game/${newId}`);
    gameLink.innerHTML = `Player 1`;
    gameLink.style.display = "inline-block";
}

async function generateUniqueId() {
    const response = await fetch('/generate-id', {
        method: 'get'
    })
    const data = await response.json();
    return data.uniqueId;
}

