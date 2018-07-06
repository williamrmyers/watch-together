class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser(id) {
    let users = this.users.filter((user) => {
      return user.id === id;
    });
    return users[0]
  }
  getUserList(room) {
    let users = this.users.filter((user) => {
      return user.room === room;
    });

    let namesArray = users.map((user) => {
      return user.name;
    });
    return namesArray;
  }
}

module.exports = {Users};
