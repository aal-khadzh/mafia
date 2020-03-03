export default class GameSet {
  constructor() {
    this.playersQnt;
    this.mafiaQnt;
    this.docFlag;
    this.hoeFlag;
    this.admin = { connected: true };
    this.users = [];
    this.roles = ["m", "s", "c"];
    this.nightMode = false;
    this.rolesAssigned = false;
    this.gameStarted = false;
    this.gameFinished = false;
  }

  updateGameSet(prevGameSet, id) {
    const inputKeys = Object.keys(prevGameSet);
    inputKeys.forEach(key => {
      this[key] = prevGameSet[key];
    });
    if (id) {
      this.admin.id = id;
    }
  }

  //Roles

  addRoles() {
    if (this.docFlag) {
      this.roles.push("d");
    }
    if (this.hoeFlag) {
      this.roles.push("h");
    }
    for (let i = 1; i < this.mafiaQnt; i++) {
      this.roles.push("m");
    }
    for (let i = this.roles.length; i < this.playersQnt; i++) {
      this.roles.push("c");
    }
  }

  assignRoles() {
    const shuffleArray = array => {
      let currentIndex = array.length;
      let temporaryValue, randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };

    this.users = shuffleArray(this.users);
    this.roles = shuffleArray(this.roles);
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].role = this.roles[i];
    }
    this.rolesAssigned = true;
  }

  //Users

  validateUser(name) {
    if (this.users.find(user => user.name === name)) {
      return false;
    } else {
      return true;
    }
  }

  addUser(name, id) {
    if (this.users.length < this.playersQnt) {
      const user = {
        name: name,
        connected: true,
        role: undefined,
        id: id
      };
      this.users.push(user);
      return user;
    }
  }

  connectUser(name, id) {
    const user = this.users.find(user => user.name === name);
    if (user) {
      user.connected = true;
      user.id = id;
    }
  }

  disconnectUser(id) {
    const user = this.users.find(user => user.id === id);
    if (user) {
      user.connected = false;
      user.id = null;
    }
  }

  removeUser(userName) {
    this.users = this.users.filter(user => user.name !== userName);
    if (this.gameStarted) {
      if (
        this.users.length ===
          this.users.filter(user => user.role === "m").length ||
        !this.users.find(user => user.role === "m")
      ) {
        this.gameFinished = true;
      }
    }
    return this.users;
  }

  //Game

  setNightMode(mode) {
    this.nightMode = mode;
    if (!this.gameStarted) {
      this.gameStarted = true;
    }
  }

  getGameStatus() {
    const maf = this.users.filter(pl => pl.role === "m").length;
    const civ = this.users.length - maf;
    if (maf === this.users.length) {
      return "mafia conquered this city";
    } else if (civ === this.users.length) {
      return "civilians got back this city";
    } else {
      return `mafia: ${(maf / this.users.length).toFixed(2) *
        100}% vs civilians: ${(civ / this.users.length).toFixed(2) * 100}%`;
    }
  }
}
