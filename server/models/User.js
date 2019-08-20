const uuidv4 = require('uuid/v4');

module.exports = class User {
  constructor(name) {
    this.name = name;
    this.uuid = uuidv4();
    this.socket = null;
    this.connectionDate = null;
  }

  setSocket(socket) {
    this.socket = socket;
    this.connectionDate = new Date();
  }

  setFakeSocket() {
    this.socket = {
      emit: () => {
      },
    };
  }

  stringify() {
    return JSON.stringify({
      name: this.name,
      uuid: this.uuid,
      connectionDate: this.connectionDate,
      connected: this.socket ? this.socket.connected : false,
    });
  }

  json() {
    return ({
      name: this.name,
      uuid: this.uuid,
      connectionDate: this.connectionDate,
      connected: this.socket ? this.socket.connected : false,
    });
  }

};