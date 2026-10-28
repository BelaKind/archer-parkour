class Arrow {
    constructor(player_x, player_y) {
        this.width = 20
        this.height = 5

        this.position = {
            x: player_x - this.width / 2,
            y: player_y - this.height / 2,
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

        
        this.weight = 0.8
        this.isStuck = false
        this.angle = 0

        this.timer = new Timer()
        this.isAimline = false

        this.arrowhead = {
            radius: 2.5,
            x: 0,
            y: 0,
        }

    }
    draw_arrow(angle) {
        c.fillStyle = 'blue'; 
        c.save();
        c.translate(this.position.x + this.width / 2,this.position.y + this.height / 2)
        if(this.isStuck) {
            c.rotate(this.angle)
        }else{
            c.rotate(angle)
        }
        if (arrow.complete) {
            c.drawImage(arrow, -(this.width / 2), -(this.height / 2))
        }
        //c.fillRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
        c.restore(); 
    }
    update_arrow(deltaTime, current_arrow) {
        if(!this.isStuck) {
            this.position.x += (this.shot.x_steps * this.shot.speed_multiplier) * deltaTime
            this.position.y += (this.shot.y_steps * this.shot.speed_multiplier) * deltaTime
            this.shot.y_steps += this.weight * deltaTime
            let unit_vector = normalize_vector(this.shot.x_steps, this.shot.y_steps)
            this.arrowhead.x = (this.position.x + this.width / 2) + (unit_vector.unit_vector_x * (this.width / 2 - this.arrowhead.radius))
            this.arrowhead.y = (this.position.y + this.height / 2) + (unit_vector.unit_vector_y * (this.width / 2 - this.arrowhead.radius))
            
            if(cycle_tiles(this, 'circle').tyle_type == 2 && !this.isAimline) {
                arrows.splice(current_arrow, 1)
                first_level.map[cycle_tiles(this, 'circle').index] = 1
                return false
            }else if(cycle_tiles(this, 'circle')) {
                if(!this.isStuck) {
                    this.isStuck = true
                    this.angle = calculate_flight_angle(this.shot.y_steps, this.shot.x_steps)
                }
                
                this.shot.x_steps = 0
                this.shot.y_steps = 0
            }
            
            return true
        }else{
            return true
        }
    }
}