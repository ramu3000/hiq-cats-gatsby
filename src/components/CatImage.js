import React, { Component } from 'react'
import styled from 'react-emotion'

const Container = styled('div')`
  position: relative;
  width: 400px;
  overflow: hidden;

  &:hover {
    button {
      display: block;
      transform: translateY(20px);
      opacity: 0.7;
    }
  }
  button {
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: 10px;
    opacity: 0;
    transition: 0.5s ease-in-out;
  }
`

export default class CatImage extends Component {
  state = {
    showIcon: false,
    hasVoted: false,
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (prevProps.voted !== this.props.voted) {
      this.setState({ hasVoted: this.props.voted })
    }
  }
  onHover = event => {
    this.setState({ showIcon: true })
  }
  onHoverOut = event => {
    this.setState({ showIcon: false })
  }
  onHandleVote = () => {
    if (!this.props.isAuthenticated) {
      alert('you need to login for voting')
      return
    }
    if (this.state.hasVoted) {
      this.setState({ hasVoted: false })
      this.props.removeVote(this.props.id)
    } else {
      this.setState({ hasVoted: true })
      this.props.addVote(this.props.id)
    }
  }

  render() {
    if (!this.props && !this.props.image) {
      console.error('no image provided')
      return null
    }
    let count = 0
    if (this.props.count) {
      count = this.props.count
    }
    return (
      <Container onMouseEnter={this.onHover} onMouseLeave={this.onHoverOut}>
        {
          <h5
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(240,240,240,0.7)',
              padding: '15px',
              borderBottomRightRadius: '20px',
            }}
          >
            {this.props.title} - votes <b>{count} </b>
          </h5>
        }
        {<img src={this.props.image} />}
        <button
          onClick={this.onHandleVote}
          style={{
            backgroundColor: this.state.hasVoted ? 'yellow' : '',
          }}
        >
          💎
        </button>
      </Container>
    )
  }
}
