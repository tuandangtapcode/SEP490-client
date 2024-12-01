import { Col, Image, Row } from "antd"
import { useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { useState } from "react"

const ModalViewBlogPosting = ({ open, onCancel }) => {
  const { listSystemKey } = useSelector(globalSelector)

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết bài đăng"
      width="70vw"
      footer={null}
    >
      <div className="p-12">
        <Row>
          
          <Col span={24}>
            <span className="fw-500 mr-4">Môn học:</span>
            <span>
              {
                !!open?.Subject?.SubjectName
                  ? open?.Subject?.SubjectName
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Tiêu đề:</span>
            <span>
              {
                !!open?.Title
                  ? open?.Title
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Mô tả chi tiết:</span>
            <span>
              {
                !!open?.Content
                  ? open?.Content
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Hình thức giảng dạy:</span>
            {
              !!open?.LearnType?.length
                ? getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) => {
                  if (open?.LearnTypes?.includes(i?.ParentID))
                    return <span key={idx} className='mr-8'>{i?.ParentName}</span>
                })
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Giá tiền cho mỗi buổi học:</span>
            <span>
              {
                !!open?.Price
                  ? `${formatMoney(open?.Price)} VNĐ`
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
          <span className="fw-500 mr-4">Địa chỉ:</span>
            <span>
              {
                !!open?.Address
                  ? open?.Address
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24} className="mb-16">
            <span className="fw-500 mr-4">Yêu cầu giới tính giáo viên:</span>
            {
              !!open?.Gender?.length
                ? getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)?.map((i, idx) => {
                  if (open?.Gender?.includes(i?.ParentID))
                    return <span key={idx} className='mr-8'>{i?.ParentName}</span>
                })
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24} className="mb-16">
            {
              !!open?.Schedules?.length
                ? open?.Schedules?.map((i, idx) =>
                  <div key={idx}>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Lịch học:</div>
                    </div>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Thời gian bắt đầu: {dayjs(i?.StartTime).format("DD/MM/YYYY")}</div>
                      <div className="fw-500 mr-4"> Giờ học: {dayjs(i?.StartTime).format("HH:MM")} - {dayjs(i?.EndTime).format("HH:MM")}</div>
                    </div>
                  </div>
                )
                : "Chưa bổ sung"
            }
          </Col>
        </Row>

        
      </div>
    </ModalCustom>
  )
}

export default ModalViewBlogPosting