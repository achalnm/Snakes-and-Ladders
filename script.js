document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const dice = document.getElementById('dice');
    const message = document.getElementById('message');
    const rollButton = document.getElementById('roll-dice');
    const player = document.getElementById('player');
    const playAgainButton = document.getElementById('play-again');
    const positionDisplay = document.getElementById('position-display');
    let playerPosition = 1;

    const snakes = {
        16: 6, 47: 26, 49: 11, 56: 53, 62: 19,
        64: 60, 87: 24, 93: 73, 95: 75, 98: 78
    };
    
    const ladders = {
        1: 38, 4: 14, 9: 31, 21: 42, 28: 84,
        36: 44, 51: 67, 71: 91, 80: 100, 85: 97
    };

    for (let i = 100; i > 0; i--) {
        const cell = document.createElement('div');
        cell.textContent = i;
        if (i in ladders) {
            cell.innerHTML = `🪜 ${i}`;
            cell.classList.add('ladder');
        } else if (i in snakes) {
            cell.innerHTML = `🐍 ${i}`;
            cell.classList.add('snake');
        } else if (i === 100) {
            cell.innerHTML = `👑 ${i}`;
        }
        board.appendChild(cell);
    }

    function updatePlayerPosition(position) {
        const cells = board.children;
        const index = 100 - position;
        const cell = cells[index];
        const cellRect = cell.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();

        const playerLeft = cellRect.left - boardRect.left;
        const playerTop = cellRect.top - boardRect.top;

        player.style.left = `${playerLeft}px`;
        player.style.top = `${playerTop}px`;
        player.innerHTML = `🎲`;

        positionDisplay.textContent = `Current Position: ${position}`;
    }

    function showMessage(messageText, messageType) {
        message.textContent = messageText;
        message.className = `message ${messageType}`;
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }

    function handleSnake() {
        document.body.classList.add('vibrate');
        setTimeout(() => {
            document.body.classList.remove('vibrate');
        }, 500);
        showMessage('Oh no! You encountered a snake!', 'snake');
    }

    function handleLadder() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        showMessage('Congratulations! You climbed a ladder!', 'ladder');
    }

    rollButton.addEventListener('click', () => {
        dice.classList.add('shake');
        setTimeout(() => {
            dice.classList.remove('shake');
        }, 500);

        const rollValue = Math.floor(Math.random() * 6) + 1;
        dice.textContent = `You rolled: ${rollValue}`;

        let newPosition = playerPosition + rollValue;
        if (newPosition > 100) {
            newPosition = playerPosition;
        }

        if (ladders.hasOwnProperty(newPosition)) {
            newPosition = ladders[newPosition];
            handleLadder();
        } else if (snakes.hasOwnProperty(newPosition)) {
            newPosition = snakes[newPosition];
            handleSnake();
        }

        playerPosition = newPosition;
        updatePlayerPosition(playerPosition);
    });

    playAgainButton.addEventListener('click', () => {
        playerPosition = 1;
        updatePlayerPosition(playerPosition);
        dice.textContent = 'Roll the Dice';
        message.style.display = 'none';
    });

    updatePlayerPosition(playerPosition);
});
