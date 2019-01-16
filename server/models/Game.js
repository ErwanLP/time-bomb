module.exports = class Game {
  constructor (uuid, name, userId) {
    this.name = name
    this.uuid = uuid
    this.creationDate = new Date()
    this.creator = {
      uuid: userId,
    }
    this.users = []
    this.isStart = false
  }

  addUser (user, socket) {
    socket.join(this.uuid)
    this.users.push({
      id: user.uuid,
      name: user.name,
      socket: socket,
    })

    let typeOfPlayer
    if (this.creator.uuid === user.uuid) {
      this.creator.socket = socket
      typeOfPlayer = 'admin'
    } else {
      typeOfPlayer = 'player'
    }
    socket.emit('join_game_success', 'Success to connect to lobby as ' +
      typeOfPlayer)
  }

  startGame () {
    return new Promise((resolve, reject) => {
      if (this.isStart === false) {
        this.isStart = true
        resolve()
      } else {
        reject()
      }
    })
  }


}