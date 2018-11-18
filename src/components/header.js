import React from 'react'
import { Link } from 'gatsby'
import Auth from '../utils/auth'

const auth = new Auth()

class Header extends React.Component {
  state = {
    authenticated: false,
  }
  login() {
    auth.login()

    this.setState({
      authenticated: auth.isAuthenticated(),
    })
  }

  logout() {
    auth.logout()

    this.setState({
      authenticated: auth.isAuthenticated(),
    })
  }

  componentDidMount() {
    this.setState({
      authenticated: auth.isAuthenticated(),
    })
  }

  render() {
    return (
      <div
        style={{
          background: 'rebeccapurple',
          marginBottom: '1.45rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0 auto',
            maxWidth: 960,
            padding: '1.45rem 1.0875rem',
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {this.props.siteTitle}
            </Link>
          </h1>
          <p style={{ color: 'white' }}>
            This page is for testing gatsby and it blazing fast speed. <br />{' '}
            All the cute placeholder images are from unsplash using keywords
            "cats"
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: '15px', right: '50px' }}>
          {!this.state.authenticated && (
            <span>
              <a
                href="javascript:void(0)"
                onClick={this.login.bind(this)}
                style={{
                  boxShadow: 'none',
                  lineHeight: '37px',
                  color: 'white',
                }}
              >
                Log In
              </a>
            </span>
          )}
          {this.state.authenticated && (
            <span>
              <a
                href="javascript:void(0)"
                onClick={this.logout.bind(this)}
                style={{
                  boxShadow: 'none',
                  lineHeight: '37px',
                  color: 'white',
                }}
              >
                Log Out
                {auth.getUserName() && <span> ({auth.getUserName()})</span>}
              </a>
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default Header
