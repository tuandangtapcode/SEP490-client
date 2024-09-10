const ExperiencesOrEducations = ({ teacher, isExperience }) => {

  return (
    <div>
      {
        teacher[!!isExperience ? "Experiences" : "Educations"]?.map((i, idx) =>
          <div key={idx} className="mb-12">
            <div className="d-flex-sb">
              <div className="fw-600 fs-17">{i?.Title}</div>
              <div className="d-flex-sb">
                <div className="mr-4 fs-14">{i?.StartDate}</div>
                <div className="mr-4">-</div>
                <div className="fs-14">{i?.EndDate}</div>
              </div>
            </div>
            <div className="fs-16">{i?.Content}</div>
          </div>
        )
      }
    </div>
  )
}

export default ExperiencesOrEducations