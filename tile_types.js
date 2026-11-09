// The 'texture' strings have to match the file names excluding the suffix
const tile_types = {
    '#000000': {texture: null, solid: false, identifier: 0},
    '#f8b800': {texture: 'regular_sandstone', solid: true, identifier: 1},
    '#503000': {texture: 'wall', solid: true, identifier: 2},
    '#fca044': {texture: 'building_sandstone', solid: false, identifier: 3},
    '#7c7c7c': {texture: 'stair', solid: true, identifier: 4},
    '#f83800': {texture: 'target', solid: false, identifier: 5},
}

// Create a list to search by the identifier which is used in the map array
const tile_list = {}

for(let color of Object.keys(tile_types)) {
    tile_list[tile_types[color].identifier] = {texture: tile_types[color].texture, solid: tile_types[color].solid, color: color}
}
