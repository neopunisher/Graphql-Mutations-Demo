import React from 'react'
import { Resolver } from 'found-relay'
import { ReactRelayContext } from 'react-relay'
import { createGlobalStyle } from 'styled-components'

import { environment } from './utils/relay'

import Router from './components/Router'

const GlobalStyle = createGlobalStyle`
  body {
    background: #f7f7f7;
    color: #404040;
  }
`

const relayContext = {
  environment,
  variables: {},
}

const App = () => {
  return (
    <ReactRelayContext.Provider value={relayContext}>
      <GlobalStyle />
      <Router resolver={new Resolver(environment)} />
    </ReactRelayContext.Provider>
  )
}

export default App
