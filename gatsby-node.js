/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')

exports.onCreateNode = ({ node, getNode }) => {
  if (node.internal.type === `ContentfulCatPosts`) {
    console.log(`\n`, getNode)
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    /*
     * During the build step, `auth0-js` will break because it relies on
     * browser-specific APIs. Fortunately, we don’t need it during the build.
     * Using Webpack’s null loader, we’re able to effectively ignore `auth0-js`
     * during the build. (See `src/utils/auth.js` to see how we prevent this
     * from breaking the app.)
     * https://github.com/gatsbyjs/store.gatsbyjs.org/blob/master/src/utils/auth.js
     */
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /(\*auth.js$|firebase)/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve(`src/templates/cat-posts.js`)
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allContentfulCatPosts {
              edges {
                node {
                  slug
                  title
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create blog post pages.
        result.data.allContentfulCatPosts.edges.forEach(edge => {
          createPage({
            path: `${edge.node.slug}/`, // required
            component: blogPostTemplate,
            context: {
              // Add optional context data. Data can be used as
              // arguments to the page GraphQL query.
              //
              // The page "path" is always available as a GraphQL
              // argument.
              slug: edge.node.slug,
            },
          })
        })

        return
      })
    )
  })
}
