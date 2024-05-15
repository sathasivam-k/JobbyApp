import './index.css'

const SimilarJobItem = (props) => {
    const {similarJobDetails} = props
    const {
        companyLogoUrl,
        employmentType,
        jobDescription,
        location,
        rating,
        title,    
    } = similarJobDetails
    return(
        <li>
            <img src={companyLogoUrl} alt="similar job company logo"/>
            <p>{employmentType}</p>
            <p>{jobDescription}</p>
            <p>{location}</p>
            <p>{rating}</p>
            <p>{title}</p>
        </li>
    )
}

export default SimilarJobItem