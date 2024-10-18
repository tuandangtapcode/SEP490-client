import { Col, Row, Space } from "antd"
import { useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { formatMoney } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useState } from "react"
import ConfirmService from "src/services/ConfirmService"
import { toast } from "react-toastify"

const MOdalConfirmInfor = ({
  open,
  onCancel,
  teacher,
  bookingInfor,
  selectedTimes
}) => {

  const { listSystemKey, user, profitPercent } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)

  const sendRequestBooking = async () => {
    try {
      setLoading(true)
      const res = await ConfirmService.createConfirm({
        Sender: user?._id,
        Receiver: teacher?.Teacher?._id,
        Subject: teacher?.Subject?._id,
        TotalFee: teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent),
        LearnType: bookingInfor?.LearnType,
        Schedules: selectedTimes?.map(i => ({
          DateAt: dayjs(i?.StartTime),
          StartTime: dayjs(i?.StartTime),
          EndTime: dayjs(i?.EndTime),
        }))
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCanel={onCancel}
      title="Xác nhận thông tin booking"
      width="50vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            loading={loading}
            onClick={() => sendRequestBooking()}
          >
            Xác nhận
          </ButtonCustom>
        </Space>
      }
    >
      <p className="center-text fs-20 fw-600 mb-16">Chúng tôi xin phép được xác nhận lại thông tin booking của bạn</p>
      <div className="d-flex-center">
        <Row style={{ width: "50%" }} gutter={[16, 0]}>
          <Col span={24}>
          </Col>
          <Col span={10}>
            <p>Giáo viên:</p>
          </Col>
          <Col span={14}>
            <p>{teacher?.Teacher?.FullName}</p>
          </Col>
          <Col span={10}>
            <p>Môn học:</p>
          </Col>
          <Col span={14}>
            <p>{teacher?.Subject?.SubjectName}</p>
          </Col>
          <Col span={10}>
            <p>Hình thức học:</p>
          </Col>
          <Col span={14}>
            <p>
              {
                getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.find(item =>
                  item?.ParentID === bookingInfor?.LearnType)?.ParentName
              }
            </p>
          </Col>
          <Col span={10}>
            <p>Lịch học:</p>
          </Col>
          <Col span={14}>
            {
              selectedTimes?.map((i, idx) =>
                <div key={idx} className="mb-4">
                  <span className="mr-2">Ngày</span>
                  <span className="mr-4">{dayjs(i?.StartTime).format("DD/MM/YYYY")}:</span>
                  <span className="mr-2">{dayjs(i?.StartTime).format("HH:ss")}</span>
                  <span className="mr-2">-</span>
                  <span>{dayjs(i?.EndTime).format("HH:ss")}</span>
                </div>
              )
            }
          </Col>
          <Col span={10}>
            <p>Số tiền thanh toán:</p>
          </Col>
          <Col span={14}>
            <p>{formatMoney(teacher?.Price * selectedTimes.length * 1000 * (1 + profitPercent))} VNĐ</p>
          </Col>
        </Row>
      </div>
    </ModalCustom>
  )
}

export default MOdalConfirmInfor