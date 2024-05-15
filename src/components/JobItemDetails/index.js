import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import SkillCard from '../SkillCard'

import './index.css'

const apiStatusData = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusData.initial,
    jobData: {},
    similarJobData: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getSimilarJobFormatedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormatedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(eachSkills => ({
      imageUrl: eachSkills.image_url,
      name: eachSkills.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    this.setState({apiStatus: apiStatusData.initial})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
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
      const updatedData = this.getFormatedData(data.job_details)
      const updatedSimilarJobData = data.similar_jobs.map(eachItem =>
        this.getSimilarJobFormatedData(eachItem),
      )
      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobData,
        apiStatus: apiStatusData.success,
      })
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
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" data-testid="button" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobData, similarJobData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData
    const {description, imageUrl} = lifeAtCompany

    return (
      <div>
        <div>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
            </div>
            <div>
              <p>{title}</p>
              <p>{rating}</p>
            </div>
          </div>
          <div>
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <div>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p>{jobDescription}</p>
          <ul>
            {skills.map(eachSkill => (
              <SkillCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobData.map(eachItem => (
              <SimilarJobItem key={eachItem.id} similarJobDetails={eachItem} />
            ))}
          </ul>
        </div>
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
        <Header />
        <div>{this.renderAllJobs()}</div>
      </div>
    )
  }
}

export default JobItemDetails
