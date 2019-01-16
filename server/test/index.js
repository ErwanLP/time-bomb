const Game = require('./../models/Game')
const log = console.log
const NOP = () => {}

let g = new Game(0, 'name', 0)

let nbOfPlayer = 4
for (let i = 0; i < nbOfPlayer; i++) {
  g.addUser({uuid: i, name: 'player_' + i}, {emit: log, join: NOP})
}

g.startGame()

log(JSON.stringify(g.users))
