import request from 'superagent';

const RedditAPIUtil = {
  fetchSubReddit: (subreddit) => {
    return request
      .get(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => {
        return response.body.data.children
      })
  }
}

Object.freeze(RedditAPIUtil)
export default RedditAPIUtil
