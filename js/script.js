let grid = document.getElementById('grid');

let currentRoom = { x: 10, y: 10 }; // Starting at the center for a 21x21 grid
let playerPosition = { x: 10, y: 10 }; // Chooses where the Player icon starts at
let roomData = {};
let vaultSize = 21; // Change grid size to 21x21
let portalFacing = null;
let completedRooms = {};
//Not sure what the "let" does, probably used to initialize variables


// Initialize Grid
function initializeGrid() {
    grid.innerHTML = '';
    for (let y = 0; y < vaultSize; y++) 
    {
        for (let x = 0; x < vaultSize; x++) 
        {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.innerHTML = '<span></span>';
            grid.appendChild(cell);
        }
    }
    promptPortalFacing(); //Calls the function that asks the user which way the Portal faces in-game
}

// Reset Map
function resetMap() 
{
    currentRoom = { x: Math.floor(vaultSize / 2), y: Math.floor(vaultSize / 2) };
    roomData = {};
    completedRooms = {};
    initializeGrid();
}

// Prompt user to set portal facing direction
function promptPortalFacing() 
{
    let direction = prompt("Enter portal facing direction (north, south, east, west):").toLowerCase();
    while (!['north', 'south', 'east', 'west'].includes(direction)) {
        direction = prompt("Invalid direction. Enter portal facing direction (north, south, east, west):").toLowerCase();
    }
    portalFacing = direction; //Not sure if portalFacing is a useful variable or if it can be optimized out
    setStartingRoom(direction); //Set which room is the Starting Room based on the direction the portal faces
    
    updatePortalSquares(direction); /* Is meant to make the portal icon (currently a red square) that is opposite to the direction 
                                        that the portal is facing appear. It does not work and I'm not sure why */
}

// Set starting room based on portal facing direction
function setStartingRoom(direction) 
{
    let startingRoom;
    switch (direction) 
    {
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
    roomData[`${startingRoom.x},${startingRoom.y}`] = { type: 'normal', discovered: true, completed: false }; //Set the status of Starting Room
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
function markPortalRoom(x, y, direction) { //Not sure what these lines do, actually
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`); 
    cell.classList.add('portal');
    cell.classList.add(direction);
}

// Function to move in the grid
function move(direction) 
{
    let previousRoom = { ...playerPosition };

    switch (direction) 
    {
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
function markRoom(x, y) 
{
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
function markPlayerPosition(x, y) 
{
    document.querySelectorAll('.player').forEach(player => player.remove()); // Remove previous player icons
    let cell = grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.innerHTML = '<div class="player" style="border: 3px solid black;"></div>';
}


/* Makes the portal icon with the correct cardinal direction appear. This causes the correct square to appear, but they are all
in the same location, and not positioned correctly */
function updatePortalSquares(direction) {
    const portalRoom = document.querySelector('.portal-room');
    const northSquare = portalRoom.querySelector('.portal-square.north');
    const southSquare = portalRoom.querySelector('.portal-square.south');
    const westSquare = portalRoom.querySelector('.portal-square.west');
    const eastSquare = portalRoom.querySelector('.portal-square.east');

    // Hide all squares initially
    northSquare.style.display = 'none';
    southSquare.style.display = 'none';
    westSquare.style.display = 'none';
    eastSquare.style.display = 'none';

    // Show the square opposite the portal direction
    switch (direction) 
    {
        case 'north':
            southSquare.style.display = 'block';
            break;
            
        case 'south':
            northSquare.style.display = 'block';
            break;
            
        case 'west':
            eastSquare.style.display = 'block';
            break;
            
        case 'east':
            westSquare.style.display = 'block';
            break;
            
        default:
            break;
    }
}





/* Blank functions I want to eventualy add logic to. The goal is for these to be able to undo any action the user takes
including button presses, moving, marking a room as complete/incomplete, or any other actions I add in the future. Not sure if
possible, but would be a good feature to have */
function undo() {
    // No logic as of right now
}
function redo() {
    // No logic as of right now
}


// Initialize the map on load
resetMap();

document.addEventListener('keydown', (event) => 
    {
    //This code causes the Player to move using WASD or Arrow keys
    const key = event.key.toLowerCase();
    if (['w', 'arrowup'].includes(key)) move('north');
    if (['a', 'arrowleft'].includes(key)) move('west');
    if (['s', 'arrowdown'].includes(key)) move('south');
    if (['d', 'arrowright'].includes(key)) move('east');

    //This allows the user to toggle if a room is complete or not by pressing Space.
    //Note: In the future, find a way to combat the screen scrolling when Space is pressed
    if ([' '].includes(key)) toggleCompletion();
});
