let grid = document.getElementById('grid');

// Initialize the starting room at the center
let currentRoom = { x: 10, y: 10 };
let playerPosition = { x: 10, y: 10 };
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
    setStartingRoomAndPortalArea(direction);
}

// Set starting room and portal area based on portal facing direction
function setStartingRoomAndPortalArea(direction) {
    let portalArea;
    switch (direction) {
        case 'north':
            portalArea = { x: currentRoom.x, y: currentRoom.y + 1 };
            break;
        case 'south':
            portalArea = { x: currentRoom.x, y: currentRoom.y - 1 };
            break;
        case 'east':
            portalArea = { x: currentRoom.x - 1, y: currentRoom.y };
            break;
        case 'west':
            portalArea = { x: currentRoom.x + 1, y: currentRoom.y };
            break;
    }
    // Mark starting room and portal area
    playerPosition = { ...currentRoom };
    roomData[`${currentRoom.x},${currentRoom.y}`] = { type: 'normal', discovered: true, completed: false };
    roomData[`${portalArea.x},${portalArea.y}`] = { type: 'portal', discovered: true, completed: false };
    markRoom(currentRoom.x, currentRoom.y);
    markRoom(portalArea.x, portalArea.y, true); // Mark as portal area
    markPlayerPosition(currentRoom.x, currentRoom.y);
}

// Function to toggle room completion
function toggleCompletion() {
    let currentRoomKey = `${playerPosition.x},${playerPosition.y}`;
    let isChecked = document.getElementById('completion-checkbox').checked;
    if (roomData[currentRoomKey]) {
        roomData[currentRoomKey].completed = isChecked;
        markRoom(playerPosition.x, playerPosition.y);
    }
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

    if (!roomData[`${playerPosition.x},${playerPosition.y}`]?.discovered) {
        roomData[`${playerPosition.x},${playerPosition.y}`] = { type: 'normal', discovered: true, completed: false };
    }

    markRoom(playerPosition.x, playerPosition.y);
    markPlayerPosition(playerPosition.x, playerPosition.y);
}

// Function to mark rooms
function markRoom(x, y, isPortalArea = false) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.style.visibility = 'visible';
    cell.classList.add('discovered');
    if (isPortalArea) {
        cell.classList.add('portal-area');
    }
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
    cell.innerHTML = '<div class="player"></div>';
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
