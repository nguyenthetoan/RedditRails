import RedditAPIUtil from '../utils/reddit_api_util';
import request from 'superagent'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const selectSubreddit = (subreddit) => ({
  type: SELECT_SUBREDDIT,
  subreddit
})

export const invalidateSubreddit = (subreddit) => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit
})

const requestPosts = (subreddit) => ({
  type: REQUEST_POSTS,
  subreddit
})

const receivePosts = (subreddit, posts) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: posts.map(child => child.data),
  receivedAt: Date.now()
})

const fetchPosts = (subreddit) => dispatch => {
  RedditAPIUtil.fetchSubReddit(subreddit)
    .then(response => {
      dispatch(requestPosts(response))
    })
}

const shouldFetchPosts = (state, subreddit) => {
  const { redditReducer } = state
  const posts = redditReducer.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export const fetchPostsIfNeeded = (subreddit) => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}
