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

const shop = new Sprite({
    position: {
        x: 625,
        y: 128,
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 156
    },
    imageSrc: './assets/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/samuraiMack/attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/takeHit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 920,
        y: 170,
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: 'assets/enemyKenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './assets/enemyKenji/idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/enemyKenji/run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/enemyKenji/jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/enemyKenji/fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/enemyKenji/attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/enemyKenji/takeHit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/enemyKenji/death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -165,
            y: 50
        },
        width: 150,
        height: 50
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

decreaseTimer()

function animator() {
    window.requestAnimationFrame(animator)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player 1 movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.changeSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.changeSprite('run')
    } else {
        player.changeSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.changeSprite('jump')
    } else if (player.velocity.y > 0) {
        player.changeSprite('fall')
    }

    // Player 2 (enemy) movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.changeSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.changeSprite('run')
    } else {
        enemy.changeSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.changeSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.changeSprite('fall')
    }

    // Detect collision for Player 1
    if (detectCollision({rectangle1: player, rectangle2: enemy})
        && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // Attack miss (Player 1)
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // Detect collision for Player 2 (Enemy)
    if (detectCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
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
