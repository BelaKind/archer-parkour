// The 'texture' strings have to match the file names excluding the suffix
const tile_types = {
    '#000000': {texture: null, player_solid: false, arrow_solid: false, identifier: 0},
    '#f8b800': {texture: 'regular_sandstone', player_solid: true, arrow_solid: true, identifier: 1},
    '#503000': {texture: 'wall', player_solid: true, arrow_solid: true, identifier: 2},
    '#fca044': {texture: 'building_sandstone', player_solid: false, arrow_solid: true, identifier: 3},
    '#7c7c7c': {texture: 'stair', player_solid: true, arrow_solid: true, identifier: 4},
    '#004058': {texture: 'stair_left', player_solid: true, arrow_solid: true, identifier: 5},
    '#f83800': {texture: 'target', player_solid: false, arrow_solid: true, identifier: 6},
    '#4428bc': {texture: 'portal', player_solid: false, arrow_solid: true, identifier: 7},
}

// Create a list to search by the identifier which is used in the map array
const tile_list = {}

for(let color of Object.keys(tile_types)) {
    tile_list[tile_types[color].identifier] = {texture: tile_types[color].texture, player_solid: tile_types[color].player_solid, arrow_solid: tile_types[color].arrow_solid, color: color}
}
