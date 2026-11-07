class Level {
    constructor() {
        this.height = 32    
        this.width = 32

        this.grid_rows = null
        this.grid_cols = null

        this.map = []

        this.position = {
            x: 0,
            y: 0,
        }
    }

    // Source for rgb_to_hex(): https://stackoverflow.com/a/5624139 (by Tim Down CC BY-SA 4.0)
    rgb_to_hex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    build_level_from_template(image, tile_types) {
        // Create a new canvas to draw the level template and read the color values
        let template_canvas = document.createElement('canvas')
        let template_c = template_canvas.getContext('2d')
        let level_template_width = image.naturalWidth
        let level_template_height = image.naturalHeight

        template_canvas.width = level_template_width
        template_canvas.height = level_template_height
        this.grid_cols = level_template_width
        this.grid_rows = level_template_height
        
        template_c.drawImage(image, 0, 0)
        let template_data = template_c.getImageData(0, 0, template_canvas.width, template_canvas.height).data

        // Cycle through every pixel of the level_template and get the color
        for(let i=0; i<template_data.length; i++) {
            let r = template_data[i]
            let g = template_data[i+1]
            let b = template_data[i+2]
            let alpha = template_data[i+3]

            this.map[i/4] = tile_types[this.rgb_to_hex(r,g,b)].identifier
            i += 3
        }
    }
}