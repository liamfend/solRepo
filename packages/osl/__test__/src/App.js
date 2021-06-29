import React from 'react'
import PropTypes from 'prop-types'

function App(props) {
  React.useEffect(() => {
    // console.log(window.process.env)
  }, [])
  return (
    <div>
      <div>
         cc
        {JSON.stringify(process.env)}
      </div>
    </div>
  )
}

App.propTypes = {
  test: PropTypes.any,
}

export default App
