const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1920
canvas.height = 1088
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);

var path = []
let aim_line = null
let arrows = []

const keys = {
    isLeft: false,
    isRight: false,
    isSpace: false,
    isR: false,
    isEsc: false,
}

const delta_time = {
    delta_time: 0,
    last_time: 0,
}

const mouse_position = {
    mouse_x: null,
    mouse_y: null,
}

//textures
const regular_sandstone = new Image()
const target = new Image()
const arrow = new Image()
const player_sprite = new Image()
const menu_background = new Image()

function load_textures() {
    regular_sandstone.src = 'assets/regular_sandstone.png'
    target.src = 'assets/target_v2.png'
    arrow.src = 'assets/arrow.png'
    player_sprite.src = 'assets/player.png'
    menu_background.src = 'assets/menu.png'
}
load_textures()

// ++++++++++++++++++++++++++++Every Frame+++++++++++++++++++++++++++++++++++++++
window.requestAnimationFrame(animate);

function animate(current_time) {
    if (!delta_time.last_time) delta_time.last_time = current_time;
    delta_time.delta_time = Math.min((current_time - delta_time.last_time) / 1000, 0.033) 
    delta_time.last_time = current_time;
    game.update_game_state()
    if(game.state == 'playing') {
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.globalAlpha = 1
        c.fillStyle = '#a4e4fc'
        c.fillRect(0, 0, canvas.width, canvas.height);
        load_tilemap()
        player.update_player(delta_time.delta_time)
        player.draw_player()
        draw_aim_line()
        draw_arrows()
        c.font = '20px "SimSun"';
        c.fillStyle = 'red'
        c.fillText(`Targets remaining: ${count_targets()}`, 30, 30);
    }else if(game.state == 'dead') {
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.globalAlpha = 1
        c.fillStyle = '#a4e4fc'
        c.fillRect(0, 0, canvas.width, canvas.height);
        load_tilemap()
        player.draw_player()
        draw_aim_line()
        draw_arrows()
        c.font = '50px Arial';
        c.fillStyle = 'red'
        c.fillText(`YOU DIED`, canvas.width/2 - 100, canvas.height/2);
        c.fillText(`Press 'R' to restart`, canvas.width/2 - 100, canvas.height/2 + 50);
        c.globalAlpha = 0.6;
        c.fillRect(0, 0, canvas.width, canvas.height);
        if(keys.isR) {
            reset_game()
        }
    }else if(game.state == 'won') {
        c.font = '50px Arial';
        c.fillStyle = 'yellow'
        c.fillText(`YOU WON`, canvas.width/2 - 100, canvas.height/2);
        c.fillText(`Press 'R' to restart`, canvas.width/2 - 100, canvas.height/2 + 50);
        c.globalAlpha = 0.3;
        c.fillRect(0, 0, canvas.width, canvas.height);
        if(keys.isR) {
            reset_game()
        }
    }else if(game.state == 'paused') {
        if (menu_background.complete) {
            c.drawImage(menu_background, (canvas.width/2)-500, (canvas.height/2)-500, 1000, 1000)
            c.font = '70px Arial';
            c.textAlign = 'center'
            c.textBaseline = 'middle'
            c.fillStyle = '#f8b800'
            c.fillText('GAME PAUSED', canvas.width/2, (canvas.height/2)-120)
            c.fillText('Press to continue', canvas.width/2, (canvas.height/2)+50)
        }
    }
    window.requestAnimationFrame(animate);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener('click', handle_shot);
document.addEventListener('pointerlockchange', (event) => {
    if(document.pointerLockElement){
        keys.isEsc = false
        game.isMouseLocked = true
    }else{
        keys.isEsc = true
        game.isMouseLocked = false
    }
})
canvas.addEventListener('mousemove', get_mouse_movement);

function get_mouse_movement(event) {   
    player.aim_y += event.movementY * 0.6
    player.aim_y = Math.max(-200, Math.min(player.aim_y, 200))    
}


function handle_shot() {
    try {
        canvas.requestPointerLock({unadjustedMovement: true});
        
    } catch (error) {
      console.error("pointer lock error", error);
    }
    if(game.isMouseLocked) {
        if(player.shoot_timer.calculate_time(500)) {
            arrows.push(new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2)))
            current_arrow = arrows[arrows.length -1]
            let vector = calculate_flight_vector(current_arrow)
            current_arrow.shot.x_steps = vector.x_steps
            current_arrow.shot.y_steps = vector.y_steps
        }
    }
    

    
}

document.addEventListener('keydown', (event) => {
    keys_pressed(event);
});
document.addEventListener('keyup', (event) => {
    keys_pressed(event);
});



function keys_pressed(event) {
    let timer = new Timer()
    if (event.code == 'Space') {
        keys.isSpace = event.type == 'keydown'
    }

    if(event.code == 'KeyA' || event.code == 'ArrowLeft') {
        keys.isLeft = event.type == 'keydown'
    }

    if(event.code == 'KeyD' || event.code == 'ArrowRight') {
        keys.isRight = event.type == 'keydown'
    }

    if(event.code == 'KeyR') {
        keys.isR = event.type == 'keydown'
    }

    if(event.code == 'Escape' && event.type == 'keydown') {
        keys.isEsc = !keys.isEsc
        
    }
    
    
}

function calculate_flight_vector(object) {    
    object.shot.x_difference = player.facing_direction * player.aim_sensitivity
    object.shot.y_difference = object.position.y - (player.position.y + player.height / 2) + player.aim_y
    let vector_length = Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
    if(!(vector_length > 0)) {
        return {x_steps: 1, y_steps: 0} 
    }else{
        return {x_steps: object.shot.x_difference / vector_length, y_steps: object.shot.y_difference / vector_length}
    }
}

function normalize_vector(x, y) {
    let vector_length = Math.sqrt(x ** 2 + y ** 2)
    return {unit_vector_x: x / vector_length, unit_vector_y: y / vector_length}
}

function calculate_flight_angle(y, x) {
    let raw_angle = Math.atan2(y, x)
    return raw_angle

}



function load_tilemap() {
    for(let each_row=0; each_row<first_level.grid_rows; each_row++) {
        for(let each_col=0; each_col<first_level.grid_cols; each_col++) {
            let tile_index = each_row * first_level.grid_cols + each_col
            if(game.current_map[tile_index] == 0) {
                
                if (regular_sandstone.complete) {
                    c.drawImage(regular_sandstone, first_level.width*each_col, first_level.height*each_row)
                }
                
            }else if(game.current_map[tile_index] == 2) {
                if (target.complete) {
                    c.drawImage(target, first_level.width*each_col, first_level.height*each_row)
                }
                
            }
        }
    }
}

function cycle_tiles(object, type) {
    let isColliding
    for(let each_row=0; each_row<first_level.grid_rows; each_row++) {
        for(let each_col=0; each_col<first_level.grid_cols; each_col++) {
            let tile_index = each_row * first_level.grid_cols + each_col
            first_level.position.x = first_level.width*each_col
            first_level.position.y = first_level.height*each_row
            if(type == 'rectangle') {
                isColliding = check_rectangle_collision(object, first_level)
            }else if(type == 'circle') {
                isColliding = check_circle_collision(object.arrowhead.x, object.arrowhead.y, object.arrowhead.radius, first_level.position.x, first_level.position.y, first_level.width, first_level.height)
            }
            
            if(game.current_map[tile_index] == 0 && isColliding) {
                return {tile_y: first_level.position.y, tile_x: first_level.position.x}
            }
            if(game.current_map[tile_index] == 2 && isColliding) {
                return {tyle_type: 2, index: tile_index, tile_y: first_level.position.y, tile_x: first_level.position.x}
            }
        }
    }
    return false
}

function check_rectangle_collision(objectA, objectB) {
    isColliding = objectA.position.x < objectB.position.x + objectB.width &&  
            objectA.position.x + objectA.width > objectB.position.x && 
            objectA.position.y < objectB.position.y + objectB.height && 
            objectA.position.y + objectA.height > objectB.position.y
    return isColliding
}

function check_circle_collision(circle_x, circle_y, radius, rect_x, rect_y, rect_w, rect_h) {
    let closest_X = Math.max(rect_x, Math.min(circle_x, rect_x + rect_w));
    let closest_Y = Math.max(rect_y, Math.min(circle_y, rect_y + rect_h));

    // Compare its distance to the radius
    let delta_x = circle_x - closest_X;
    let delta_y = circle_y - closest_Y;
    return delta_x * delta_x + delta_y * delta_y <= radius * radius
}


function draw_aim_line() {
    path = []
    aim_line = new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2))
    aim_line.isAimline = true
    let vector = calculate_flight_vector(aim_line)
    aim_line.shot.x_steps = vector.x_steps
    aim_line.shot.y_steps = vector.y_steps
    for(let i=1; i<15; i++) {
        path.push({x: aim_line.position.x + aim_line.width / 2, y: aim_line.position.y + aim_line.height / 2})
        aim_line.update_arrow(0.01)
    }
    if (path.length > 0) {
        c.beginPath();
        c.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            c.lineTo(path[i].x, path[i].y);
        }
        c.setLineDash([2, 5]); 
        c.strokeStyle = 'gray';
        c.lineWidth = 2;
        c.stroke();
    }
}

function draw_arrows() {
    for(let i=arrows.length-1; i>=0; i--) {
        current_arrow = i 
        let isAlive = arrows[i].update_arrow(delta_time.delta_time, current_arrow)
        if (isAlive) {
            arrows[i].draw_arrow(calculate_flight_angle(arrows[i].shot.y_steps, arrows[i].shot.x_steps))
            if(arrows[i].position.y > canvas.height) {
                arrows.splice(i, 1)
            }
        }
        
    }
}

function count_targets() {
    let targets_remaining = 0
    for(let i=0; i<game.current_map.length; i++) {
        if(game.current_map[i] == 2) {
            targets_remaining ++
        }
    }
    return targets_remaining 
}

function reset_game() {
    player = new Player()
    first_level = new Level()
    game.current_map = first_level.map
    arrows = []
}

