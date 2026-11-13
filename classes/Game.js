class Game {
    constructor() {
        this.level_number = 1
        this.state = 'startMenu'
        this.isMouseLocked = false
        this.current_level = new Level()
        this.current_map = null
    }

    load_level() {
        return assets_loader.load_level_template(this.level_number)
        .then(() => {
          this.current_level.build_level_from_template(assets_loader.assets['level_template'], tile_types)
        })
        
    }

    update_game_state() {
        
        if(player.hitbox.position.y > canvas.height) {
            this.state = 'dead'
        }else if(count_targets() == 0) {
            this.state = 'won'
        }else if(keys.isEsc){
            this.state = 'paused'
        }else if(this.isMouseLocked){
            this.state = 'playing'
        }
        
    }
}
