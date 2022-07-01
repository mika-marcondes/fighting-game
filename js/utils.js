function detectCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let timer = 40
let timerId

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)

    document.querySelector('#gameOver').style.display = 'flex'

    if (player.health === enemy.health) {
        document.querySelector('#gameOver').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#gameOver').innerHTML = 'Player 1 Wins'
    } else if (enemy.health > player.health) {
        document.querySelector('#gameOver').innerHTML = 'Player 2 Wins'
    }
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        // noinspection JSValidateTypes
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}
