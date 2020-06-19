export const rolesEnum = {
  MAFIA: 'mafia',
  SHERIFF: 'sheriff',
  CIVILIAN: 'civilian',
  DOCTOR: 'doctor',
  PROSTITUTE: 'prostitute'
};

export const addRoles = gameSet => {
  const roles = [rolesEnum.MAFIA, rolesEnum.SHERIFF, rolesEnum.CIVILIAN];
  if (gameSet.doctorFlag) {
    roles.push(rolesEnum.DOCTOR);
  }
  if (gameSet.prostituteFlag) {
    roles.push(rolesEnum.PROSTITUTE);
  }
  for (let i = 1; i < gameSet.mafiaQuantity; i++) {
    roles.push(rolesEnum.MAFIA);
  }
  for (let i = roles.length; i < gameSet.playersQuantity; i++) {
    roles.push(rolesEnum.CIVILIAN);
  }
  return roles;
};

export const assignRoles = gameSet => {
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

  const users = shuffleArray(gameSet.users);
  const roles = shuffleArray(gameSet.roles);
  for (let i = 0; i < users.length; i++) {
    users[i].role = roles[i];
  }
  return users;
};

const getGameStatus = users => {
  const maf = users.filter(pl => pl.role === rolesEnum.MAFIA).length;
  const civ = users.length - maf;
  if (maf === users.length) {
    return 'mafia conquered this city';
  } else if (civ === users.length) {
    return 'civilians got back this city';
  } else {
    return `mafia: ${(maf / users.length).toFixed(2) * 100}% vs civilians: ${(
      civ / users.length
    ).toFixed(2) * 100}%`;
  }
};

export const getAnimatedTextString = gameSet => {
  const {
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
  } = gameSet;
  if (adminFlag && !isRoomCreated) {
    return 'set the mafia';
  } else if (
    adminFlag &&
    isRoomCreated &&
    playersQuantity > users.length &&
    !areRolesAssigned
  ) {
    return 'tell your citizens to connect';
  } else if (
    adminFlag &&
    isRoomCreated &&
    playersQuantity === users.length &&
    !areRolesAssigned
  ) {
    return 'assign the roles';
  } else if (
    adminFlag &&
    isRoomCreated &&
    playersQuantity === users.length &&
    areRolesAssigned
  ) {
    return 'let the mafia begins';
  } else if (
    !adminFlag &&
    !isUserLoggedIn &&
    !areRolesAssigned &&
    playersQuantity > users.length
  ) {
    return 'tell your name, citizen';
  } else if (adminFlag && areRolesAssigned && isStarted) {
    return getGameStatus(users);
  } else if (
    !adminFlag &&
    isUserLoggedIn &&
    Object.keys(userData).length !== 0 &&
    !areRolesAssigned
  ) {
    return `welcome, ${username}! now wait`;
  } else if (
    !adminFlag &&
    isUserLoggedIn &&
    areRolesAssigned &&
    Object.keys(userData).length !== 0 &&
    !isFinished
  ) {
    return `${username}, you are ${userData.role}`;
  } else if (
    !adminFlag &&
    isUserLoggedIn &&
    Object.keys(userData).length === 0
  ) {
    return `${username}, you will be remembered`;
  } else if (!adminFlag && isUserLoggedIn && isFinished) {
    return getGameStatus(users);
  } else {
    return 'mafia is here! run away';
  }
};
