/**
 *      user store
 */

import AppDispatcher from '../dispatcher/app-dispatcher';
import UserConstants from '../constants/user-constants';
import Store from './store';
import MockUsers from '../spec/fixtures/mock-user-data';
import Crud from '../../lib/crud';

class UserStore extends Store {
  constructor(props) {
    super(props);

    this.db = new Crud();

    this.mock = false;

    this.users = [];
    this.currentUser = null;
  }

  useMockData() {
    this.mock = true;
    this.users = MockUsers;
    this.currentUser = this.users[0];
  }

  getUsers(params = {}) {

    return new Promise((resolve, reject) => {
      if (this.mock) {
        resolve(MockUsers);
      } else {
        this.db.get('task', params)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

}

let userStoreInstance = new UserStore();

userStoreInstance.dispatchToken = AppDispatcher.register(action => {
  switch (action.actionType) {
    case UserConstants.ADD_TASK:
      userStoreInstance.db.post('user', action.data)
        .then(() => {
          userStoreInstance.emitChange();
        });
      break;
    case UserConstants.REMOVE_TASK:
      userStoreInstance.db.delete(`user/${action.data}`)
        .then(() => {
          userStoreInstance.emitChange();
        });
      break;
    case UserConstants.UPDATE_TASK:
      userStoreInstance.db.update(`user/${action.id}`, action.data)
        .then(() => {
          userStoreInstance.emitChange();
        });
      break;
    default:
    // no op
  }
});

export default userStoreInstance;
