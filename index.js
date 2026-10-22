const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);
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
            speed_multiplier: 700,
        }

        this.width = 20
        this.height = 20
        this.weight = 0.001

    }
    draw_arrow() {
        c.fillStyle = 'blue'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update_arrow(deltaTime) {
        this.position.x += (this.shot.x_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.position.y += (this.shot.y_steps_per_frame * this.shot.speed_multiplier) * deltaTime
        this.shot.y_steps_per_frame += this.weight
        console.log(this.shot.y_steps_per_frame)
    }
}

const player = new Player()

// ++++++++++++++++++++++++++++Every Frame+++++++++++++++++++++++++++++++++++++++

window.requestAnimationFrame(animate);

function animate(current_time) {
    if (!last_time) last_time = current_time;
    const delta_time = (current_time - last_time) / 1000;
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
        player.velocity -= player.jump_height
    }
    if (keys.isLeft) {
        player.position.x -= player.speed * deltaTime
    }
    if(keys.isRight) {
        player.position.x += player.speed * deltaTime
    }
    
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement
canvas.addEventListener("click", get_mouse_position);

function get_mouse_position(event) {
    var rect = canvas.getBoundingClientRect();
    time.elapsedTime = performance.now()
    if(time.elapsedTime - time.startTime > time.interval) {
        arrows.push(new Arrow(player.position.x, player.position.y))
        time.startTime = time.elapsedTime
        current_arrow = arrows[arrows.length -1]
        current_arrow.shot.x_mouse_position = event.clientX - rect.left
        current_arrow.shot.y_mouse_position = event.clientY - rect.top
        current_arrow.shot.x_difference = player.position.x - current_arrow.shot.x_mouse_position
        current_arrow.shot.y_difference = player.position.y - current_arrow.shot.y_mouse_position
        current_arrow.shot.x_steps_per_frame = current_arrow.shot.x_difference / Math.sqrt(current_arrow.shot.x_difference ** 2 + current_arrow.shot.y_difference ** 2)
        current_arrow.shot.y_steps_per_frame = current_arrow.shot.y_difference / Math.sqrt(current_arrow.shot.x_difference ** 2 + current_arrow.shot.y_difference ** 2)
        console.log(current_arrow.shot.x_steps_per_frame)
        console.log(current_arrow.shot.y_steps_per_frame)
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
