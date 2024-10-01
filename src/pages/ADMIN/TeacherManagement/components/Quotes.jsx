import { Collapse, Empty } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import SubjectService from "src/services/SubjectService"

const Quotes = ({ user }) => {

  const { listSystemKey } = useSelector(globalSelector)
  const parentKeyLevel = getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState([])

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  const items = !!user?.Quotes?.length
    ? user?.Quotes?.map((i, idx) => (
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
    <SpinCustom spinning={loading}>
      <div className="p-12">
        <div className='fw-600 fs-16 mb-12'>
          Môn học {user?.FullName} giảng dạy
        </div>
        {
          !!items?.length
            ? <Collapse items={items} />
            : <Empty description={`${user?.FullName} chưa điền thông tin này`} />
        }
      </div>
    </SpinCustom>
  )
}

export default Quotes