class Arrow {
    constructor(player_x, player_y) {
        this.position = {
            x: player_x,
            y: player_y,
        }

        this.shot = {
            x_difference: 0,
            y_difference: 0,
            x_steps: 0,
            y_steps: 0,
            x_mouse_position: 0,
            y_mouse_position: 0,
            speed_multiplier: 900,
        }

        this.width = 20
        this.height = 5
        this.weight = 0.8

        this.timer = new Timer()
        this.isAimline = false

    }
    draw_arrow(angle) {
        c.fillStyle = 'blue'; 
        c.save();
        c.translate(this.position.x + this.width / 2,this.position.y + this.height / 2)
        c.rotate(angle)
        c.fillRect(0, 0, this.width, this.height);
        c.restore(); 
    }
    update_arrow(deltaTime, current_arrow) {
        
        this.position.x += (this.shot.x_steps * this.shot.speed_multiplier) * deltaTime
        this.position.y += (this.shot.y_steps * this.shot.speed_multiplier) * deltaTime
        this.shot.y_steps += this.weight * deltaTime
        if(cycle_tiles(this).tyle_type == 2 && !this.isAimline) {
            arrows.splice(current_arrow, 1)
            first_level.map[cycle_tiles(this).index] = 1
            return false
        }else if(cycle_tiles(this)) {
            this.shot.x_steps = 0
            this.shot.y_steps = 0
        }
        
        return true
    }
}