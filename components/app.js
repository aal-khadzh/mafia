import React, { Component } from 'react';
import RoomCreator from './roomCreator';
import AdminPage from './adminPage';
import UserLogin from './userLogin';
import Layout from './layout';
import AnimatedText from './animatedText';

import { toaster } from 'evergreen-ui';

export default class App extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true };
    return null;
  }

  static getUser(users, name) {
    return users.find(user => user.name === name);
  }

  state = {
    subscribe: false,
    subscribed: false,
    adminFlag: this.props.initialData.admin
      ? this.props.storage.hasOwnProperty('admin')
        ? true
        : false
      : true,
    roomCreated: this.props.storage.hasOwnProperty('admin') ? true : false,
    roomSettings: {},
    usersList: this.props.storage.hasOwnProperty('admin')
      ? this.props.initialData.users
      : [],
    userName: this.props.storage.hasOwnProperty('name')
      ? this.props.storage.getItem('name')
      : '',
    userLogged: this.props.storage.hasOwnProperty('name') ? true : false,
    userData: this.props.storage.hasOwnProperty('name')
      ? App.getUser(
          this.props.initialData.users,
          this.props.storage.getItem('name')
        )
      : {}
  };

  componentDidMount() {
    localStorage.setItem('darkMode', false);
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off('channel', this.handleGameSetUpdates);
    socket.off('reset', this.handleGameReset);
    socket.off('userDisconnected', this.handleUserDisconnection);
    this.setState({ subscribed: false, subscribe: false });
  }

  subscribe = () => {
    const { gameSet, initialData, socket } = this.props;
    const { subscribe, subscribed, userName, userData } = this.state;
    if (subscribe && !subscribed) {
      gameSet.updateGameSet(initialData);
      socket.on('channel', this.handleGameSetUpdates);
      socket.on('reset', this.handleGameReset);
      socket.on('userDisconnected', this.handleUserDisconnection);
      this.setState({ subscribed: true });
      if (userName) {
        gameSet.connectUser(name, socket.id);
        socket.emit('channel', gameSet);
      }
    }
  };

  //Socket

  handleGameSetUpdates = data => {
    const { gameSet, storage } = this.props;
    gameSet.updateGameSet(data);
    this.hydrateState();
    if (storage.getItem('reset')) {
      location.reload(true);
      storage.removeItem('reset');
    }
  };

  handleGameReset = () => {
    const { storage } = this.props;
    Object.keys(storage).forEach(key => storage.removeItem(key));
    storage.setItem('reset', true);
    location.reload(true);
  };

  handleUserDisconnection = id => {
    const { adminFlag } = this.state;
    const { gameSet } = this.props;
    if (adminFlag) {
      gameSet.disconnectUser(id);
      this.hydrateState();
    }
  };

  hydrateState = () => {
    const { gameSet, storage } = this.props;
    const { userName } = this.state;
    if (storage.hasOwnProperty('name')) {
      const user = App.getUser(gameSet.users, userName);
      this.setState({
        userData: user ? user : {}
      });
      localStorage.setItem('darkMode', gameSet.nightMode);
    } else {
      this.setState({ usersList: gameSet.users });
    }
  };

  reset = () => {
    const { socket } = this.props;
    socket.emit('reset');
    this.handleGameReset();
  };

  //Admin

  handleChangePlayersQnt = event => {
    let roomSettings = { ...this.state.roomSettings };
    roomSettings.playersQnt = parseInt(event.target.value);
    this.setState({ roomSettings });
  };
  handleChangeMafiaQnt = event => {
    let roomSettings = { ...this.state.roomSettings };
    roomSettings.mafiaQnt = parseInt(event.target.value);
    this.setState({ roomSettings });
  };
  handleChangeDocFlag = event => {
    let roomSettings = { ...this.state.roomSettings };
    roomSettings.docFlag = event.target.checked;
    this.setState({ roomSettings });
  };
  handleChangeHoeFlag = event => {
    let roomSettings = { ...this.state.roomSettings };
    roomSettings.hoeFlag = event.target.checked;
    this.setState({ roomSettings });
  };
  handleChangeUserName = event => {
    this.setState({ userName: event.target.value });
  };

  createRoom = () => {
    const {
      socket,
      socket: { id },
      gameSet,
      gameSet: { playersQnt, mafiaQnt, docFlag, hoeFlag },
      storage
    } = this.props;
    const { roomSettings } = this.state;
    gameSet.updateGameSet(roomSettings, id);
    if (gameSet.playersQnt > gameSet.roles.length) {
      gameSet.addRoles();
    }
    this.setState({ roomCreated: true }, () => {
      socket.emit('channel', gameSet);
      storage.setItem('admin', id);
      storage.removeItem('reset');
    });
  };

  handleRolesAssignment = () => {
    const { gameSet, socket } = this.props;
    if (gameSet.users.length === gameSet.roles.length) {
      gameSet.assignRoles();
      socket.emit('channel', gameSet);
      this.hydrateState();
    } else {
      toaster.danger('Wait for all citizens to connect');
    }
  };

  handleUserRemoval = userName => {
    const { socket, gameSet } = this.props;
    this.setState({ usersList: gameSet.removeUser(userName) });
    socket.emit('channel', gameSet);
  };

  toggleNigthMode = value => {
    const { socket, gameSet } = this.props;
    gameSet.setNightMode(!value);
    socket.emit('channel', gameSet);
  };

  //User

  logUser = () => {
    const { socket, gameSet, storage } = this.props;
    const { userName } = this.state;
    if (gameSet.validateUser(userName)) {
      const user = gameSet.addUser(userName, socket.id);
      storage.setItem('name', userName);
      socket.emit('channel', gameSet);
      this.setState({
        userLogged: true,
        userData: user
      });
    } else {
      toaster.danger(`There is already one ${userName} in this city`);
    }
  };

  //UI

  animatedTextString() {
    const { gameSet, socket, storage } = this.props;
    const {
      adminFlag,
      roomCreated,
      roomSettings,
      usersList,
      userLogged,
      userName,
      userData
    } = this.state;
    if (adminFlag && !roomCreated) {
      return 'set the mafia';
    } else if (
      adminFlag &&
      roomCreated &&
      gameSet.playersQnt > usersList.length &&
      !gameSet.rolesAssigned
    ) {
      return 'tell your citizens to connect';
    } else if (
      adminFlag &&
      roomCreated &&
      gameSet.playersQnt === usersList.length &&
      !gameSet.rolesAssigned
    ) {
      return 'assign the roles';
    } else if (
      adminFlag &&
      roomCreated &&
      gameSet.playersQnt === usersList.length &&
      gameSet.rolesAssigned
    ) {
      return 'let the mafia begins';
    } else if (!adminFlag && !userLogged && !gameSet.rolesAssigned) {
      return 'tell your name, citizen';
    } else if (
      !adminFlag &&
      userLogged &&
      Object.keys(userData).length !== 0 &&
      !gameSet.rolesAssigned
    ) {
      return `welcome, ${userName}! now wait`;
    } else if (
      !adminFlag &&
      userLogged &&
      gameSet.rolesAssigned &&
      Object.keys(userData).length !== 0 &&
      !gameSet.gameFinished
    ) {
      return `${userName}, you are ${userData.role}`;
    } else if (!adminFlag && userLogged && Object.keys(userData).length === 0) {
      storage.removeItem('name');
      return `${userName}, you will be remembered`;
    } else if (adminFlag && gameSet.rolesAssigned && gameSet.gameStarted) {
      return gameSet.getGameStatus();
    } else if (!adminFlag && userLogged && gameSet.gameFinished) {
      return gameSet.getGameStatus();
    } else {
      return 'mafia is here! run away';
    }
  }

  renderPage() {
    const { gameSet, socket } = this.props;
    const {
      adminFlag,
      roomCreated,
      roomSettings,
      usersList,
      userLogged,
      userName,
      userData
    } = this.state;
    if (adminFlag && !roomCreated) {
      return (
        <RoomCreator
          roomSettings={roomSettings}
          handleChangePlayersQnt={this.handleChangePlayersQnt}
          handleChangeMafiaQnt={this.handleChangeMafiaQnt}
          handleChangeDocFlag={this.handleChangeDocFlag}
          handleChangeHoeFlag={this.handleChangeHoeFlag}
          createRoom={this.createRoom}
        />
      );
    } else if (adminFlag && roomCreated) {
      return (
        <AdminPage
          reset={this.reset}
          handleRolesAssignment={this.handleRolesAssignment}
          usersList={usersList}
          toggleNigthMode={this.toggleNigthMode}
          handleUserRemoval={this.handleUserRemoval}
          gameSet={gameSet}
        />
      );
    } else if (!adminFlag && !userLogged && !gameSet.rolesAssigned) {
      return (
        <UserLogin
          userName={userName}
          handleChangeUserName={this.handleChangeUserName}
          logUser={this.logUser}
        />
      );
    }
  }

  render() {
    const { adminFlag, roomCreated } = this.state;
    return (
      <Layout adminPage={adminFlag && roomCreated}>
        <AnimatedText string={this.animatedTextString()} />
        {this.renderPage()}
      </Layout>
    );
  }
}
