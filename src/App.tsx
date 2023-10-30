import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import formatSql from './sqlForamtter/format-sql'

import { Icon, addIcon } from '@iconify/react';
import radioOne from '@iconify/icons-icon-park/radio-one';
import home from '@iconify-icons/mdi/home'
import Hello from './Hello';

addIcon('hahaha', home)

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React aaaa bbb ccc
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
        <div>
          <Icon icon="mdi-light:home" color="red" />
          <Icon icon={radioOne}  color="red"/>
          <Icon icon={radioOne} color="red" width="48" height="48" rotate={2} vFlip={true} />
          <Icon icon={home} color="red" width="48" height="48" rotate={2} vFlip={true} />
          <Icon icon='hahaha' color="red" width="48" height="48" rotate={2} vFlip={true} />
        </div>
        <div>
          <Hello name="TypeScript" cluster={{id: 1}} count={count} />
        </div>
      </header>
    </div>
  )
}

export default App

console.log(formatSql('select sleep(1)'))
