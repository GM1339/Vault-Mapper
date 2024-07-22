let grid = document.getElementById('grid');

let currentRoom = { x: 10, y: 10 }; // Starting at the center for a 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Start player in the center initially
let roomData = {};
let vaultSize = 21; // Change grid size to 21x21
let portalFacing = null;
let completedRooms = {};

// Initialize Grid
function initializeGrid() {
    grid.innerHTML = '';
    for (let y = 0; y < vaultSize; y++) {
        for (let x = 0; x < vaultSize; x++) {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerHTML = '<span></span>';
            grid.appendChild(cell);
        }
    }
    promptPortalFacing();
}

// Reset Map
function resetMap() {
    currentRoom = { x: Math.floor(vaultSize / 2), y: Math.floor(vaultSize / 2) };
    roomData = {};
    completedRooms = {};
    initializeGrid();
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
    playerPosition = { ...startingRoom }; // Set player position to the starting room
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', discovered: true, completed: false };
    markRoom(startingRoom.x, startingRoom.y);
    markPlayerPosition(startingRoom.x, startingRoom.y);
    markPortalRoom(currentRoom.x, currentRoom.y, direction);
}

// Function to toggle room completion status
function toggleCompletion() {
    let currentRoomKey = `${playerPosition.x},${playerPosition.y}`;
    if (roomData[currentRoomKey]) {
        roomData[currentRoomKey].completed = !roomData[currentRoomKey].completed; // Toggle completion status
        markRoom(playerPosition.x, playerPosition.y);
    }
}


// Function to mark portal room
function markPortalRoom(x, y, direction) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('portal');

    let oppositeDirection;
    switch (direction) {
        case 'north':
            oppositeDirection = 'south';
            break;
        case 'south':
            oppositeDirection = 'north';
            break;
        case 'east':
            oppositeDirection = 'west';
            break;
        case 'west':
            oppositeDirection = 'east';
            break;
    }

    let line = document.createElement('div');
    line.classList.add('portal-line', oppositeDirection);
    cell.appendChild(line);
}

// Function to move in the grid
function move(direction) {
    let previousRoom = { ...playerPosition };

    switch (direction) {
        case 'north':
            if (playerPosition.y > 0 && !(playerPosition.x === currentRoom.x && playerPosition.y - 1 === currentRoom.y)) playerPosition.y--;
            break;
        case 'south':
            if (playerPosition.y < vaultSize - 1 && !(playerPosition.x === currentRoom.x && playerPosition.y + 1 === currentRoom.y)) playerPosition.y++;
            break;
        case 'east':
            if (playerPosition.x < vaultSize - 1 && !(playerPosition.x + 1 === currentRoom.x && playerPosition.y === currentRoom.y)) playerPosition.x++;
            break;
        case 'west':
            if (playerPosition.x > 0 && !(playerPosition.x - 1 === currentRoom.x && playerPosition.y === currentRoom.y)) playerPosition.x--;
            break;
    }

    if (!roomData[`${playerPosition.x},${playerPosition.y}`]?.discovered) {
        roomData[`${playerPosition.x},${playerPosition.y}`] = { type: 'normal', discovered: true, completed: false };
    }

    markRoom(playerPosition.x, playerPosition.y);
    markPlayerPosition(playerPosition.x, playerPosition.y);
}

// Function to mark rooms
function markRoom(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.style.visibility = 'visible';
    cell.classList.add('discovered');
    if (roomData[`${x},${y}`].completed) {
        cell.classList.add('completed');
    } else {
        cell.classList.remove('completed');
    }
}

// Function to mark player position
function markPlayerPosition(x, y) {
    document.querySelectorAll('.player').forEach(player => player.remove()); // Remove previous player icons
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.innerHTML = '<div class="player" style="border: 3px solid black;"></div>';
}

// Undo move
function undo() {
    // Implement your undo logic here
}

// Redo move
function redo() {
    // Implement your redo logic here
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
