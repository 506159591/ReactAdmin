import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  ERROR_MESSAGE,
  REMOVE_USER
} from './action-types'
import {
  combineReducers
} from 'redux'
import storageUtils from '../utils/storageUtils'


const initHeadTitle = ''

function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}
const initUser = storageUtils.getUser()

function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    case ERROR_MESSAGE:
      const errMsg = action.data
      return {
        ...state, errMsg
      }
    case REMOVE_USER:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  headTitle,
  user
})