let grid = document.getElementById('grid');
let currentRoom = { x: 5, y: 5 };
let roomData = {};
let vaultSize = 10;

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
    roomData = {};
    initializeGrid();
}

// Function to move in the grid
function move(direction) {
    let previousRoom = { ...currentRoom };
    switch (direction) {
        case 'north':
            if (currentRoom.y > 0) currentRoom.y--;
            break;
        case 'south':
            if (currentRoom.y < vaultSize - 1) currentRoom.y++;
            break;
        case 'east':
            if (currentRoom.x < vaultSize - 1) currentRoom.x++;
            break;
        case 'west':
            if (currentRoom.x > 0) currentRoom.x--;
            break;
    }
    markRoom(previousRoom.x, previousRoom.y, roomData[`${previousRoom.x},${previousRoom.y}`]?.type || 'normal');
    markRoom(currentRoom.x, currentRoom.y, 'current');
}

// Function to mark rooms
function markRoom(x, y, type) {
    let index = y * vaultSize + x;
    let cell = grid.children[index];
    cell.className = `grid-cell ${type}`;
}

// Function to update room details
function updateRoomDetails() {
    let roomColor = document.getElementById('room-color').value;
    let roomName = document.getElementById('room-name').value;
    let index = currentRoom.y * vaultSize + currentRoom.x;
    let cell = grid.children[index];
    cell.style.backgroundColor = roomColor;
    cell.innerHTML = `<span>${roomName}</span>`;
    roomData[`${currentRoom.x},${currentRoom.y}`] = { type: roomColor, name: roomName, cleaned: false, goodToCollect: false };
}

// Toggle cleaned room
function toggleCleanedRoom() {
    let index = currentRoom.y * vaultSize + currentRoom.x;
    let cell = grid.children[index];
    roomData[`${currentRoom.x},${currentRoom.y}`].cleaned = !roomData[`${currentRoom.x},${currentRoom.y}`].cleaned;
    cell.classList.toggle('cleaned', roomData[`${currentRoom.x},${currentRoom.y}`].cleaned);
}

// Toggle good to collect room
function toggleGoodToCollect() {
    let index = currentRoom.y * vaultSize + currentRoom.x;
    let cell = grid.children[index];
    roomData[`${currentRoom.x},${currentRoom.y}`].goodToCollect = !roomData[`${currentRoom.x},${currentRoom.y}`].goodToCollect;
    cell.classList.toggle('good-to-collect', roomData[`${currentRoom.x},${currentRoom.y}`].goodToCollect);
}

// Initialize the map on load
resetMap();
