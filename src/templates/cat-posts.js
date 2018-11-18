import React from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import Layout from '../components/layout'

const catPosts = ({ data }) => {
  const {
    node: {
      title,
      content,
      image: { fluid: image },
    },
  } = data.allContentfulCatPosts.edges[0]

  let description = 'no description available'

  if (content) {
    description = content.content[0].content[0].value
  }

  return (
    <Layout>
      <h1>{title}</h1>
      <Image fluid={image} />
      <p>{description}</p>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    allContentfulCatPosts(filter: { slug: { eq: $slug } }) {
      edges {
        node {
          title
          content {
            nodeType
            content {
              nodeType
              content {
                value
                nodeType
              }
            }
          }
          image {
            fluid {
              ...GatsbyContentfulFluid_withWebp_noBase64
            }
          }
        }
      }
    }
  }
`

export default catPosts
