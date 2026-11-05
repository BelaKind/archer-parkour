class Level {
    constructor() {
        this.height = 32    
        this.width = 32

        this.grid_rows = level_template.height
        this.grid_cols = level_template.width

        this.map = []

        this.position = {
            x: 0,
            y: 0,
        }
    }
}