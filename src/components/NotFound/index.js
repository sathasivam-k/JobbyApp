import Header from '../Header'
import './index.css'

const NotFound = () => (
  <div>
    <Header />
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page requested could not be found</p>
    </div>
  </div>
)

export default NotFound
