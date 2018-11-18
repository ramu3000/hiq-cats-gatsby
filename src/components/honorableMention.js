import React from 'react'
import honorableMentionStyles from './honorableMention.module.css'
import { StaticQuery, graphql, Link } from 'gatsby'
import Img from 'gatsby-image'

const HonorableMention = ({ data }) => {
  const renderPlaceHolderImages = () => {
    if (!('honours' in data)) {
      return null
    }

    const images = data.honours.edges[0].node.honour.map((honour, index) => (
      <Link
        key={index}
        style={{
          marginBottom: '25px',
          minWidth: '30%',
          maxWidth: '400px',
          flex: '1',
          maxHeight: '400px',
        }}
        to={honour.slug}
      >
        <Img fixed={honour.image.fixed} />
      </Link>
    ))
    return images
  }

  return (
    <div>
      <h3>
        Honorable Mention
        <span role="img" aria-label="balloon">
          🎈
        </span>
      </h3>
      <div className={honorableMentionStyles.flexShow}>
        {renderPlaceHolderImages()}
      </div>
    </div>
  )
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        honours: allContentfulHonorableMentions {
          edges {
            node {
              honour {
                title
                slug
                image {
                  fixed(width: 400, height: 400) {
                    ...GatsbyContentfulFixed_noBase64
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => <HonorableMention data={data} />}
  />
)
