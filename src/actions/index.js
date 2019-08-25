import * as actionTypes from './types';

/* User Actions */
export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: {
    currentUser: user,
  },
});

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
});

/* Channel Actions */
export const setCurrentChannel = (channel) => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  },
});

export const setPrivateChannel = (isPrivateCahnnel) => ({
  type: actionTypes.SET_PRIVATE_CHANNEL,
  payload: {
    isPrivateCahnnel,
  },
});
