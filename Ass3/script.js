const puzzleContainer = document.getElementById('puzzleContainer');
const startBtn = document.getElementById('startBtn');
const moveCountElem = document.getElementById('moveCount');
const timeElapsedElem = document.getElementById('timeElapsed');
const imageUpload = document.getElementById('imageUpload');

const gridSize = 3;
const defaultImageSrc = 'https://picsum.photos/300';
let customImage = null;
let tiles = [];
let moveCount = 0;
let draggedTile = null;

let startTime=null;
let timerInterval=null;

// Event listeners
startBtn.addEventListener('click', startGame);
imageUpload.addEventListener('change', handleImageUpload);

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        customImage = e.target.result;
        startGame();
    };
    reader.readAsDataURL(file);
}

// Start or reset the game
function startGame() {
    puzzleContainer.innerHTML = '';
    tiles = [];
    moveCount = 0;
    moveCountElem.textContent = moveCount;

    clearInterval(timerInterval);
    timeElapsedElem.textContent = '0';
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    const imageToUse = customImage || defaultImageSrc;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = index;
            tile.style.backgroundImage = `url(${imageToUse})`;
            tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            tile.draggable = true;

            tile.addEventListener('dragstart', dragStart);
            tile.addEventListener('dragover', dragOver);
            tile.addEventListener('drop', dropTile);

            tiles.push(tile);
        }
    }

    shuffleArray(tiles);
    tiles.forEach(tile => puzzleContainer.appendChild(tile));
}

// Timer update function
function updateTimer() {
    const secondsPassed = Math.floor((Date.now() - startTime) / 1000);
    timeElapsedElem.textContent = secondsPassed;
}

// Drag & Drop handlers
function dragStart(e) {
    draggedTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dropTile(e) {
    if (this === draggedTile) return;

    const draggedIndex = tiles.indexOf(draggedTile);
    const targetIndex = tiles.indexOf(this);

    puzzleContainer.insertBefore(draggedTile, tiles[targetIndex]);
    if (targetIndex < draggedIndex) {
        puzzleContainer.insertBefore(this, tiles[draggedIndex + 1]);
    } else {
        puzzleContainer.insertBefore(this, tiles[draggedIndex]);
    }

    // Swap
    [tiles[draggedIndex], tiles[targetIndex]] = [tiles[targetIndex], tiles[draggedIndex]];

    moveCount++;
    moveCountElem.textContent = moveCount;
    checkWin();
}

// Check if puzzle is solved
function checkWin() {
    const isSolved = tiles.every((tile, i) => parseInt(tile.dataset.index) === i);
    if (isSolved) {
        clearInterval(timerInterval); // stop timer
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        setTimeout(() => {
            alert(`Congratulations! You solved the puzzle in ${moveCount} moves and ${timeTaken} seconds!`);
        }, 100);
    }
}


// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
