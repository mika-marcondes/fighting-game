const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
    }

    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, 50, 150)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
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
    }
})

console.log(player)

function animator() {
    window.requestAnimationFrame(animator)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
}

animator()
