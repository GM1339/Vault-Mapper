let grid = document.getElementById('grid');
let currentRoom = { x: 10, y: 10 }; // Starting at the center for a 21x21 grid
let playerPosition = { ...currentRoom }; // Start player at the center
let roomData = {};
let vaultSize = 21; // Change grid size to 21x21
let portalFacing = null;
let completedRooms = {};

// Initialize Grid
function initializeGrid() {
	@@ -15,20 +14,21 @@ function initializeGrid() {
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerHTML = `<span></span>`;
            grid.appendChild(cell);
        }
    }
    promptPortalFacing();
}

// Reset Map
function resetMap() {
    currentRoom = { x: Math.floor(vaultSize / 2), y: Math.floor(vaultSize / 2) };
    playerPosition = { ...currentRoom };
    roomData = {};
    completedRooms = {};
    initializeGrid();
}

// Prompt user to set portal facing direction
	@@ -58,8 +58,8 @@ function setStartingRoom(direction) {
            startingRoom = { x: currentRoom.x - 1, y: currentRoom.y };
            break;
    }
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', discovered: true, completed: false };
    markRoom(startingRoom.x, startingRoom.y);
    markPlayerPosition(startingRoom.x, startingRoom.y);
}

	@@ -71,74 +71,3 @@ function move(direction) {
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
    markRoom(previousRoom.x, previousRoom.y);
    markPlayerPosition(playerPosition.x, playerPosition.y);
    updateCompletion();
}

// Function to mark rooms
function markRoom(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.style.visibility = 'visible';
    cell.classList.add('discovered');
    if (completedRooms[`${x},${y}`]) {
        cell.classList.add('completed');
    }
}

// Function to mark player position
function markPlayerPosition(x, y) {
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.innerHTML = `<div class="player"></div>`;
}

// Undo move
function undo() {
    // Implement your undo logic here
}

// Redo move
function redo() {
    // Implement your redo logic here
}

// Update room completion status
function updateCompletion() {
    let cell = grid.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completedRooms[`${playerPosition.x},${playerPosition.y}`];
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            completedRooms[`${playerPosition.x},${playerPosition.y}`] = true;
            cell.classList.add('completed');
        } else {
            completedRooms[`${playerPosition.x},${playerPosition.y}`] = false;
            cell.classList.remove('completed');
        }
    });
    cell.appendChild(checkbox);
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