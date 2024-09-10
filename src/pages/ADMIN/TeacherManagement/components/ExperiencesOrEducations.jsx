import { Collapse, Empty } from "antd"

const ExperiencesOrEducations = ({ user, isExperience }) => {

  const items = !!user[!!isExperience ? "Experiences" : "Educations"]?.length
    ? user[!!isExperience ? "Experiences" : "Educations"]?.map((i, idx) => (
      {
        key: idx,
        label: i?.Title,
        children: (
          <>
            <div>
              <span className="fw-600 mr-4">Chi tiết:</span>
              <span className="spaced-text">{i?.Content}</span>
            </div>
            <div>
              <span className="fw-600 mr-4">Bắt đầu từ:</span>
              <span className="spaced-text">{i?.StartDate}</span>
            </div>
            <div>
              <span className="fw-600 mr-4">Đến:</span>
              <span className="spaced-text">{i?.EndDate}</span>
            </div>
          </>
        )
      }
    ))
    : []

  return (
    <div className="p-12">
      <div className='fw-600 fs-16 mb-12'>
        {!!isExperience ? "Kinh nghiệm" : "Học vấn"} của {user?.FullName}
      </div>
      {
        !!items?.length
          ? <Collapse items={items} />
          : <Empty description={`${user?.FullName} chưa điền thông tin này`} />
      }
    </div>
  )
}

export default ExperiencesOrEducations