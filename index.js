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

        this.weight = 0.5
        
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
let gravity = 1
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

function update_player (){
    if (!(player.sides.bottom >= canvas.height)) {
        player.position.y += gravity
        gravity+=0.4
    }else{
        document.addEventListener('keydown', (event) => {
            if (event.code == 'Space') {
                gravity=0
                console.log("space")
                for (let i; i<5; i++) {
                    player.position.y += 5
                }
            }
        });
    }
     
    
}

