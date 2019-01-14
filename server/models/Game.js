module.exports = class Game {
  constructor (uuid, name) {
    this.name = name
    this.uuid = uuid
    this.creationDate = new Date()
    this.users = []
  }

  addUser (user) {
    this.users.push(user)
  }
}