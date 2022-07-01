class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }
}

class Fighter {
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
        this.health = 100
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Attack box
        if (this.isAttacking) {
            context.fillStyle = 'green'
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.position.y + this.height + this.velocity.y >= canvas.height - 97 ? this.velocity.y = 0 : this.velocity.y += gravity

        // Create "invisible" wall for Player 1
        if (player.position.x < 0 && player.lastKey === 'a') {
            keys.a.pressed = false
        } else if (player.position.x > 973 && player.lastKey === 'd') {
            keys.d.pressed = false
        }

        // Create "invisible" wall for Player 2 (enemy)
        if (enemy.position.x < 0 && enemy.lastKey === 'ArrowLeft') {
            keys.ArrowLeft.pressed = false
        } else if (enemy.position.x > 973 && enemy.lastKey === 'ArrowRight') {
            keys.ArrowRight.pressed = false
        }

    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}
