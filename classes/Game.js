class Game {
    constructor() {
        this.state = null
        this.current_map = first_level.map
        this.isMouseLocked = false
    }

    update_game_state() {
        if(player.position.y > canvas.height) {
            this.state = 'dead'
        }else if(count_targets() == 0) {
            this.state = 'won'
        }else if(keys.isEsc){
            this.state = 'paused'
        }else{
            this.state = 'playing'
        }
        
    }
}
const game = new Game()