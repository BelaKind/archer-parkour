class Player {
    constructor() {
        this.position = {    
            x: 100,
            y: 100,
        }
        this.width = 30
        this.height = 30
        this.weight = 1500  
        this.velocity = 1500
        this.speed = 600
        this.jump_height = 600
        this.facing_direction = 1
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
        if ((this.sides.bottom > check_collision().tile_y)) {
            this.velocity = 0;
            this.position.y = check_collision().tile_y - this.height
        }
        if (keys.isSpace) {
            this.velocity -= this.jump_height
        }
        if (keys.isLeft) {
            this.position.x -= this.speed * deltaTime
            this.facing_direction = -1
            if(isColliding) {
                this.position.x = check_collision(this).tile_x + tile_width
            }
            
        }
        if(keys.isRight) {
            this.position.x += this.speed * deltaTime
            this.facing_direction = 1
            if(isColliding) {
                this.position.x = check_collision(this).tile_x - this.width
            }
        }
    }
}

const player = new Player()
