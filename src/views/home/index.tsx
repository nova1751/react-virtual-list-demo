import { Link } from 'react-router-dom'
import './index.css'

const Home = () => {
  return (
    <div id="demo-root">
      <Link to="/demo1">Demo1</Link>
      <Link to="/demo2">Demo2</Link>
      <Link to="/demo3">Demo3</Link>
    </div>
  )
}

export default Home
