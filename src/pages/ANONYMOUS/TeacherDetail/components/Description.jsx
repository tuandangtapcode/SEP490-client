const Description = ({ teacher }) => {

  return (
    <div>
      <div className="fs-20 fw-600 mb-8">Về {teacher?.FullName}</div>
      <div className="spaced-text">{teacher?.Description}</div>
    </div>
  )
}

export default Description