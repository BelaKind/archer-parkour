
class Player {
    constructor() {
        this.position = {    
            x: 0,
            y: 738,
        }
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            
            width: 0,
            height: 0,
        }
        this.width = 64
        // how many pixels the drawn player is actually wide
        this.realWidth = 20
        this.height = 64
        this.weight = 1500  
        this.velocity = 0
        this.speed = 400
        this.jump_height = 600
        this.facing_direction = 1
        this.shoot_timer = new Timer()
        this.jump_timer = new Timer()
        this.isOnGround = false
        this.aim_sensitivity = 100
        this.aim_y = 0
    }
    get sides() {
        return {
            bottom: this.position.y + this.height
        }
    }

    
    draw_player(texture) {
        if(this.facing_direction == -1) {
            c.save()
            // set set orgin so the body of the player in the image is aligned as before 
            c.translate(this.hitbox.position.x + this.hitbox.width + this.hitbox.position.x - this.position.x, this.position.y);
            c.scale(-1, 1)
            c.globalAlpha = 1
            c.drawImage(texture, 0, 0, 64, 64)
            c.restore()
        }else{
            c.globalAlpha = 1
            c.drawImage(texture, this.position.x, this.position.y, 64, 64)
        }
        
    }

    update_player(deltaTime) {
        this.velocity += this.weight * deltaTime;    
        this.position.y += this.velocity * deltaTime;
        this.isOnGround = false
        let colliding_tile = cycle_tiles(this.hitbox, 'rectangle').find((tile) => tile_list[tile.identifier].solid)
        if(colliding_tile) {
            if(this.sides.bottom > colliding_tile.tile_y && this.velocity > 0) {
                this.velocity = 0;
                this.position.y = colliding_tile.tile_y - this.hitbox.height
                this.isOnGround = true
            }else{
                this.velocity = 0
                this.position.y = colliding_tile.tile_y + game.current_level.height
            }
            if (keys.isSpace && this.isOnGround) {
                this.isOnGround = false
                this.velocity -= this.jump_height
                this.isOnGround = true
            }
        }

        if (keys.isLeft || this.position.x < 0) {
            colliding_tile = cycle_tiles(this.hitbox, 'rectangle').find((tile) => tile_list[tile.identifier].solid)
            this.position.x -= this.speed * deltaTime
            this.facing_direction = -1
            if(colliding_tile) {
                this.position.x = colliding_tile.tile_x + game.current_level.width
            }
            // if(this.hitbox.position.x < 0) {
            //     this.position.x = this.hitbox.position.x - this.position.x
            //     this.update_hitbox()
            // }
            
        }
        if(keys.isRight || this.position.x > canvas.width) {
            colliding_tile = cycle_tiles(this.hitbox, 'rectangle').find((tile) => tile_list[tile.identifier].solid)
            this.position.x += this.speed * deltaTime
            this.facing_direction = 1
            if(colliding_tile) {
                console.log("1" + this.position.x, colliding_tile.tile_x)
                this.position.x = (colliding_tile.tile_x - this.width) + ((this.position.x + this.width) - (this.hitbox.position.x + this.hitbox.width))
                console.log(this.position.x)
            }
            // if(this.hitbox.position.x + this.hitbox.width > canvas.width) {
            //     this.position.x = canvas.width - ((this.position.x + this.width) - (this.hitbox.position.x + this.hitbox.width))
            //     this.update_hitbox()
            // }
        }

    }

    update_hitbox() {
        this.hitbox.position.x = this.position.x + 4
        this.hitbox.position.y = this.position.y
        this.hitbox.width = this.realWidth
        this.hitbox.height = this.height
        c.fillStyle = 'red'
        c.globalAlpha = 0.3
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
    }
}


