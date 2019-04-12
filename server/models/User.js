module.exports = class User {
  constructor(uuid, name) {
    this.name = name;
    this.uuid = uuid;
    this.socket = null;
    this.connectionDate = null;
    this.createdDate = new Date();
  }

  setActive() {
    this.connectionDate = new Date();
  }

  setInactive() {
    this.connectionDate = null;
  }

  isActive() {
    return this.connectionDate !== null;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  stringify() {
    return JSON.stringify({
      name: this.name,
      uuid: this.uuid
    });
  }

};