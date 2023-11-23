import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import App from './App'
// import App from './ReactCodeMirrorPlayground'
import App from './ReactCodeMirror'
// import App from './MultipleCM'

import SQLEditor from './SQLEditor/editor'

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <SQLEditor/>
  </React.StrictMode>,
  document.getElementById('root')
)
