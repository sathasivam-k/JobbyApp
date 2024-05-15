import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

const apiStatusData = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProfileCard extends Component {
  state = {
    apiStatus: apiStatusData.initial,
    profileData: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusData.initial})
    const apiUrl = `https://apis.ccbp.in/profile`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImage_url: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,

      }
      this.setState({apiStatus: apiStatusData.success, profileData})
    } else {
      this.setState({apiStatus: apiStatusData.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <button type="button" data-testid="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return(
      <div>
        <img src={profileImageUrl} alt="profile"/>
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusData.success:
        return this.renderSuccessView()
      case apiStatusData.failure:
        return this.renderFailureView()
      case apiStatusData.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default ProfileCard
