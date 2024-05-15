import './index.css'

const FilterGroup = props => {
  const renderTypeOfEmployment = () => {
    const {employmentTypesList} = props
    return (
      <div>
        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(eachItem => {
            const {changeEmployeeList} = props
            const onSelectEmployType = event => {
              changeEmployeeList(event.target.value)
            }
            return (
              <li key={eachItem.employmentTypeId} onChange={onSelectEmployType}>
                <input
                  type="checkbox"
                  id={eachItem.employmentTypeId}
                  value={eachItem.employmentTypeId}
                />
                <label htmlFor={eachItem.employmentTypeId}>
                  {eachItem.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div>
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(eachItem => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachItem.salaryRangeId)
            }
            return (
              <li key={eachItem.salaryRangeId} onChange={onClickSalary}>
                <input type="radio" id={eachItem.salaryRangeId} name="salary" />
                <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <hr />
      {renderTypeOfEmployment()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}

export default FilterGroup
