import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import FilterGroup from '../FilterGroup'
import JobCard from '../JobCard'
import ProfileCard from '../ProfileCard'
import {BsSearch} from 'react-icons/bs'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusData = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusData.initial,
    jobList: [],
    searchInput: '',
    employmentType: [],
    minimumSalary: 0,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusData.initial})
    const {employmentType, minimumSalary, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
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
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobList: updatedData,
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
      <button type="button" data-testid="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobList} = this.state
    const renderJobList = jobList.length > 0

    return renderJobList ? (
      <div>
        <ul>
          {jobList.map(eachItem => (
            <JobCard key={eachItem.id} jobDetails={eachItem} />
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
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

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getData()
    }
  }

  changeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getData)
  }

  changeEmployeeList = type => {
    this.setState(
      prevState => ({employmentType: [...prevState.employmentType, type]}),
      this.getData,
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div>
          <ProfileCard />
        </div>
        <div>
        
        </div>
        <div>
          <FilterGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            getData={this.getData}
            changeSalary={this.changeSalary}
            changeEmployeeList={this.changeEmployeeList}
          />
        </div>
        <div>
          <div>
            <input
              type="search"
              placeholder="search"
              value={searchInput}
              onChange={this.onSearchInput}
              onKeyDown={this.onEnterKey}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.getData}
            >
              <BsSearch />
            </button>
          </div>
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default Jobs
