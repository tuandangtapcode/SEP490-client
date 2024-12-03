import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BlogService from "src/services/BlogService"
import SubjectService from "src/services/SubjectService"
import { Descriptions, Tag, Spin, Space, Row, Col } from "antd"
import moment from "moment"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import { useSelector } from "react-redux"
import { defaultDays } from "src/lib/dateUtils"
import dayjs from "dayjs"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { formatMoney } from "src/lib/stringUtils"


const ModalBlogDetail = ({ open, onCancel }) => {

  const [loading, setLoading] = useState(false)
  const { listSystemKey } = useSelector(globalSelector)


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết bài đăng"
      width="60vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom btntype="cancel" onClick={onCancel}>
            Đóng
          </ButtonCustom>
        </Space>
      }
    >
      <div className="d-flex-center">
        <Row style={{ width: "80%" }} gutter={[16, 0]}>
          <Col span={4}>
            <div>Tiêu đề:</div>
          </Col>
          <Col span={20}>
            <div>{open?.Title}</div>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={5}>
                <div>Môn học:</div>
              </Col>
              <Col span={19}>
                <div>{open?.Subject?.SubjectName}</div>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={5}>
                <div>Trạng thái:</div>
              </Col>
              <Col span={19}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
                      ?.find(i => i?.ParentID === open?.RegisterStatus)?.ParentName
                  }
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={5}>
                <div>Trình độ:</div>
              </Col>
              <Col span={19}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.PROFESSIONAL_LEVEL, listSystemKey)
                      ?.find(i => i?.ParentID === open?.ProfessionalLevel)?.ParentName
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Giới tính:</div>
              </Col>
              <Col span={19}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)
                      ?.map((item, idx) => {
                        if (open?.Gender?.includes(item?.ParentID))
                          return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                      })
                  }
                </div>
              </Col>
              <Col span={7}>
                <div>Hình thức học:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                      ?.map((item, idx) => {
                        if (open?.LearnType?.includes(item?.ParentID))
                          return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                      })
                  }
                </div>
              </Col>
              <Col span={7}>
                <div>Tổng số buổi:</div>
              </Col>
              <Col span={17}>
                <div>{open?.NumberSlot}</div>
              </Col>
              <Col span={7}>
                <div>Số buổi/tuần:</div>
              </Col>
              <Col span={17}>
                <div>{open?.Schedules?.length}</div>
              </Col>
              <Col span={7}>
                <div>Giá tiền/buổi:</div>
              </Col>
              <Col span={17}>
                <div>{formatMoney(open?.Price)} VNĐ</div>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="mb-12">
            <Row>
              <Col span={24}>Lịch học:</Col>
              <Col span={24}>
                {
                  open?.Schedules?.map((i, idx) =>
                    <div key={idx}>
                      <span className="mr-3">
                        {
                          defaultDays?.find(d => d?.value === i?.DateValue)?.VieNameSpecific
                        }:
                      </span>
                      <span>
                        {dayjs(i?.StartTime).format("HH:mm")}-
                      </span>
                      <span>
                        {dayjs(i?.EndTime).format("HH:mm")}
                      </span>
                    </div>
                  )
                }
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <p className="fs-16 fw-600">Danh sách giáo viên tham gia</p>
          </Col>
        </Row>
      </div>
    </ModalCustom>
  )
}

export default ModalBlogDetail
