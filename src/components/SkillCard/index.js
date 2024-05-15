import './index.css'
const SkillCard = (props) => {
    const {skillDetails} = props
    const {name, imageUrl} = skillDetails

    return(
        <li>
            <img src={imageUrl} alt={name}/>
            <p>{name}</p>    
        </li>
    )
}

export default SkillCard