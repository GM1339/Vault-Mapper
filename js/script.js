let grid = document.getElementById('grid');
let currentRoom = { x: 5, y: 5 };
let playerPosition = { x: 5, y: 5 };
let roomData = {};
let vaultSize = 10;
let portalFacing = null;

// Initialize Grid
function initializeGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < vaultSize * vaultSize; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.innerHTML = `<span></span>`;
        grid.appendChild(cell);
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
}

// Function to mark rooms
function markRoom(x, y, type) {
    let index = y * vaultSize + x;
    let cell = grid.children[index];
    cell.className = `grid-cell ${type}`;
    cell.style.visibility = 'visible';
}

// Function to mark player position
function markPlayerPosition(x, y) {
    let index = y * vaultSize + x;
    let cell = grid.children[index];
    cell.innerHTML = `<div class="player"></div>`;
    roomData[`${x},${y}`] = roomData[`${x},${y}`] || { type: 'normal', cleaned: false, goodToCollect: false };
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
