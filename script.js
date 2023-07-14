document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const width = 15;
    const resultDisplay = document.querySelector('.resultDisplay');
    let result = 0;
    let currentShooterIndex = 202;
    let direction = 1;
    let goingRight = true;
    let invadersId;
    let aliensRemoved = [];
    
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div');
        grid.append(square);
    }
    
    const squares = Array.from(document.querySelectorAll('.grid div'));
    
    const alienInvaders = [];
    for (let i = 0; i < 40; i++) {
        if (i >= 0 && i <= 9) {
            alienInvaders.push(i);
        }
        if (i >= 15 && i <= 24) {
            alienInvaders.push(i);
        }
        if (i >= 30 && i <= 39) {
            alienInvaders.push(i);
        }
    }
    
    drawInvader = () => {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
        }
    }
    drawInvader();

    removeInvader = () => {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }
    }

    squares[currentShooterIndex].classList.add('shooter');

    moveShooter = (e) => {
        squares[currentShooterIndex].classList.remove('shooter');
        switch(e.key) {
            case 'ArrowLeft' :
                if (currentShooterIndex % width !== 0) {
                    currentShooterIndex --;
                }
                break;
            case 'ArrowRight' :
                if (currentShooterIndex % width < width - 1) {
                    currentShooterIndex ++;
                }
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter);

    moveInvaders = () => {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
        removeInvader();

        if (rightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width - 1;
                direction = -1;
                goingRight = false;
            }
        }

        if (leftEdge && !goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width;
                direction = 1;
                goingRight = true;
            }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        }

        drawInvader();

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            clearInterval(invadersId);
            resultDisplay.innerHTML = "Game Over!";
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            if(alienInvaders[i] > (squares.length)) {
                resultDisplay.innerHTML = 'GAME OVER'
                clearInterval(invadersId)
            }
        }

        if (aliensRemoved.length === alienInvaders.length) {
            resultDisplay.innerHTML = "YOU WIN!";
            clearInterval(invadersId);
        }
    } 

    invadersId = setInterval(moveInvaders, 500);

    shoot = (e) => {
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        moveLaser = () => {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser', 'invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('boom');
                }, 300)
                clearInterval(laserId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
                result++;
                resultDisplay.innerHTML = result;
            }
        }

        switch(e.key) {
            case 'ArrowUp' :
                laserId = setInterval(moveLaser, 100);
        }
    }

    document.addEventListener('keydown', shoot);

});