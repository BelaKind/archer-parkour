class AssetsLoader {
    constructor() {
        this.textures = [
            {name: 'regular_sandstone'},
            {name: 'target_v2'},
            {name: 'player'},
            {name: 'arrow'},
            {name: 'menu'},
        ]

        this.fonts = [
            {name: 'PressStart2P-Regular', path: 'assets/fonts/PressStart2P-Regular.ttf'},
        ]

        this.assets = {}
    }

    load_all_assets() {
        let promises = []
        for(let texture of this.textures) {
            this.assets[texture.name] = new Image()
            this.assets[texture.name].src = `assets/${texture.name}.png`
            promises.push(this.assets[texture.name].decode())
        }

        for(let current_font of this.fonts) {
            this.assets[current_font.name] = new FontFace(current_font.name, `url(${current_font.path})`)
            let loaded_font = this.assets[current_font.name].load()
            .then((font) => {
                document.fonts.add(font)
            })
            .catch((error) => {
                console.log(`font loading error: ${error}`)
            })
            promises.push(loaded_font)
        }
        return Promise.all(promises)
    }

    load_level_template(number) {
        this.assets['level_template'] = new Image()
        this.assets['level_template'].src = `assets/levels/level_${number}.png`
        return this.assets['level_template'].decode()
    }
}