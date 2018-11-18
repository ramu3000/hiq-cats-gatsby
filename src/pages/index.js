import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import HonorableMention from '../components/honorableMention'
import Winners from '../components/winners'

// Add this to test we can load our Auth component

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <Winners />
      <section style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3>Want to see better cat images</h3>
        <Link to="/vote">Vote from here</Link>
      </section>
      <HonorableMention />
    </Layout>
  )
}

export default IndexPage
