import { render } from 'preact'
import App from './app'
import './style.css'

render(<App />, document.querySelector("div#app") as HTMLElement)
