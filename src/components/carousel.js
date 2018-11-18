import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'

import Styles from './carousel.module.css'

const Img = props => {
  return (
    <Link
      rel="noopener noreferrer"
      aria-label={`open content`}
      title={props.description}
      to={props.link}
    >
      <img
        src={props.image}
        data-coverflow-index={props.index + 1}
        alt={props.description}
        className={Styles.coverflow__image}
      />
    </Link>
  )
}

class Carousel extends React.Component {
  state = {
    images: [
      {
        src: 'https://placehold.it/500x500.jpg',
        link: 'https://google.com',
        description: 'funny super cat',
      },
      {
        src: 'https://placehold.it/500x500.jpg',
        link: 'https://facebook.com',
        description: 'funny grumpy cat',
      },
      {
        src: 'https://placehold.it/500x500.jpg',
        link: 'https://hs.fi',
        description: 'funny bitter cat',
      },
    ],
    currentPosition: 1,
  }

  componentDidMount() {
    this.getWinners()
  }

  getWinners() {
    if ('data' in this.props) {
      const {
        data: { winners },
      } = this.props

      const parsedWinners = winners.edges.map(({ node }) => {
        return {
          src: node.catPost.image.fixed.src,
          link: `${node.catPost.slug}`,
          description: node.catPost.title,
          position: node.position,
        }
      })

      this.setState({ images: parsedWinners })
    }
  }

  nextSlide = event => {
    const pos = this.state.currentPosition
    if (pos < this.state.images.length) {
      this.setState({ currentPosition: pos + 1 })
    } else {
      this.setState({ currentPosition: 1 })
    }
  }
  previosSlide = event => {
    const pos = this.state.currentPosition
    if (pos > 1) {
      this.setState({ currentPosition: pos - 1 })
    } else {
      this.setState({ currentPosition: this.state.images.length })
    }
  }

  render() {
    return (
      <div id="carousel">
        <div className={Styles.row}>
          <div className="nine columns">
            <div
              data-coverflow-position={this.state.currentPosition}
              className={Styles.coverflow}
            >
              <button
                onClick={this.previosSlide}
                className={Styles.prevArrow}
              />
              {this.state.images.map((image, index) => (
                <Img
                  key={index}
                  link={image.link}
                  image={image.src}
                  description={image.description}
                  index={index}
                />
              ))}
              <button onClick={this.nextSlide} className={Styles.nextArrow} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        winners: allContentfulTopWinners(
          sort: { fields: [position], order: ASC }
        ) {
          edges {
            node {
              position
              catPost {
                title
                slug
                image {
                  id
                  fixed(width: 500, height: 500) {
                    src
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => <Carousel data={data} />}
  />
)
