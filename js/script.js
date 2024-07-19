let grid = document.getElementById('grid'); // Get the grid element
let currentRoom = { x: 10, y: 10 }; // Starting at the center for a 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Start player in the center initially
let roomData = {}; // Object to store room data
let vaultSize = 21; // Change grid size to 21x21
let portalFacing = null; // Variable to store the portal facing direction
let completedRooms = {}; // Object to store completed rooms

// Initialize Grid
function initializeGrid() {
    grid.innerHTML = ''; // Clear the grid content

    for (let y = 0; y < vaultSize; y++) {
        for (let x = 0; x < vaultSize; x++) {
            let cell = document.createElement('div'); // Create a new grid cell
            cell.className = 'grid-cell'; // Add grid-cell class
            cell.dataset.x = x; // Set x coordinate data attribute
            cell.dataset.y = y; // Set y coordinate data attribute
            cell.innerHTML = `<span></span>`; // Add a span inside the cell
            grid.appendChild(cell); // Append cell to the grid
        }
    }

    promptPortalFacing(); // Prompt user to set portal facing direction
}

// Reset Map
function resetMap() {
    currentRoom = { x: Math.floor(vaultSize / 2), y: Math.floor(vaultSize / 2) }; // Set current room to the center
    roomData = {}; // Reset room data
    completedRooms = {}; // Reset completed rooms
    initializeGrid(); // Reinitialize the grid
}

// Prompt user to set portal facing direction
function promptPortalFacing() {
    let direction = prompt("Enter portal facing direction (north, south, east, west):").toLowerCase(); // Get portal direction from user
    while (!['north', 'south', 'east', 'west'].includes(direction)) {
        direction = prompt("Invalid direction. Enter portal facing direction (north, south, east, west):").toLowerCase(); // Prompt again if invalid
    }
    portalFacing = direction; // Set portal facing direction
    setStartingRoom(direction); // Set the starting room based on the direction
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
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', discovered: true, completed: false }; // Mark room as discovered
    markRoom(startingRoom.x, startingRoom.y); // Mark the starting room
    markPlayerPosition(startingRoom.x, startingRoom.y); // Mark player position
    markPortalRoom(currentRoom.x, currentRoom.y, direction); // Mark portal room
}

// Function to toggle room completion status
function toggleCompletion() {
    let currentRoomKey = `${playerPosition.x},${playerPosition.y}`; // Get current room key
    let isChecked = document.getElementById('completion-checkbox').checked; // Get checkbox status
    roomData[currentRoomKey].completed = isChecked; // Update room completion status
    markRoom(playerPosition.x, playerPosition.y); // Mark room based on completion status
}

// Function to mark portal room
function markPortalRoom(x, y, direction) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`); // Get the cell element
    cell.classList.add('portal'); // Add portal class
    cell.classList.add(direction); // Add direction class
}

// Function to move in the grid
function move(direction) {
    let previousRoom = { ...playerPosition }; // Store previous room position
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
        roomData[`${playerPosition.x},${playerPosition.y}`] = { type: 'normal', discovered: true, completed: false }; // Mark new room as discovered
    }
    createCorridor(previousRoom, playerPosition); // Create corridor between previous and current room
    markRoom(playerPosition.x, playerPosition.y); // Mark current room
    markPlayerPosition(playerPosition.x, playerPosition.y); // Mark player position
}

// Function to mark rooms
function markRoom(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`); // Get the cell element
    cell.style.visibility = 'visible'; // Make cell visible
    cell.classList.add('discovered'); // Add discovered class
    if (roomData[`${x},${y}`].completed) {
        cell.classList.add('completed'); // Add completed class if room is completed
    } else {
        cell.classList.remove('completed'); // Remove completed class if room is not completed
    }
}

// Function to mark player position
function markPlayerPosition(x, y) {
    document.querySelectorAll('.player').forEach(player => player.remove()); // Remove previous player icons
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`); // Get the cell element
    cell.innerHTML = `<div class="player" style="border: 3px solid black;"></div>`; // Add player icon
}

// Function to create corridors
function createCorridor(start, end) {
    let corridor = document.createElement('div'); // Create a new corridor element
    corridor.className = 'corridor'; // Add corridor class

    if (start.x === end.x) {
        // Vertical corridor
        corridor.style.width = '15px'; // Corridor width
        corridor.style.height = '50px'; // Corridor height (adjust to the grid size)
        corridor.style.left = `${start.x * 35 + 10}px`; // Adjust left position
        corridor.style.top = `${Math.min(start.y, end.y) * 35 + 35}px`; // Adjust top position
    } else if (start.y === end.y) {
        // Horizontal corridor
        corridor.style.width = '50px'; // Corridor width (adjust to the grid size)
        corridor.style.height = '15px'; // Corridor height
        corridor.style.left = `${Math.min(start.x, end.x) * 35 + 35}px`; // Adjust left position
        corridor.style.top = `${start.y * 35 + 10}px`; // Adjust top position
    }

    grid.appendChild(corridor); // Append corridor to the grid
}

// Undo move
function undo() {
    // Your undo logic here
}

// Redo move
function redo() {
    // Your redo logic here
}

// Call the function to initialize the grid when the page loads
initializeGrid();
