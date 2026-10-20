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
    isShot: false,
}

class Player {
    constructor() {
        this.position = {    
            x: 100,
            y: 100,
        }
        this.width = 100
        this.height = 100
        this.weight = 0.6
        this.velocity = 0
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

        this.width = 20
        this.height = 20

        this.weight = 0.05
        this.velocity = 0
    }
    draw_arrow() {
        c.fillStyle = 'blue'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update_arrow() {
        this.position.x += 14
        this.position.y += this.velocity
        this.velocity += this.weight
    }
}

const player = new Player()

// ++++++++++++++++++++++++++++Every Frame+++++++++++++++++++++++++++++++++++++++

window.requestAnimationFrame(animate);

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw_player()
    update_player()
    for(let i=0; i<arrows.length; i++) {
        arrows[i].update_arrow()
        arrows[i].draw_arrow() 
        if(arrows[i].position.x > canvas.width + arrows[i].width) {
            arrows.splice(i, 1)
        }
    }
    window.requestAnimationFrame(animate);
}

function update_player() {
    if (!(player.sides.bottom > canvas.height)) {
        player.position.y += player.velocity;
        player.velocity += player.weight;
    } else {
        player.velocity = 0;
        player.position.y = canvas.height - player.height
    }
    if (keys.isSpace && player.sides.bottom >= canvas.height) {
        player.velocity -= 18
    }
    if (keys.isLeft) {
        player.position.x -= 5
    }
    if(keys.isRight) {
        player.position.x += 5
    }
    
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Movement

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
    
    if(event.code == 'Enter') {
        arrows.push(new Arrow(player.position.x, player.position.y))        
    }
}
