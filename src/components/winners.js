import React from 'react'

import Carousel from './carousel'
import styles from './winners.module.css'

export default () => {
  return (
    <React.Fragment>
      <h2 style={styles.h2}>
        Todays winners
        <span role="img" aria-label="Diamond">
          💎
        </span>
      </h2>
      <Carousel />
    </React.Fragment>
  )
}
