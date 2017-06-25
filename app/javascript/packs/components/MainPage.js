import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as RedditActions from '../actions/reddit_actions'
import Picker from './Picker'
import Posts from './Posts'

class MainPage extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit, actions: {fetchPostsIfNeeded} } = this.props
    fetchPostsIfNeeded(selectedSubreddit)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
      const { dispatch, selectedSubreddit, actions: {fetchPostsIfNeeded} } = this.props
      fetchPostsIfNeeded(selectedSubreddit)
    }
  }

  handleChange(nextSubreddit) {
    this.props.actions.selectSubreddit(nextSubreddit)
    this.props.actions.fetchPostsIfNeeded(nextSubreddit)
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedSubreddit,
      actions: {invalidateSubreddit, fetchPostsIfNeeded} } = this.props
    invalidateSubreddit(selectedSubreddit)
    fetchPostsIfNeeded(selectedSubreddit)
  }

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>}
          {!isFetching &&
            <a href="#" onClick={this.handleRefreshClick}>
              Refresh
            </a>}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>}
      </div>
    )
  }
}

MainPage.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { selectedSubreddit, postsBySubreddit } = state.redditReducer
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(RedditActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
