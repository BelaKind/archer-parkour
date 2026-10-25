const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);

var path = []
let aim_line = null
let arrows = []

const keys = {
    isLeft: false,
    isRight: false,
    isSpace: false,
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
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    load_tilemap()
    player.update_player(delta_time.delta_time)
    player.draw_player()
    draw_aim_line()
    draw_arrows()
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

function mapValue(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin; 
  
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
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
        console.log('shoot')
        arrows.push(new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2)))
        current_arrow = arrows[arrows.length -1]
        calculate_flight_angle(mouse_position.mouse_y, current_arrow)
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
    
    
}

function calculate_flight_angle(mouse_y, object) {    
    object.shot.x_difference = player.facing_direction * player.aim_sensitivity
    object.shot.y_difference = object.position.y - (player.position.y + player.height / 2) + player.aim_y
    let vector_length = Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
    if(!(vector_length > 0)) {
        object.shot.x_steps_per_frame = 1
        object.shot.y_steps_per_frame = 0
    }else{
        object.shot.x_steps_per_frame = object.shot.x_difference / vector_length
        object.shot.y_steps_per_frame = object.shot.y_difference / vector_length
    }
    

}

function load_tilemap() {
    for(let each_row=0; each_row<first_level.grid_rows; each_row++) {
        for(let each_col=0; each_col<first_level.grid_cols; each_col++) {
            let tile_index = each_row * first_level.grid_cols + each_col
            if(first_level.map[tile_index] == 0) {
                c.fillStyle = "blue"
                c.fillRect(first_level.width*each_col, first_level.height*each_row, first_level.width, first_level.height)
            }else{
                c.fillStyle = "lightgray"
                c.fillRect(first_level.width*each_col, first_level.height*each_row, first_level.width, first_level.height)
            }
        }
    }
}

function cycle_tiles() {
    let isColliding
    for(let each_row=0; each_row<first_level.grid_rows; each_row++) {
        for(let each_col=0; each_col<first_level.grid_cols; each_col++) {
            let tile_index = each_row * first_level.grid_cols + each_col
            first_level.position.x = first_level.width*each_col
            first_level.position.y = first_level.height*each_row

            isColliding = check_collision(player, first_level)
            if(first_level.map[tile_index] == 0 && isColliding) {
                return {tile_y: first_level.position.y, tile_x: first_level.position.x}
            }
        }
    }
    return false
}

function check_collision(objectA, objectB) {
    isColliding = objectA.position.x < objectB.position.x + objectB.width &&  
            objectA.position.x + objectA.width > objectB.position.x && 
            objectA.position.y < objectB.position.y + objectB.height && 
            objectA.position.y + objectA.height > objectB.position.y
    return isColliding
}

function draw_aim_line() {
    path = []
    aim_line = new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2))
    calculate_flight_angle(mouse_position.mouse_y, aim_line)
    for(let i=1; i<50; i++) {
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
        arrows[i].update_arrow(delta_time.delta_time)
        arrows[i].draw_arrow() 
        if(arrows[i].position.y > canvas.height) {
            arrows.splice(i, 1)
        }
    }
}