const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        // noinspection BadExpressionStatementJS
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = false

    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Attack box
        context.fillStyle = 'green'
        context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.position.y + this.height + this.velocity.y >= canvas.height ? this.velocity.y = 0 : this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
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

const enemy = new Sprite({
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
    let attackPositionX = rectangle1.attackBox.position.x + rectangle1.attackBox.width
    let attackPositionY = rectangle1.attackBox.position.y + rectangle1.attackBox.height
    let enemyHitBoxX = rectangle2.position.x + rectangle2.width
    let enemyHitBoxY = rectangle2.position.y + rectangle2.height

    return (
        attackPositionX >= rectangle2.position.x && rectangle1.attackBox.position.x <= enemyHitBoxX &&
        attackPositionY >= rectangle2.position.y && rectangle1.attackBox.position.y <= enemyHitBoxY
    )
}

function animator() {
    window.requestAnimationFrame(animator)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
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

    if (detectCollision({
        rectangle1: player, rectangle2: enemy
    }) && player.isAttacking) {
        player.isAttacking = false
        console.log('hit')
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
        case ' ':
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
    }
    console.log(event.key)
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
    console.log(event.key)
})
