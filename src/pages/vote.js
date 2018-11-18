import React, { Component } from 'react'
import { graphql } from 'gatsby'
import styled from 'react-emotion'

import Layout from '../components/layout'
import CatImage from '../components/CatImage'

import Auth from '../utils/auth'
import firebase from '../utils/firebase'

const auth = new Auth()

const LoginBox = styled('div')`
  border: 2px solid yellow;
  width: 500px;
  margin: 0 auto;
  padding: 30px;
  margin-bottom: 50px;
`

export default class Vote extends Component {
  state = {
    votes: [],
    catPosts: [],
    authenticated: false,
    userVotes: [],
  }

  constructor() {
    super()
  }

  componentDidMount() {
    const { edges: catPosts } = this.props.data.catPosts
    this.setState({ catPosts, authenticated: auth.isAuthenticated() })
    this.getVotes()
    this.getUserVotes()
    firebase.onSubscribe(this.onCollectionUpdate)
  }
  componentWillUnmount() {
    firebase.onUnsubscribe()
  }

  onCollectionUpdate = querySnapshot => {
    const votes = []
    querySnapshot.forEach(doc => {
      const { count } = doc.data()
      votes.push({
        id: doc.id, // Document ID
        count,
      })
    })
    this.setState({ votes })
  }

  async getUserVotes() {
    if (auth.isAuthenticated()) {
      const doc = await firebase.getUserVotes(auth.getUser().sub)
      const data = doc.data()
      if (!data || !data.hasOwnProperty('catpostids')) {
        return
      }
      const { catpostids } = data

      this.setState({ userVotes: catpostids })
    }
  }

  async getVotes() {
    const data = await firebase.getVotes()
    this.setState({ votes: data })
  }

  login = () => {
    auth.login()

    this.setState({
      authenticated: auth.isAuthenticated(),
    })
  }

  addVote = id => {
    if (!auth.isAuthenticated()) {
      alert('you need to be logged in')
      return
    }
    const userid = auth.getUser().sub

    let count = null
    const votes = this.state.votes.map(vote => {
      if (vote.id === id) {
        count = vote.count + 1
        return { id, count: +vote.count + 1 }
      } else {
        return vote
      }
    })
    if (!count) {
      count = 1
      votes.push({ id, count: 1 })
    }

    const userVotes =
      this.state.userVotes === 0 ? [id] : [id, ...this.state.userVotes]
    /* update votes */
    this.setState({
      userVotes,
    })
    firebase.setVotes(id, count)
    firebase.setUserVote(userid, userVotes)
  }

  removeVote = id => {
    if (!auth.isAuthenticated()) {
      alert('you need to be logged in')
      return
    }
    const userid = auth.getUser().sub
    let count = null
    const filteredVotes = this.state.votes.map(vote => {
      if (vote.id === id) {
        count = +vote.count - 1
        return { id, count: +vote.count - 1 }
      }
      return vote
    })
    if (!count) {
      count = 0
    }
    const userVotes = this.state.userVotes.filter(userVote => userVote !== id)

    this.setState({ userVotes })
    firebase.setVotes(id, count)
    firebase.setUserVote(userid, userVotes)
  }

  showCatPosts() {
    return this.state.catPosts.map(({ node }) => {
      //looping trough firebase uservotes, if it finds from array it will return true
      const hasVoted = this.state.userVotes.includes(node.id)
      let count = 0
      const vote = this.state.votes.find(vote => vote.id === node.id)
      if (vote) {
        count = vote.count
      }
      return (
        <CatImage
          key={node.id}
          addVote={this.addVote}
          removeVote={this.removeVote}
          image={node.image.fixed.src}
          title={node.title}
          id={node.id}
          voted={hasVoted}
          count={count}
          isAuthenticated={this.state.authenticated}
        />
      )
    })
  }

  render() {
    return (
      <Layout>
        <h2>Vote for your cuties</h2>
        {this.state.authenticated ? null : (
          <LoginBox>
            <p>You need logged in for voting</p>
            <button onClick={this.login}>Login here</button>
          </LoginBox>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.showCatPosts()}
        </div>
      </Layout>
    )
  }
}

export const query = graphql`
  query {
    catPosts: allContentfulCatPosts {
      edges {
        node {
          id
          title
          image {
            fixed(width: 400, height: 300) {
              aspectRatio
              width
              height
              src
            }
          }
        }
      }
    }
  }
`
