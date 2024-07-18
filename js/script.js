        for (let x = 0; x < vaultSize; x++) {

            let cell = document.createElement('div');

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

    roomData = {};

    completedRooms = {};

    initializeGrid();

}
	@@ -69,15 +58,11 @@ function promptPortalFacing() {
    let direction = prompt("Enter portal facing direction (north, south, east, west):").toLowerCase();

    while (!['north', 'south', 'east', 'west'].includes(direction)) {

        direction = prompt("Invalid direction. Enter portal facing direction (north, south, east, west):").toLowerCase();

    }

    portalFacing = direction;

    setStartingRoom(direction);

}


	@@ -89,33 +74,29 @@
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
	@@ -141,11 +122,8 @@ function toggleCompletion() {
// Function to mark portal room

function markPortalRoom(x, y, direction) {

    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);

    cell.classList.add('portal');

    cell.classList.add(direction);

}
	@@ -161,27 +139,19 @@ function move(direction) {
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
	@@ -247,29 +217,23 @@ function redo() {
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
