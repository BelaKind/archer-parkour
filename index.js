const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);
let velocity = 0
const keys = {
    isLeft: false,
    isRight: false,
    isSpace: false,
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

const player = new Player()
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw_player()
    update_player()
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);



function update_player() {
    if (!(player.sides.bottom > canvas.height)) {
        player.position.y += velocity;
        velocity += player.weight;
    } else {
        velocity = 0; 
    }

    if (keys.isLeft) {
        player.position.x -= 5
    }
    if(keys.isRight) {
        player.position.x += 5
    }
}



//Movement

document.addEventListener('keydown', (event) => {
    movement(event);
});
document.addEventListener('keyup', (event) => {
    movement(event);
});

function movement(event) {
    if (event.code == 'Space') {
        if (event.type == 'keydown') {
            if (player.sides.bottom >= canvas.height) {
                velocity=-18
            }
            if (player.sides.bottom >= canvas.height) {
                player.position.y = canvas.height - player.height
            }
        }else{
            return
        }
        
    }

    if(event.code == 'KeyA' || event.code == 'ArrowLeft') {
        if (event.type == "keydown") {
            keys.isLeft = true
        }else{
            keys.isLeft = false
        }
    }

    if(event.code == 'KeyD' || event.code == 'ArrowRight') {
        if (event.type == "keydown") {
            keys.isRight = true
        }else{
            keys.isRight = false
        }
    }                                      
}