// Define constants
const GRID_SIZE = 21; // Number of rows and columns in the grid
const SQUARE_SIZE = 15; // Size of each square in pixels
const SPACING = 5; // Spacing between squares
const KEY_LEFT = 'ArrowLeft';
const KEY_UP = 'ArrowUp';
const KEY_RIGHT = 'ArrowRight';
const KEY_DOWN = 'ArrowDown';
const KEY_W = 'KeyW';
const KEY_A = 'KeyA';
const KEY_S = 'KeyS';
const KEY_D = 'KeyD';

let playerPosition = { row: Math.floor(GRID_SIZE / 2), col: Math.floor(GRID_SIZE / 2) }; // Starting position in the center

// Function to generate the map grid
function generateMap() {
    const mapElement = document.getElementById('map');

    // Clear previous content
    mapElement.innerHTML = '';

    // Loop to create each room
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const room = document.createElement('div');
            room.classList.add('room');
            room.dataset.row = row;
            room.dataset.col = col;
            
            mapElement.appendChild(room);
        }
    }

    // Create player dot in starting position
    updatePlayerPosition();
}

// Function to update player position on the grid
function updatePlayerPosition() {
    const playerDot = document.createElement('div');
    playerDot.classList.add('player');
    playerDot.style.top = `${playerPosition.row * (SQUARE_SIZE + SPACING) + SPACING}px`;
    playerDot.style.left = `${playerPosition.col * (SQUARE_SIZE + SPACING) + SPACING}px`;

    const mapElement = document.getElementById('map');
    mapElement.appendChild(playerDot);
}

// Function to move player dot based on key press
function movePlayer(direction) {
    switch (direction) {
        case KEY_LEFT:
        case KEY_A:
            if (playerPosition.col > 0) {
                playerPosition.col--;
            }
            break;
        case KEY_UP:
        case KEY_W:
            if (playerPosition.row > 0) {
                playerPosition.row--;
            }
            break;
        case KEY_RIGHT:
        case KEY_D:
            if (playerPosition.col < GRID_SIZE - 1) {
                playerPosition.col++;
            }
            break;
        case KEY_DOWN:
        case KEY_S:
            if (playerPosition.row < GRID_SIZE - 1) {
                playerPosition.row++;
            }
            break;
        default:
            return;
    }

    updatePlayerPosition();
}

// Function to handle key press events
function handleKeyPress(event) {
    const key = event.code;
    movePlayer(key);
}

// Function to initialize the application
function initApp() {
    generateMap();
    document.addEventListener('keydown', handleKeyPress);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
