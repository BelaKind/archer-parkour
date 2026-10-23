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
        if ((this.sides.bottom > canvas.height)) {
            this.velocity = 0;
            this.position.y = canvas.height - this.height
        }
        if (keys.isSpace && timer(200)) {
            this.velocity -= this.jump_height
        }
        if (keys.isLeft) {
            this.position.x -= this.speed * deltaTime
            this.facing_direction = -1
        }
        if(keys.isRight) {
            this.position.x += this.speed * deltaTime
            this.facing_direction = 1
        }
    }
}