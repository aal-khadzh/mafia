import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RoomCreator from './roomCreator';
import AdminPage from './adminPage';
import UserLogin from './userLogin';
import Layout from './layout';
import AnimatedText from './animatedText';

import { ColorModeContext } from '../pages/index';
import { addRoles, assignRoles, rolesEnum } from '../utils/gameset';

import { toaster } from 'evergreen-ui';

const MINIMAL_PLAYERS_QUANTITY = 3;

export default class App extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true };
    return null;
  }

  static contextType = ColorModeContext;

  state = {
    //socket
    subscribe: false,
    subscribed: false,
    //roomSettings
    playersQuantity: this.props.initialData.playersQuantity || 0,
    mafiaQuantity: this.props.initialData.mafiaQuantity || 0,
    doctorFlag: this.props.initialData.doctorFlag || false,
    prostituteFlag: this.props.initialData.prostituteFlag || false,
    //gameFlags
    areRolesAssigned: this.props.initialData.areRolesAssigned || false,
    isRoomCreated: this.props.initialData.isRoomCreated || false,
    isNight: this.props.initialData.isNight || false,
    isStarted: this.props.initialData.isStarted || false,
    isFinished: this.props.initialData.isFinished || false,
    //admin
    adminFlag: this.props.initialData.adminId
      ? this.props.storage.hasOwnProperty('admin')
        ? true
        : false
      : true,
    users: this.props.initialData.users || [],
    //user
    isUserLoggedIn: this.props.storage.hasOwnProperty('name') ? true : false,
    username: this.props.storage.getItem('name') || '',
    userData: this.props.storage.hasOwnProperty('name')
      ? this.props.initialData.users.find(
          user => user.name === this.props.storage.getItem('name')
        )
      : {}
  };

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    const { socket, storage } = this.props;
    const {
      playersQuantity,
      mafiaQuantity,
      doctorFlag,
      prostituteFlag,
      isRoomCreated,
      areRolesAssigned,
      users,
      isNight,
      isStarted,
      isFinished,
      userData,
      adminFlag
    } = this.state;
    const { toggleColorMode } = this.context;
    if (adminFlag) {
      if (
        prevState.isRoomCreated !== isRoomCreated &&
        storage.hasOwnProperty('admin')
      ) {
        socket.emit('channel', {
          isRoomCreated,
          adminId: storage.getItem('admin'),
          users,
          playersQuantity,
          mafiaQuantity,
          doctorFlag,
          prostituteFlag
        });
      }
      if (prevState.areRolesAssigned !== areRolesAssigned) {
        socket.emit('channel', { areRolesAssigned, users });
      }
      if (prevState.isFinished !== isFinished) {
        socket.emit('channel', { isFinished });
      }
      if (prevState.users.length > users.length) {
        socket.emit('channel', { users });
      }
    } else {
      if (
        JSON.stringify(prevState.userData) !== JSON.stringify(userData) &&
        Object.keys(userData).length
      ) {
        socket.emit('user', userData);
      }
      if (prevState.userData !== userData && !Object.keys(userData).length) {
        storage.removeItem('name');
        socket.off('channel', this.handleGameSetUpdates);
      }
      if (prevState.users !== users && storage.hasOwnProperty('name')) {
        this.updateUser(prevState.users);
      }
    }
    if (prevState.isNight !== isNight) {
      toggleColorMode();
      if (adminFlag) {
        socket.emit('channel', { isNight, isStarted });
      }
    }
    this.subscribe();
  }

  componentWillUnmount() {
    const { adminFlag } = this.state;
    const { socket } = this.props;
    if (adminFlag) {
      socket.off('userDisconnected', this.handleUserDisconnection);
    }
    socket.off('user', this.handleUserUpdates);
    socket.off('channel', this.handleGameSetUpdates);
    socket.off('reset', this.handleGameReset);
    this.setState({ subscribed: false, subscribe: false });
  }

  subscribe = () => {
    const { socket } = this.props;
    const { subscribe, subscribed, username, adminFlag } = this.state;
    if (subscribe && !subscribed) {
      if (adminFlag) {
        socket.on('userDisconnected', this.handleUserDisconnection);
      }
      socket.on('user', this.handleUserUpdates);
      socket.on('channel', this.handleGameSetUpdates);
      socket.on('reset', this.handleGameReset);
      this.setState({ subscribed: true });
      if (username) {
        if (socket.connected) {
          // dev env
          this.reconnectUser(socket.id);
        } else {
          // prod env
          socket.on('connect', () => {
            this.reconnectUser(socket.id);
          });
        }
      }
    }
  };

  //Socket

  handleGameSetUpdates = data => {
    const { storage } = this.props;
    const inputKeys = Object.keys(data);
    inputKeys.forEach(key => {
      if (key === 'adminId' && data.adminId !== storage.getItem('admin')) {
        location.reload(true);
      }
      this.setState({ [key]: data[key] });
    });
    if (storage.getItem('reset')) {
      location.reload(true);
      storage.removeItem('reset');
    }
  };

  handleUserUpdates = userData => {
    const { users } = this.state;
    let usersUpdate;
    const connectedUsers = users.map(user => user.name);
    if (connectedUsers.includes(userData.name)) {
      usersUpdate = users.map(user => {
        if (user.name === userData.name) {
          return userData;
        }
        return user;
      });
    } else {
      usersUpdate = users.concat(userData);
    }
    this.setState({ users: usersUpdate });
  };

  handleGameReset = () => {
    const { storage } = this.props;
    Object.keys(storage).forEach(key => storage.removeItem(key));
    storage.setItem('reset', true);
    location.reload(true);
  };

  handleUserDisconnection = id => {
    const { users } = this.state;
    const usersUpdate = users.map(user => {
      if (user.id === id) {
        user.isConnected = false;
        user.id = undefined;
        return user;
      }
      return user;
    });
    this.setState({ users: usersUpdate });
  };

  //Admin

  handleChangePlayersQnt = event => {
    this.setState({ playersQuantity: parseInt(event.target.value) });
  };
  handleChangeMafiaQnt = event => {
    this.setState({ mafiaQuantity: parseInt(event.target.value) });
  };
  handleChangeDocFlag = event => {
    this.setState({ doctorFlag: event.target.checked });
  };
  handleChangeHoeFlag = event => {
    this.setState({ prostituteFlag: event.target.checked });
  };

  createRoom = () => {
    const { socket, storage } = this.props;
    const { playersQuantity } = this.state;
    if (playersQuantity >= MINIMAL_PLAYERS_QUANTITY) {
      this.setState({
        isRoomCreated: true
      });
    } else {
      toaster.danger('Find more citizens to play');
    }
    storage.setItem('admin', socket.id);
    storage.removeItem('reset');
  };

  handleRolesAssignment = () => {
    const {
      users,
      playersQuantity,
      mafiaQuantity,
      doctorFlag,
      prostituteFlag
    } = this.state;
    const roles = addRoles({
      playersQuantity,
      mafiaQuantity,
      doctorFlag,
      prostituteFlag
    });
    if (users.length === roles.length) {
      this.setState({
        users: assignRoles({ users, roles }),
        areRolesAssigned: true
      });
    } else {
      toaster.danger('Wait for all citizens to connect');
    }
  };

  removeUser = username => {
    const { users, isStarted } = this.state;
    const usersUpdate = users.filter(user => user.name !== username);
    const activeMafiaQnt = usersUpdate.filter(
      user => user.role === rolesEnum.MAFIA
    ).length;
    if (isStarted) {
      if (usersUpdate.length === activeMafiaQnt || !activeMafiaQnt) {
        this.setState({ isFinished: true });
      }
    }
    this.setState({ users: usersUpdate });
  };

  toggleNigthMode = value => {
    this.setState(prevState => ({
      isNight: !value,
      isStarted: prevState.isStarted ? prevState.isStarted : true
    }));
  };

  resetGame = () => {
    const { socket } = this.props;
    socket.emit('reset');
    this.handleGameReset();
  };

  //User

  handleChangeUserName = event => {
    this.setState({ username: event.target.value });
  };

  handleUserLogIn = () => {
    const { socket, storage } = this.props;
    const { username, users } = this.state;
    if (users.find(user => user.name === username)) {
      toaster.danger(`There is already one ${username} in this city`);
    } else {
      const user = {
        name: username,
        isConnected: true,
        role: undefined,
        id: socket.id
      };
      const usersUpdate = users.concat(user);
      this.setState({
        users: usersUpdate,
        isUserLoggedIn: true,
        userData: user
      });
      storage.setItem('name', username);
    }
  };

  updateUser = outdatedUsers => {
    const { username, users } = this.state;
    const updatedUser = users.find(user => user.name === username);
    const outdatedUser = outdatedUsers.find(user => user.name === username);
    if (updatedUser !== outdatedUser) {
      this.setState({ userData: updatedUser ? updatedUser : {} });
    }
  };

  reconnectUser = id => {
    const { userData } = this.state;
    const userUpdate = { ...userData };
    userUpdate.isConnected = true;
    userUpdate.id = id;
    this.setState({ userData: userUpdate });
  };

  render() {
    const {
      adminFlag,
      isRoomCreated,
      users,
      isUserLoggedIn,
      username,
      areRolesAssigned,
      userData,
      playersQuantity,
      mafiaQuantity,
      doctorFlag,
      prostituteFlag,
      isStarted,
      isFinished
    } = this.state;
    return (
      <Layout>
        <AnimatedText
          gameSet={{
            adminFlag,
            isRoomCreated,
            users,
            isUserLoggedIn,
            username,
            userData,
            playersQuantity,
            areRolesAssigned,
            isStarted,
            isFinished
          }}
        />
        {adminFlag && !isRoomCreated && (
          <RoomCreator
            roomSettings={{
              playersQuantity,
              mafiaQuantity,
              doctorFlag,
              prostituteFlag
            }}
            onChangePlayersQnt={this.handleChangePlayersQnt}
            onChangeMafiaQnt={this.handleChangeMafiaQnt}
            onChangeDocFlag={this.handleChangeDocFlag}
            onChangeHoeFlag={this.handleChangeHoeFlag}
            createRoom={this.createRoom}
          />
        )}
        {adminFlag && isRoomCreated && (
          <AdminPage
            onGameReset={this.resetGame}
            onRolesAssignment={this.handleRolesAssignment}
            users={users}
            toggleNigthMode={this.toggleNigthMode}
            onUserRemoval={this.removeUser}
            isFinished={isFinished}
            areRolesAssigned={areRolesAssigned}
          />
        )}
        {!adminFlag &&
          !isUserLoggedIn &&
          !areRolesAssigned &&
          playersQuantity > users.length && (
            <UserLogin
              username={username}
              onChangeUserName={this.handleChangeUserName}
              onUserLogIn={this.handleUserLogIn}
            />
          )}
      </Layout>
    );
  }
}

App.propTypes = {
  socket: PropTypes.any,
  storage: PropTypes.any,
  initialData: PropTypes.object
};
