function playing() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1
    c.fillStyle = '#a4e4fc'
    c.fillRect(0, 0, canvas.width, canvas.height)
    load_tilemap()
    player.update_hitbox()
    player.update_player(delta_time.delta_time)
    player.update_hitbox()
    player.draw_player(assets_loader.assets['player'])
    draw_aim_line()
    draw_arrows()
    c.font = '15px "PressStart2P-Regular"'
    c.fillStyle = 'red'
    c.globalAlpha = 1
    c.fillText(`Targets remaining: ${count_targets()}`, 30, 20)
    c.fillText(`Arrows remaining: ${player.arrows_remaining}`, 30, 40)

}

function game_started() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#a4e4fc'
    c.globalAlpha = 0.3
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1
    c.drawImage(assets_loader.assets['menu'], (canvas.width/2)-500, (canvas.height/2)-500, 1000, 1000)
    c.font = '30px PressStart2P-Regular'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#881400'
    c.fillText('Archer Parkour', canvas.width/2, (canvas.height/2)-120)
    c.fillText('START', canvas.width/2, (canvas.height/2)+20)
    c.fillText('Use A/D to move', canvas.width/2, (canvas.height/2)+100)
    c.fillText('space to jump', canvas.width/2, (canvas.height/2)+150)
    c.fillText('Left-click to shoot', canvas.width/2, (canvas.height/2)+200)
}

function game_paused() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1
    c.drawImage(assets_loader.assets['menu'], (canvas.width/2)-500, (canvas.height/2)-500, 1000, 1000)
    c.font = '30px PressStart2P-Regular'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#881400'
    c.fillText('GAME PAUSED', canvas.width/2, (canvas.height/2)-120)
    c.fillText('Click to continue', canvas.width/2, (canvas.height/2)+50)
}

function dead(death_message) {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#a81000'
    c.globalAlpha = 0.3
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1
    c.drawImage(assets_loader.assets['menu'], (canvas.width/2)-500, (canvas.height/2)-500, 1000, 1000)
    c.font = '25px PressStart2P-Regular'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#881400'
    c.fillText(death_message, canvas.width/2, (canvas.height/2)-120)
    c.fillText('Press R to play again', canvas.width/2, (canvas.height/2)+50)
    if(keys.isR) {
        reset_game()
    }
}

function won() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#f8d878'
    c.globalAlpha = 0.3
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1
    c.drawImage(assets_loader.assets['menu'], (canvas.width/2)-500, (canvas.height/2)-500, 1000, 1000)
    c.font = '30px PressStart2P-Regular'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#881400'
    if (game.level_number == 1){
        c.fillText('LEVEL PASSED', canvas.width/2, (canvas.height/2)-120)
        c.fillText('Press R to go to the', canvas.width/2, (canvas.height/2)+50)
        c.fillText('-NEXT LEVEL-', canvas.width/2, (canvas.height/2)+100)
        if(keys.isR) {
            game.level_number += 1
            reset_game()
        }
        
    }else{
        c.fillText('YOU WIN THE GAME', canvas.width/2, (canvas.height/2)-120)
        c.fillText('(more levels soon)', canvas.width/2, (canvas.height/2)+50)
        c.fillText('Press R to play again', canvas.width/2, (canvas.height/2)+100)
        if(keys.isR) {
            game.level_number = 1
            reset_game()
        }
    }
    
}