let grid = document.getElementById('grid');
let currentRoom = { x: 10, y: 10 }; // Starting position adjusted for 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Starting position adjusted for 21x21 grid
let roomData = {};
let vaultSize = 21; // Adjusted for 21x21 grid
let portalFacing = null;

// Initialize Grid
function initializeGrid() {
    grid.innerHTML = '';
    for (let y = 0; y < vaultSize; y++) {
        for (let x = 0; x < vaultSize; x++) {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerHTML = `<input type="checkbox" id="room${x}-${y}"><label for="room${x}-${y}"></label>`;
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
