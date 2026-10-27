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
}
const time = {
    elapsedTime: 0,
    startTime: performance.now(),
    interval: 500,
}
const delta_time = {
    delta_time: 0,
    last_time: 0,
}

const mouse_position = {
    mouse_x: null,
    mouse_y: null,
}

// ++++++++++++++++++++++++++++Every Frame+++++++++++++++++++++++++++++++++++++++

window.requestAnimationFrame(animate);

function animate(current_time) {
    if (!delta_time.last_time) delta_time.last_time = current_time;
    delta_time.delta_time = (current_time - delta_time.last_time) / 1000;
    delta_time.last_time = current_time;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.globalAlpha = 1
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    load_tilemap()
    player.update_player(delta_time.delta_time)
    player.draw_player()
    draw_aim_line()
    draw_arrows()
    c.font = '20px Arial';
    c.fillStyle = 'red'
    c.fillText(`Targets remaining: ${count_targets()}`, 30, 30);
    if(player.position.y > canvas.height) {
        c.font = '50px Arial';
        c.fillStyle = 'red'
        c.fillText(`YOU DIED`, canvas.width/2 - 100, canvas.height/2);
        c.fillText(`Press 'R' to restart`, canvas.width/2 - 100, canvas.height/2 + 50);
        c.fillStyle = 'red'
        c.globalAlpha = 0.2;
        c.fillRect(0, 0, canvas.width, canvas.height);
        if(keys.isR) {
            reset_game()
        }
        
    }else if(count_targets() == 0) {
        c.font = '50px Arial';
        c.fillStyle = 'yellow'
        c.fillText(`YOU WON`, canvas.width/2 - 100, canvas.height/2);
        c.fillText(`Press 'R' to restart`, canvas.width/2 - 100, canvas.height/2 + 50);
        c.fillStyle = 'yellow'
        c.globalAlpha = 0.2;
        c.fillRect(0, 0, canvas.width, canvas.height);
        if(keys.isR) {
            reset_game()
        }
    }
    window.requestAnimationFrame(animate);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener('click', handle_shot);
canvas.addEventListener('mousemove', get_mouse_movement);

function get_mouse_movement(event) {   
    player.aim_y += event.movementY * 0.6
    player.aim_y = Math.max(-200, Math.min(player.aim_y, 200))    
}


function handle_shot(event) {
    try {
        canvas.requestPointerLock({unadjustedMovement: true});
    } catch (error) {
      console.error("pointer lock error", error);
    }
    canvas.requestPointerLock();
    var rect = canvas.getBoundingClientRect();
    mouse_position.mouse_y = event.clientY - rect.top
    if(player.shoot_timer.calculate_time(500)) {
        arrows.push(new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2)))
        current_arrow = arrows[arrows.length -1]
        calculate_flight_vector(current_arrow)
    }
    
    
}

document.addEventListener('keydown', (event) => {
    movement(event);
});
document.addEventListener('keyup', (event) => {
    movement(event);
});

function movement(event) {
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
    
    
}

function calculate_flight_vector(object) {    
    object.shot.x_difference = player.facing_direction * player.aim_sensitivity
    object.shot.y_difference = object.position.y - (player.position.y + player.height / 2) + player.aim_y
    let vector_length = Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
    if(!(vector_length > 0)) {
        object.shot.x_steps = 1
        object.shot.y_steps = 0
    }else{
        object.shot.x_steps = object.shot.x_difference / vector_length
        object.shot.y_steps = object.shot.y_difference / vector_length
    }
}

function calculate_flight_angle(y, x) {
    let raw_angle = Math.atan2(y, x)
    return raw_angle

}

function load_tilemap() {
    for(let each_row=0; each_row<first_level.grid_rows; each_row++) {
        for(let each_col=0; each_col<first_level.grid_cols; each_col++) {
            let tile_index = each_row * first_level.grid_cols + each_col
            if(first_level.map[tile_index] == 0) {
                c.fillStyle = "green"
                c.fillRect(first_level.width*each_col, first_level.height*each_row, first_level.width, first_level.height)
            }else if(first_level.map[tile_index] == 1){
                c.fillStyle = "lightgray"
                c.fillRect(first_level.width*each_col, first_level.height*each_row, first_level.width, first_level.height)
            }else if(first_level.map[tile_index] == 2) {
                c.fillStyle = "black"
                c.fillRect(first_level.width*each_col, first_level.height*each_row, first_level.width, first_level.height)
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
            
            if(first_level.map[tile_index] == 0 && isColliding) {
                return {tile_y: first_level.position.y, tile_x: first_level.position.x}
            }
            if(first_level.map[tile_index] == 2 && isColliding) {
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
    calculate_flight_vector(aim_line)
    for(let i=1; i<15; i++) {
        path.push({x: aim_line.position.x, y: aim_line.position.y})
        aim_line.update_arrow(0.01)
    }
    if (path.length > 1) {
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
        arrows[i].draw_arrow(calculate_flight_angle(arrows[i].shot.y_steps, arrows[i].shot.x_steps)) 
        let isAlive = arrows[i].update_arrow(delta_time.delta_time, current_arrow)
        if (isAlive) {
            if(arrows[i].position.y > canvas.height) {
                arrows.splice(i, 1)
            }
        }
        
    }
}

function count_targets() {
    let targets_remaining = 0
    for(let i=0; i<first_level.map.length; i++) {
        if(first_level.map[i] == 2) {
            targets_remaining ++
        }
    }
    return targets_remaining 
}





function reset_game() {
    player = new Player()
    first_level = new Level()
    first_level.map = [
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
2, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 

]
    arrows = []
}