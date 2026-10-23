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

const player = new Player()

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
    check_player_collision()
    player.draw_player()
    for(let i=arrows.length-1; i>=0; i--) {
        arrows[i].update_arrow(delta_time.delta_time)
        arrows[i].draw_arrow() 
        if(arrows[i].position.y > canvas.height) {
            arrows.splice(i, 1)
        }
    }
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
    
    
    window.requestAnimationFrame(animate);
    
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener('click', handle_shot);
canvas.addEventListener('mousemove', get_mouse_position);

function get_mouse_position(event) {   
    var rect = canvas.getBoundingClientRect();
    /*if(player.facing_direction == 1) {
        mouse_position.mouse_x = player.position.x
    }else{
        mouse_position.mouse_x = player.position.x + (player.width / 2 + 20)
    }*/
    mouse_position.mouse_y = event.clientY - rect.top
}
function handle_shot(event) {
    var rect = canvas.getBoundingClientRect();
    /*if(player.facing_direction == 1) {
        mouse_position.mouse_x = player.position.x
    }else{
        mouse_position.mouse_x = player.position.x + (player.width / 2 + 20)
    }*/
    mouse_position.mouse_y = event.clientY - rect.top
    if(timer(500)) {
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
    object.shot.x_difference = (player.position.x + 100) * player.facing_direction
    object.shot.y_difference = object.position.y - mouse_y
    let vector_length = Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
    if(!(vector_length > 0)) {
        object.shot.x_steps_per_frame = 1
        object.shot.y_steps_per_frame = 0
    }else{
        object.shot.x_steps_per_frame = object.shot.x_difference / vector_length
        object.shot.y_steps_per_frame = object.shot.y_difference / vector_length
    }
    

}

function timer(interval) {
    time.elapsedTime = performance.now()
    if(time.elapsedTime - time.startTime > interval) {
        time.startTime = time.elapsedTime
        return true
    }else{
        return false
    }
    
}

function load_tilemap() {
    for(let each_row=0; each_row<grid_rows; each_row++) {
        for(let each_col=0; each_col<grid_cols; each_col++) {
            let tile_index = each_row * grid_cols + each_col
            if(first_level[tile_index] == 0) {
                c.fillStyle = "blue"
                c.fillRect(tile_width*each_col, tile_height*each_row, tile_width, tile_height)
            }else{
                c.fillStyle = "lightgray"
                c.fillRect(tile_width*each_col, tile_height*each_row, tile_width, tile_height)
            }
        }
    }
}

function check_player_collision() {
    for(let each_row=0; each_row<grid_rows; each_row++) {
        for(let each_col=0; each_col<grid_cols; each_col++) {
            let tile_index = each_row * grid_cols + each_col
            let is_colliding = player.position.x < tile_width*each_col + tile_width &&  
            player.position.x + player.width > tile_width*each_col && 

            player.position.y < tile_height*each_row + tile_height && player.position.y + player.height > tile_height*each_row
            if(first_level[tile_index] == 0 && is_colliding) {
                player.velocity = 0
                player.position.y = tile_height*each_row - tile_height
            }
        }
    }
}