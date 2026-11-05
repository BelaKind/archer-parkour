class AssetsLoader {
    constructor() {
        this.textures = [
            {name: 'regular_sandstone', path: null},
            {name: 'target_v2', path: null},
            {name: 'player', path: null},
            {name: 'arrow', path: null},
            {name: 'menu', path: null},
        ]

        this.images = {}
    }

    load_all_textures() {
        promises = []
        for(let texture of this.textures) {
            this.images[texture.name] = new Image()
            this.images[texture.name].src = `assets/${texture.name}.png`
            this.promises.push(this.images[texture.name].decode())
        }
        return Promise.all(promises)
    }
}