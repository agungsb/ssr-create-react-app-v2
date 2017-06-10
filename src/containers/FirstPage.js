import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'
import { Link } from 'react-router-dom'
import './FirstPage.css'

import request from 'superagent';

class FirstPage extends Component {

  // called in the server render, or in cDM
  static fetchData(match) {
    // going to want `match` in here for params, etc.
    return new Promise((resolve, reject) => {
      request.get('https://jsonplaceholder.typicode.com/posts/2').end((err, success) => {
        if (err) {
          reject(err);
        }
        resolve(success.body);
      });
    });
  }

  state = {
    // if this is rendered initially we get data from the server render
    data: this.props.initialData || null
  }

  componentDidMount() {
    // if rendered initially, we already have data from the server
    // but when navigated to in the client, we need to fetch
    if (!this.state.data) {
      this.constructor.fetchData(this.props.match).then(data => {
        this.setState({ data })
      })
    }
    this.props.userActions.tes();
  }

  render() {
    const b64 = this.props.staticContext ? 'wait for it' : window.btoa('wait for it')
    return (
      <div className='bold'>
        <h2>First Page</h2>
        <p>{`Email: ${this.props.user.email}`}</p>
        <p>{`b64: ${b64}`}</p>
        <Link to={'/second'}>Second</Link><br/>
        <p><strong>The text below is a prefetched SSR data:</strong></p>
        {this.state.data &&
          <h2>
            {this.state.data.id} - {this.state.data.title}
          </h2>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstPage)
