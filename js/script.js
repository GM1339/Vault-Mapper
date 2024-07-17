let grid = document.getElementById('grid');
let currentRoom = { x: 10, y: 10 }; // Starting room in the center for 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Starting position in the center
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
            grid.appendChild(cell);
        }
    }
    markRoom(currentRoom.x, currentRoom.y, 'portal');
    roomData[`${currentRoom.x},${currentRoom.y}`] = { type: 'portal', cleaned: false, goodToCollect: false, completed: false };
    setupCompletionToggle(); // Setup completion toggle checkbox
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
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', cleaned: false, goodToCollect: false, completed: false };
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
    updateCompletionStatus(playerPosition.x, playerPosition.y); // Update completion status
}

// Function to mark rooms
function markRoom(x, y, type) {
    let cell = getCellElement(x, y);
    if (cell) {
        cell.className = `grid-cell ${type}`;
        cell.style.visibility = 'visible';
    }
}

// Function to get grid cell element
function getCellElement(x, y) {
    return grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
}

// Function to mark player position
function markPlayerPosition(x, y) {
    let cell = getCellElement(x, y);
    if (cell) {
        cell.innerHTML = `<div class="player"></div>`;
        roomData[`${x},${y}`] = roomData[`${x},${y}`] || { type: 'normal', cleaned: false, goodToCollect: false, completed: false };
    }
}

// Setup completion toggle checkbox
function setupCompletionToggle() {
    let completionCheckbox = document.getElementById('completionCheckbox');
    completionCheckbox.addEventListener('change', function() {
        let roomDataKey = `${playerPosition.x},${playerPosition.y}`;
        roomData[roomDataKey].completed = this.checked;
        updateCompletionLabel(this.checked);
        markRoom(playerPosition.x, playerPosition.y, roomData[roomDataKey].type);
    });
}

// Update completion label based on checkbox state
function updateCompletionLabel(checked) {
    let completionLabel = document.getElementById('completionLabel');
    if (checked) {
        completionLabel.textContent = 'Completed';
        completionLabel.style.color = 'green';
    } else {
        completionLabel.textContent = 'Uncompleted';
        completionLabel.style.color = 'red';
    }
}

// Function to update completion status based on player position
function updateCompletionStatus(x, y) {
    let roomDataKey = `${x},${y}`;
    let completionCheckbox = document.getElementById('completionCheckbox');
    if (roomData[roomDataKey].completed) {
        completionCheckbox.checked = true;
        updateCompletionLabel(true);
    } else {
        completionCheckbox.checked = false;
        updateCompletionLabel(false);
    }
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
