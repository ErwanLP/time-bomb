module.exports = class User {
  constructor(uuid, name) {
    this.name = name;
    this.uuid = uuid;
    this.socket = null;
    this.connectionDate = null;
  }

  setSocket(socket) {
    this.socket = socket;
    this.connectionDate = new Date();
  }

  setFakeSocket() {
    this.socket = {
      emit: () => {},
    };
  }

  stringify() {
    return JSON.stringify({
      name: this.name,
      uuid: this.uuid,
      connectionDate: this.connectionDate
    });
  }

};