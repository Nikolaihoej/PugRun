const character = document.getElementById("character");
const block = document.getElementById("block");
const scoreDisplay = document.getElementById('scoreboard');
const backgrounds = ['assest/Desert.gif', 'assest/Road.gif'];
const obstacles = ['assest/tumbleweed.png', 'assest/wheel.png'];
let score = 0;
let blockPassed = false;

// hoppe funktion
function jump() {
    if(!character.classList.contains("animate")) {
        character.classList.add("animate");
    }
    setTimeout(() => character.classList.remove("animate"), 500); // fjerner animationen efter 500ms
}

// hvis der bliver trykket på spacebar skal den køre jump funktionen
document.addEventListener('keydown', event => {
    if(event.code === 'Space') {
        jump();
    }
});

// checker om navnet er valid og er en string og ikke indeholder tal via regex
function isValidName(name) {
    return typeof name === 'string' && name.trim() !== '' && !/\d/.test(name);
}

// start game funktion
function startGame() {
    score = 0;
    blockPassed = false;
    block.style.animation = "block rotation 2.5s infinite linear";

    // får 'top' position fra css
    function getCharacterTop() {
        return parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    }

    // får 'left' position fra css
    function getBlockLeft() {
        return parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    }

    // Tjekker om spillet er over
    function isGameOver(characterTop, blockLeft) {
        return blockLeft < 85 && blockLeft > 0 && characterTop >= 130;
    }

    // Håndterer spillets slutning
    function handleGameOver() {
        alert("Game Over.");
        const name = prompt("Enter your name");
        if (isValidName(name)) {
            saveScore(name);
        } else {
            alert('Invalid name. Please enter a name without numbers or an empty input field to participate in the highscores.');
        }
        clearInterval(gameLoop);
        startGame();
    }

    // gemmer spillerens score i localstorage
    function saveScore(name) {
        const scores = JSON.parse(localStorage.getItem('scores')) || []; // henter en JSON string og parser den til et arrey
        scores.push({ name: name, score: score });
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 10) scores.length = 10; // tjekker og gemmer kun 10 highscores
        localStorage.setItem('scores', JSON.stringify(scores)); // Gemmer highscores i localstorage
    }

    // Tjekker om blokken er passeret
    function checkBlockPassed(blockLeft) {
        if(blockLeft <= 0) {
            blockPassed = true;
        }
    }

    // Tilføjer point til scoren hvis blokken er passeret
    function addPoints(blockLeft) {
        if(blockLeft > 0 && blockPassed) {
            score += 10;
            blockPassed = false; // Sætter blockPassed til false så der ikke tilføjes point flere gange
            scoreDisplay.textContent = 'Score: ' + score;
        }
    }

    // Skifter baggrund og forhindring efter scoren er nået 50 point
    function changeBackgroundAndObstacle() {
        if(score >= 50) {
            const backgroundIndex = Math.floor(score / 50); 
            if(backgroundIndex < backgrounds.length) {
                document.getElementById('game').style.backgroundImage = 'url(' + backgrounds[backgroundIndex] + ')';
                block.style.backgroundImage = 'url(' + obstacles[backgroundIndex] + ')';
                block.style.animation = 'block 1.5s infinite linear, rotation 0.3s infinite linear';
            }
        }
    }

    // Viser highscores i en liste på siden fra localstorage og sorterer dem efter score
    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem('scores')) || [];
        highScores.sort((a, b) => b.score - a.score);
        const highScoresContainer = document.querySelector('.highScoreList');
        highScoresContainer.innerHTML = '';
        highScores.forEach((score, i) => {
            highScoresContainer.innerHTML += `<li>${i + 1}. ${score.name}: ${score.score}</li>`;
        });
    }

    // Main game loop
    const gameLoop = setInterval(() => {
        const characterTop = getCharacterTop(); // Får karakterens position
        const blockLeft = getBlockLeft(); // Får blokkens position

        if(isGameOver(characterTop, blockLeft)) { // Tjekker om spillet er over
            handleGameOver(); // Håndterer spillets slutning
        }

        checkBlockPassed(blockLeft); // Tjekker om blokken er passeret
        addPoints(blockLeft); // Tilføjer point hvis blokken er passeret
        changeBackgroundAndObstacle(); // Skifter baggrund og forhindring
        displayHighScores(); // Opdaterer highscores
    }, 10); // 10ms delay for at tjek spillet oftere og gøre det mere præcist
}

startGame();