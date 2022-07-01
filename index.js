const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/background.png'
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Fighter({
    position: {
        x: 974,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

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

decreaseTimer()

function animator() {
    window.requestAnimationFrame(animator)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player 1 movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // Player 2 (enemy) movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // Detect collision for Player 1
    if (detectCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // Detect collision for Player 2 (Enemy)
    if (detectCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animator()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player 1
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.velocity.y === 0) {
                player.velocity.y = -20
            }
            break
        case 's':
            player.attack()
            break

        // Player 2 (enemy)
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.velocity.y === 0) {
                enemy.velocity.y = -20
            }
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // Player 1
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        // Player 2
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
