import { Col, Rate, Row, Space, Table } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import SpinCustom from "src/components/SpinCustom"
import LearnHistoryService from "src/services/LearnHistoryService"
import { saveAs } from "file-saver"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import dayjs from "dayjs"
import TableCustom from "src/components/TableCustom"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { Roles } from "src/lib/constant"

const ModalViewLearnHistory = ({ open, onCancel }) => {

  const [learnHistory, setLearnHistory] = useState()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(globalSelector)

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

  const colums = [
    {
      title: 'Tên học sinh',
      width: 80,
      align: 'center',
      dataIndex: 'FullName',
      key: 'FullName',
      render: (text, record) => (
        <div>{record?.Student?.FullName}</div>
      ),
    },
    {
      title: 'Ngày giờ',
      width: 90,
      align: 'center',
      dataIndex: 'StartTime',
      key: 'StartTime',
      render: (text, record) => (
        <div>
          <span className="mr-3">{dayjs(record?.StartTime).format("DD/MM/YYYY")}</span>
          <span>{dayjs(record?.StartTime).format("HH:mm")}-</span>
          <span>{dayjs(record?.EndTime).format("HH:mm")}</span>
        </div>
      ),
    },
    {
      title: 'Tình trạng điểm danh',
      width: 80,
      align: 'center',
      dataIndex: 'Status',
      key: 'Status',
      render: (val) => (
        <div>
          {
            !!val ? "Đã điểm danh" : "Chưa điểm danh"
          }
        </div>
      ),
    },
    {
      title: 'Tài liệu',
      width: 100,
      align: 'center',
      dataIndex: 'Documents',
      key: 'Documents',
      render: (val) => (
        <div>
          {
            val?.length
              ? val?.map((i, idx) =>
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
        </div>
      ),
    },
  ]

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
          <Row >
            <Col span={6}>
              <div className="fw-600 fs-16">Môn học</div>
            </Col>
            <Col span={18}>
              <div className="fs-16">{learnHistory?.Subject?.SubjectName}</div>
            </Col>
            <Col span={6}>
              <div className="fw-600 fs-16">
                {
                  user?.RoleID === Roles.ROLE_TEACHER
                    ? "Học sinh"
                    : "Giáo viên"
                }
              </div>
            </Col>
            <Col span={18}>
              <div className="fs-16">{learnHistory?.Timetables[0]?.[user?.RoleID === Roles.ROLE_TEACHER ? "Student" : "Teacher"]?.FullName}</div>
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
            <Col span={24}>
              <Table
                bordered
                dataSource={learnHistory?.Timetables}
                columns={colums}
                editableCell
                sticky={{ offsetHeader: -12 }}
                textEmpty="Không có dữ liệu"
                rowKey="key"
                pagination={false}
              />
            </Col>
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