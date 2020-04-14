import React from 'react'
import Routes from '../Routes'
import { Provider } from '../store'
import Discord from '../components/discord'

const App = () => (
  <Provider>
    <Routes />
    <Discord />
  </Provider>
)

export default App
