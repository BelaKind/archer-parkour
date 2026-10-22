const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);


var path = []


let arrows = []
let delta_time = 0
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

last_time = 0

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
        this.velocity = 0
        this.speed = 1000
        this.jump_height = 1000
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
    update_arrow(deltaTime) {
        
        this.position.x += (this.shot.x_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.position.y += (this.shot.y_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.shot.y_steps_per_frame += this.weight * deltaTime
    }
}

const player = new Player()
let aim_line = new Arrow()
// ++++++++++++++++++++++++++++Every Frame+++++++++++++++++++++++++++++++++++++++

window.requestAnimationFrame(animate);

function animate(current_time) {
    
    if (!last_time) last_time = current_time;
    delta_time = (current_time - last_time) / 1000;
    last_time = current_time;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    update_player(delta_time)
    player.draw_player()
    for(let i=arrows.length-1; i>=0; i--) {
        arrows[i].update_arrow(delta_time)
        arrows[i].draw_arrow() 
        if(arrows[i].position.y > canvas.height) {
            arrows.splice(i, 1)
        }
    }
    if (path.length > 1) {
        c.beginPath();
        c.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            c.lineTo(path[i].x, path[i].y);
        }
        c.setLineDash([2, 5]); 
        c.strokeStyle = "gray";
        c.lineWidth = 1;
        c.stroke();
    }
    
    window.requestAnimationFrame(animate);
    
}

function update_player(deltaTime) {
    if (!(player.sides.bottom > canvas.height)) {
        player.position.y += player.velocity * deltaTime;
        player.velocity += player.weight * deltaTime;
    } else {
        player.velocity = 0;
        player.position.y = canvas.height - player.height
    }
    if (keys.isSpace && player.sides.bottom >= canvas.height) {
        path = []
        player.velocity -= player.jump_height
    }
    if (keys.isLeft) {
        path = []
        player.position.x -= player.speed * deltaTime
    }
    if(keys.isRight) {
        path = []
        player.position.x += player.speed * deltaTime
    }
    
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener("click", handle_shot);
canvas.addEventListener("mousemove", draw_aimLine);

function draw_aimLine(event) {   
    path = []
    aim_line = new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2))
    var rect = canvas.getBoundingClientRect();
    //mouse_position.mouse_x = event.clientX - rect.left
    //mouse_position.mouse_y = event.clientY - rect.top
    calculate_flight_angle(event, aim_line)

    for(let i=1; i<50; i++) {
        path.push({x: aim_line.position.x, y: aim_line.position.y})
        aim_line.update_arrow(0.01)
    }

    
    

}
function handle_shot(event) {
    if(timer(500)) {
        arrows.push(new Arrow(player.position.x + (player.width / 2), player.position.y + (player.height / 2)))
        current_arrow = arrows[arrows.length -1]
        calculate_flight_angle(event, current_arrow)
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

function calculate_flight_angle(event, object) {
    var rect = canvas.getBoundingClientRect();
    object.shot.x_mouse_position = event.clientX - rect.left
    object.shot.y_mouse_position = event.clientY - rect.top
    object.shot.x_difference = object.position.x - object.shot.x_mouse_position
    object.shot.y_difference = object.position.y - object.shot.y_mouse_position
    object.shot.x_steps_per_frame = object.shot.x_difference / Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
    object.shot.y_steps_per_frame = object.shot.y_difference / Math.sqrt(object.shot.x_difference ** 2 + object.shot.y_difference ** 2)
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