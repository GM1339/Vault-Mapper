let grid = document.getElementById('grid');
let currentRoom = { x: 10, y: 10 }; // Starting position adjusted for 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Starting position adjusted for 21x21 grid
let roomData = {};
let vaultSize = 21; // Adjusted for 21x21 grid
let portalFacing = null;
let completionCheckbox = document.getElementById('completionCheckbox');

// Initialize Grid
function initializeGrid() {
    grid.innerHTML = '';
    for (let y = 0; y < vaultSize; y++) {
        for (let x = 0; x < vaultSize; x++) {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            grid.appendChild(cell);
        }
    }
    markRoom(currentRoom.x, currentRoom.y, 'portal');
    roomData[`${currentRoom.x},${currentRoom.y}`] = { type: 'portal', cleaned: false, goodToCollect: false };
}

// Reset Map
function resetMap() {
    currentRoom = { x: Math.floor(vaultSize / 2), y: Math.floor(vaultSize / 2) };
    playerPosition = { ...currentRoom };
    roomData = {};
    initializeGrid();
    promptPortalFacing();
}

// Prompt user to set portal facing direction
function promptPortalFacing() {
    let direction = prompt("Enter portal facing direction (north, south, east, west):").toLowerCase();
    while (!['north', 'south', 'east', 'west'].includes(direction)) {
        direction = prompt("Invalid direction. Enter portal facing direction (north, south, east, west):").toLowerCase();
    }
    portalFacing = direction;
    setStartingRoom(direction);
}

// Set starting room based on portal facing direction
function setStartingRoom(direction) {
    let startingRoom;
    switch (direction) {
        case 'north':
            startingRoom = { x: currentRoom.x, y: currentRoom.y - 1 };
            break;
        case 'south':
            startingRoom = { x: currentRoom.x, y: currentRoom.y + 1 };
            break;
        case 'east':
            startingRoom = { x: currentRoom.x + 1, y: currentRoom.y };
            break;
        case 'west':
            startingRoom = { x: currentRoom.x - 1, y: currentRoom.y };
            break;
    }
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', cleaned: false, goodToCollect: false };
    markRoom(startingRoom.x, startingRoom.y, 'current');
    markPlayerPosition(startingRoom.x, startingRoom.y);
}

// Function to move in the grid
function move(direction) {
    let previousRoom = { ...playerPosition };
    switch (direction) {
        case 'north':
            if (playerPosition.y > 0) playerPosition.y--;
            break;
        case 'south':
            if (playerPosition.y < vaultSize - 1) playerPosition.y++;
            break;
        case 'east':
            if (playerPosition.x < vaultSize - 1) playerPosition.x++;
            break;
        case 'west':
            if (playerPosition.x > 0) playerPosition.x--;
            break;
    }
    markRoom(previousRoom.x, previousRoom.y, roomData[`${previousRoom.x},${previousRoom.y}`]?.type || 'normal');
    markPlayerPosition(playerPosition.x, playerPosition.y);
    updateCompletionStatus(playerPosition.x, playerPosition.y);
}

// Function to update completion status of a room
function updateCompletionStatus(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (completionCheckbox.checked) {
        cell.classList.add('completed');
    } else {
        cell.classList.remove('completed');
    }
}

// Function to mark rooms
function markRoom(x, y, type) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.className = `grid-cell ${type}`;
    cell.style.visibility = 'visible';
}

// Function to mark player position
function markPlayerPosition(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    let playerDot = document.querySelector('.player');

    if (!playerDot) {
        playerDot = document.createElement('div');
        playerDot.className = 'player';
        grid.appendChild(playerDot);
    }

    let cellRect = cell.getBoundingClientRect();
    playerDot.style.top = `${cellRect.top}px`;
    playerDot.style.left = `${cellRect.left}px`;

    playerPosition.x = x;
    playerPosition.y = y;
}

// Initialize the map on load
resetMap();

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['w', 'arrowup'].includes(key)) move('north');
    if (['a', 'arrowleft'].includes(key)) move('west');
    if (['s', 'arrowdown'].includes(key)) move('south');
    if (['d', 'arrowright'].includes(key)) move('east');
});

// Toggle completion status label
function toggleCompletion() {
    let label = document.getElementById('completionLabel');
    if (completionCheckbox.checked) {
        label.textContent = 'Completed';
        label.style.color = 'green';
    } else {
        label.textContent = 'Uncompleted';
        label.style.color = 'red';
    }
}
