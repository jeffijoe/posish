// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './register-service-worker'
import createRootStore from './root-store'

ReactDOM.render(<App rootStore={createRootStore()} />, document.getElementById('root'))
registerServiceWorker()
