import { combineReducers } from 'redux';
import helloReducer from './hello_reducer.js';
import redditReducer from './reddit_reducers';

export default combineReducers({
  helloReducer,
  redditReducer
})
