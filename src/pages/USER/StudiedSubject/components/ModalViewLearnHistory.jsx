import { Col, Rate, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import SpinCustom from "src/components/SpinCustom"
import LearnHistoryService from "src/services/LearnHistoryService"
import { saveAs } from "file-saver"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const ModalViewLearnHistory = ({ open, onCancel }) => {

  const [learnHistory, setLearnHistory] = useState()
  const [loading, setLoading] = useState(false)

  const getDetailLearnHistory = async () => {
    try {
      setLoading(true)
      const res = await LearnHistoryService.getDetailLearnHistory(open)
      if (!!res?.isError) return toast.error(res?.msg)
      setLearnHistory(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailLearnHistory()
  }, [open])

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thông tin chi tiết"
      width="60vw"
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
      <SpinCustom spinning={loading}>
        <div className="d-flex-center">
          <Row style={{ width: "50%" }}>
            <Col span={6}>
              <div className="fw-600 fs-16">Môn học</div>
            </Col>
            <Col span={18}>
              <div className="fs-16">{learnHistory?.Subject?.SubjectName}</div>
            </Col>
            <Col span={6}>
              <div className="fw-600 fs-16">Số buổi học</div>
            </Col>
            <Col span={18}>
              <div className="fs-16">{learnHistory?.TotalLearned}</div>
            </Col>
            <Col span={24}>
              <div className="fw-600 fs-16">Thông tin điểm danh</div>
            </Col>
            <Col span={8}>
              Tên học sinh
            </Col>
            <Col span={8}>
              Tình trạng điểm danh
            </Col>
            <Col span={8}>
              Tài liệu
            </Col>
            {
              learnHistory?.Timetables?.map(i =>
                <>
                  <Col span={8}>
                    {i?.Student?.FullName}
                  </Col>
                  <Col span={8}>
                    {!!i?.Status ? "Đã điểm danh" : "Chưa điểm danh"}
                  </Col>
                  <Col span={8}>
                    {
                      !!i?.Documents?.length
                        ? open?.Documents?.map((i, idx) =>
                          <div
                            key={idx}
                            className="primary-text cursor-pointer"
                            onClick={() => {
                              saveAs(i?.DocPath, i?.DocName)
                            }}
                          >
                            {i?.DocName}
                          </div>
                        )
                        : <span>Không có tài liệu</span>
                    }
                  </Col>
                </>
              )
            }
            <Col span={learnHistory?.Feedback[0] ? 24 : 5}>
              <div className="fw-600 fs-16">Nhận xét</div>
            </Col>
            {
              !!learnHistory?.Feedback[0] ?
                <>
                  <Col span={5}>Vote</Col>
                  <Col span={19}>
                    <Rate
                      allowHalf
                      disabled
                      value={learnHistory?.Feedback[0]?.Rate}
                      style={{
                        fontSize: "12px",
                        marginRight: "3px"
                      }}
                    />
                  </Col>
                  <Col span={5}>Bình luận</Col>
                  <Col span={19}>
                    {learnHistory?.Feedback[0]?.Content}
                  </Col>
                </>
                : <Col span={19} className="mt-2">Không có nhận xét</Col>
            }
          </Row>
        </div>
      </SpinCustom>
    </ModalCustom>
  )
}

export default ModalViewLearnHistory