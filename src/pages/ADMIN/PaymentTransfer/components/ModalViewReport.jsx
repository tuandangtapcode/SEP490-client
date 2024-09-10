import { Col, Row, Space } from "antd"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import dayjs from "dayjs"
import React, { useState } from "react"
import PaymentService from "src/services/PaymentService"
import { getCurrentWeekRange, getRealFee, randomNumber } from "src/lib/commonFunction"
import ReportService from "src/services/ReportService"
import { toast } from "react-toastify"

const ModalViewReport = ({ open, onCancel, setPagination }) => {

  const [loading, setLoading] = useState(false)

  const handleReport = async (record) => {
    try {
      setLoading(true)
      const resReport = await ReportService.handleReport(record?._id)
      if (!!resReport?.isError) return
      const res = await PaymentService.createPayment({
        PaymentType: 2,
        PaymentStatus: 1,
        Description: `Hoàn tiền cho học sinh ${record?.Sender?.FullName}`,
        TotalFee: getRealFee(+record?.Teacher?.Price * 1000) * 80 / 100,
        TraddingCode: randomNumber(),
        Receiver: record?.Sender?._id
      })
      if (!!res?.isError) return
      toast.success("Report đã được xử lý. Đã tạo thanh toán hoàn tiền cho học sinh")
      onCancel()
      setPagination(pre => ({
        ...pre,
        FromDate: getCurrentWeekRange().startOfWeek,
        ToDate: getCurrentWeekRange().endOfWeek
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết báo cáo"
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
          open?.Reports?.map((i, idx) =>
            <React.Fragment key={idx}>
              <Col span={24}>
                <div className="center-text fs-18 fw-700">Lần báo số {idx + 1}</div>
              </Col>
              <Col span={5}>
                <div>Người báo cáo:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Sender?.FullName}</div>
              </Col>
              <Col span={5}>
                <div>Người bị báo cáo:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Teacher?.FullName}</div>
              </Col>
              <Col span={5}>
                <div>Buổi học vào ngày:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.DateAt).format("DD/MM/YYYY")
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Bắt đầu lúc:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.StartTime).format("HH:mm")
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Kết thúc lúc:</div>
              </Col>
              <Col span={17}>
                <div>
                  {
                    dayjs(open?.TimeTables?.find(item => item?._id === i?.Timetable)?.EndTime).format("HH:mm")
                  }
                </div>
              </Col>
              <Col span={5}>
                <div>Tiêu đề báo cáo:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Title}</div>
              </Col>
              <Col span={5}>
                <div>Nội dung báo cáo:</div>
              </Col>
              <Col span={17}>
                <div>{i?.Content}</div>
              </Col>
              <Col span={24}>
                <ButtonCustom
                  className="primary"
                  loading={loading}
                  onClick={() => {
                    if (!i?.IsHandle) {
                      handleReport(i)
                    }
                  }}
                >
                  {
                    !!i?.IsHandle
                      ? "Đã xử lý"
                      : "Tạo thanh toán hoàn tiền cho học sinh"
                  }
                </ButtonCustom>
              </Col>
            </React.Fragment>
          )
        }
      </Row>
    </ModalCustom >
  )
}

export default ModalViewReport