class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax - 0.1,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

class Fighter extends Sprite {
    constructor({position, velocity, color = 'red', offset, imageSrc, scale = 1, framesMax = 1}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
        })

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
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
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
