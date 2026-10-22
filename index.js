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

class Player {
    constructor() {
        this.position = {    
            x: 100,
            y: 100,
        }
        this.width = 100
        this.height = 100
        this.weight = 1500  
        this.velocity = 1500
        this.speed = 1000
        this.jump_height = 1000
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
}

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
        this.height = 20
        this.weight = 0.8

    }
    draw_arrow() {
        c.fillStyle = 'blue'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update_arrow(delta_time) {
        
        this.position.x += (this.shot.x_steps_per_frame * this.shot.speed_multiplier) * delta_time
        this.position.y += (this.shot.y_steps_per_frame * this.shot.speed_multiplier) * delta_time
        this.shot.y_steps_per_frame += this.weight * delta_time
    }
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
    update_player(delta_time.delta_time)
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
    calculate_flight_angle(mouse_position.mouse_x, mouse_position.mouse_y, aim_line)
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
    console.log(player.position.y)
    
    
    window.requestAnimationFrame(animate);
    
}

function update_player(delta_time) {
    player.velocity += player.weight * delta_time;    
    player.position.y += player.velocity * delta_time;
    if ((player.sides.bottom > canvas.height)) {
        player.velocity = 0;
        player.position.y = canvas.height - player.height
    }
    if (keys.isSpace && player.sides.bottom >= canvas.height) {
        player.velocity -= player.jump_height
    }
    if (keys.isLeft) {
        player.position.x -= player.speed * delta_time
        player.facing_direction = -1
    }
    if(keys.isRight) {
        player.position.x += player.speed * delta_time
        player.facing_direction = -1
    }
    
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener('click', handle_shot);
canvas.addEventListener('mousemove', get_mouse_position);

function get_mouse_position(event) {   
    var rect = canvas.getBoundingClientRect();
    mouse_position.mouse_x = event.clientX - rect.left
    mouse_position.mouse_y = event.clientY - rect.top
}
function handle_shot(event) {
    var rect = canvas.getBoundingClientRect();
    mouse_position.mouse_x = event.clientX - rect.left
    mouse_position.mouse_y = event.clientY - rect.top
    if(timer(500)) {
        arrows.push(new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2)))
        current_arrow = arrows[arrows.length -1]
        calculate_flight_angle(mouse_position.mouse_x, mouse_position.mouse_y, current_arrow)
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

function calculate_flight_angle(mouse_x, mouse_y, object) {    
    object.shot.x_difference = object.position.x - mouse_x
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