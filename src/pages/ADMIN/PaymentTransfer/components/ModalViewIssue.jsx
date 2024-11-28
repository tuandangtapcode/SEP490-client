import { Col, Row, Space } from "antd"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import dayjs from "dayjs"
import React, { useState } from "react"
import PaymentService from "src/services/PaymentService"
import { randomNumber } from "src/lib/commonFunction"
import IssueService from "src/services/IssueService"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getCurrentWeekRange } from "src/lib/dateUtils"

const ModalViewIssue = ({ open, onCancel, setPagination }) => {

  const [loading, setLoading] = useState(false)
  const { profitPercent } = useSelector(globalSelector)

  const handleIssue = async (record) => {
    try {
      setLoading(true)
      const res = await PaymentService.createPayment({
        PaymentType: 2,
        PaymentStatus: 1,
        Description: `Hoàn tiền cho học sinh ${record?.Sender?.FullName}`,
        TotalFee: +record?.Teacher?.Price * 1000 * (1 - profitPercent),
        TraddingCode: randomNumber(),
        Receiver: record?.Sender?._id
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success("Issue đã được xử lý. Đã tạo thanh toán hoàn tiền cho học sinh")
      setPagination(pre => ({
        ...pre,
        FromDate: getCurrentWeekRange().startOfWeek,
        ToDate: getCurrentWeekRange().endOfWeek
      }))
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết phản ánh"
      width="70vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              className="third"
              onClick={() => onCancel()}
            >
              Đóng
            </ButtonCustom>
          </Space>
        </div >
      }
    >
      <Row gutter={[16, 8]}>
        {
          !!open?.RequestAxplanationAt &&
          <Col span={24}>
            <div className="d-flex-end">Đã gửi yêu cầu giải trình ngày: {dayjs(open?.RequestAxplanationAt).format("DD/MM/YYYY HH:mm")}</div>
          </Col>
        }
        {
          open?.Issues?.map((i, idx) =>
            <React.Fragment key={idx}>
              <Col span={24}>
                <div className="center-text fs-18 fw-700">Lần báo số {idx + 1}</div>
              </Col>
              <Col span={5}>
                <div>Học sinh:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Sender?.FullName}</div>
              </Col>
              <Col span={5}>
                <div>Giáo viên:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Teacher?.FullName}</div>
              </Col>
              <Col span={5}>
                <div>Ngày:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.DateAt).format("DD/MM/YYYY")
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Thời gian:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.StartTime).format("HH:mm") - dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.EndTime).format("HH:mm")
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Tiêu đề:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Title}</div>
              </Col>
              <Col span={5}>
                <div>Nội dung:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Content}</div>
              </Col>
              <Col span={24}>
                <ButtonCustom
                  className="primary"
                  loading={loading}
                  onClick={() => {
                    handleIssue(i)
                  }}
                >
                  Tạo thanh toán hoàn tiền cho học sinh
                </ButtonCustom>
              </Col>
            </React.Fragment>
          )
        }
      </Row>
    </ModalCustom >
  )
}

export default ModalViewIssue