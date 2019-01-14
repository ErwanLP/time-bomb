module.exports = class User {
  constructor (uuid, name) {
    this.name = name
    this.uuid = uuid
    this.creationDate = new Date()
  }
}