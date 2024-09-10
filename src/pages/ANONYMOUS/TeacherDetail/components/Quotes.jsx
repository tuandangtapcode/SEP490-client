import { Collapse, Empty } from "antd"
import { useSelector } from "react-redux"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"

const Quotes = ({ teacher }) => {

  const { subjects, listSystemKey } = useSelector(globalSelector)
  const parentKeyLevel = getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)

  const items = !!teacher?.Quotes?.length
    ? teacher?.Quotes?.map((i, idx) => (
      {
        key: idx,
        label: subjects?.find(item => item?._id === i?.SubjectID)?.SubjectName,
        children: (
          <>
            <div>
              <span className="fw-600 mr-4">Tiêu đề:</span>
              <span className="spaced-text">{i?.Title}</span>
            </div>
            <div>
              <span className="fw-600 mr-4">Mô tả:</span>
              <span className="spaced-text">{i?.Content}</span>
            </div>
            <div>
              <span className="fw-600 mr-4">Trình độ:</span>
              <span className="spaced-text">
                {
                  parentKeyLevel?.map(item => {
                    if (i?.Levels?.includes(item?.ParentID))
                      return ` ${item?.ParentName} `
                  })
                }
              </span>
            </div>
          </>
        )
      }
    ))
    : []

  return (
    <div className="p-12">
      <div className='fw-600 fs-16 mb-12'>
        Môn học {teacher?.FullName} giảng dạy
      </div>
      {
        !!items?.length
          ? <Collapse items={items} />
          : <Empty description={`${teacher?.FullName} chưa điền thông tin này`} />
      }
    </div >
  )
}

export default Quotes