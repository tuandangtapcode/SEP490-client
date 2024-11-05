import { Col, Row, Space } from "antd"
import { useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"

const ModalViewBooking = ({ open, onCancel }) => {

  const { listSystemKey } = useSelector(globalSelector)

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thông tin booking"
      width="50vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
        </Space>
      }
    >
      <div className="d-flex-center">
        <Row style={{ width: "50%" }} gutter={[16, 0]}>
          <Col span={24}>
          </Col>
          <Col span={10}>
            <p>{!!open?.Receiver?._id ? "Giáo viên:" : "Học sinh"}</p>
          </Col>
          <Col span={14}>
            <p>{!!open?.Receiver?._id ? open?.Receiver?.FullName : open?.Sender?.FullName}</p>
          </Col>
          <Col span={10}>
            <p>Môn học:</p>
          </Col>
          <Col span={14}>
            <p>{open?.Subject?.SubjectName}</p>
          </Col>
          <Col span={10}>
            <p>Hình thức học:</p>
          </Col>
          <Col span={14}>
            <p>
              {
                getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                  item?.ParentID === open?.LearnType)?.ParentName
              }
            </p>
          </Col>
          <Col span={10}>
            <p>Lịch học:</p>
          </Col>
          <Col span={14}>
            {
              open?.Schedules?.map((i, idx) =>
                <div key={idx} className="mb-4">
                  <span className="mr-2">Ngày</span>
                  <span className="mr-4">{dayjs(i?.StartTime).format("DD/MM/YYYY")}:</span>
                  <span className="mr-2">{dayjs(i?.StartTime).format("HH:mm")}</span>
                  <span className="mr-2">-</span>
                  <span>{dayjs(i?.EndTime).format("HH:mm")}</span>
                </div>
              )
            }
          </Col>
          <Col span={10}>
            <p>Số tiền thanh toán:</p>
          </Col>
          <Col span={14}>
            <p className="fs-17 fw-700 primary-text">{formatMoney(open?.TotalFee)} VNĐ</p>
          </Col>
        </Row>
      </div>
    </ModalCustom>
  )
}

export default ModalViewBooking