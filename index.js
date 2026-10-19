const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height);

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
let velocity = 0
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
}



//Movement

document.addEventListener('keydown', (event) => {
    if (player.sides.bottom >= canvas.height) {
        jump(event);
    }
});

function jump(event) {
    if (event.code == 'Space') {
        velocity=-18
        if (player.sides.bottom >= canvas.height) {
            player.position.y = canvas.height - player.height
        }
    }
}

