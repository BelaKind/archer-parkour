
class Player {
    constructor() {
        this.position = {    
            x: 100,
            y: 100,
        }
        this.width = 30
        this.height = 30
        this.weight = 1500  
        this.velocity = 0
        this.speed = 400
        this.jump_height = 600
        this.facing_direction = 1
        this.shoot_timer = new Timer()
        this.jump_timer = new Timer()
        this.isOnGround = false
    }
    get sides() {
        return {
            bottom: this.position.y + this.height
        }
    }
    draw_player() {
        c.fillStyle = 'red'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update_player(deltaTime) {
        this.velocity += this.weight * deltaTime;    
        this.position.y += this.velocity * deltaTime;
        this.isOnGround = false
        let isColliding = check_collision(this)
        if (isColliding) {
            if(this.sides.bottom > isColliding.tile_y && this.velocity > 0) {
                this.velocity = 0;
                this.position.y = isColliding.tile_y - this.height
                this.isOnGround = true
            }else{
                this.velocity = 0
                this.position.y = isColliding.tile_y + tile_height
            }
        }
        if (keys.isSpace && this.jump_timer.calculate_time(500) && this.isOnGround) {
            this.isOnGround = false
            this.velocity -= this.jump_height
            this.isOnGround = true
        }
        if (keys.isLeft) {
            this.position.x -= this.speed * deltaTime
            this.facing_direction = -1
            isColliding = check_collision(this)
            if(isColliding) {
                this.position.x = isColliding.tile_x + tile_width
            }
            
        }
        if(keys.isRight) {
            this.position.x += this.speed * deltaTime
            this.facing_direction = 1
            isColliding = check_collision(this)
            if(isColliding) {
                this.position.x = isColliding.tile_x - this.width
            }
        }
    }
}

const player = new Player()

