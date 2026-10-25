class Arrow {
    constructor(player_x, player_y) {
        this.position = {
            x: player_x,
            y: player_y,
        }

        this.shot = {
            x_difference: 0,
            y_difference: 0,
            x_steps_per_frame: 0,
            y_steps_per_frame: 0,
            x_mouse_position: 0,
            y_mouse_position: 0,
            speed_multiplier: 900,
        }

        this.width = 20
        this.height = 5
        this.weight = 0.8

        this.timer = new Timer()

    }
    draw_arrow() {
        c.fillStyle = 'blue'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update_arrow(deltaTime, current_arrow) {
        
        this.position.x += (this.shot.x_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.position.y += (this.shot.y_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.shot.y_steps_per_frame += this.weight * deltaTime
        if(cycle_tiles(this).tyle_type == 2) {
            arrows.splice(current_arrow, 1)
            first_level.map[cycle_tiles(this).index] = 1
            return false
        }else if(cycle_tiles(this)) {
            this.shot.x_steps_per_frame = 0
            this.shot.y_steps_per_frame = 0
        }
        
        return true
    }
}