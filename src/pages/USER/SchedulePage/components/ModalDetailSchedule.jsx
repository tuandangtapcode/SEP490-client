import { Col, Row, Space } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import Router from "src/routers"
import TimeTableService from "src/services/TimeTableService"
import dayjs from "dayjs"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ModalReportMentor from "./ModalReportMentor"
import ModalChangeTimetable from "./ModalChangeTimetable"
import { saveAs } from "file-saver"

const ModalDetailSchedule = ({ open, onCancel, buttonShow, getTimeTable }) => {

  const navigate = useNavigate()
  const { listSystemKey } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [modalReportMentor, setModalReportMentor] = useState(false)
  const [openModalChangeTimetable, setOpenModalChangeTimetable] = useState(false)

  const handleAttendanceTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.attendanceTimeTable(open?._id)
      if (res?.isError) return
      toast.success(res?.msg)
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  const endTime = new Date(open?.EndTime)
  const endTimePlus24h = new Date(endTime?.getTime() + 24 * 60 * 60 * 1000)
  const currentTime = new Date()

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết lịch học"
      width="40vw"
      footer={
        <div className="d-flex-end">
          <Space>
            <ButtonCustom
              className="third"
              onClick={() => onCancel()}
            >
              Đóng
            </ButtonCustom>
            {
              !!buttonShow?.isAttendance &&
              <ButtonCustom
                loading={loading}
                disabled={
                  (dayjs(open?.StartTime).format("DD/MM/YYYY HH: ss") !== dayjs(Date.now).format("DD/MM/YYYY HH: ss") ||
                    !!open?.Status)
                    ? true : false
                }
                className="primary"
                onClick={() => handleAttendanceTimeTable()}
              >
                Điểm danh
              </ButtonCustom>
            }
            {
              !!buttonShow?.isUpdateTimeTable &&
              <ButtonCustom
                loading={loading}
                disabled={!!open?.Status ? true : false}
                className="third-type-2"
                onClick={() => setOpenModalChangeTimetable(open)}
              >
                Chỉnh sửa lịch học
              </ButtonCustom>
            }
          </Space>
        </div >
      }
    >
      <div className="d-flex-center">
        <Row gutter={[16, 16]}>
          <Col span={5}>
            <div>Ngày học:</div>
          </Col>
          <Col span={17}>
            <div>{dayjs(open?.DateAt).format("dddd DD/MM/YYYY")}</div>
          </Col>
          <Col span={2} className="d-flex-end">
            {currentTime < endTimePlus24h &&
              <ButtonCircle
                icon={ListIcons.ICON_WARNING}
                title="Báo cáo Giáo viên"
                onClick={() => setModalReportMentor(open)}
              />
            }
          </Col>
          <Col span={5}>
            <div>Thời gian:</div>
          </Col>
          <Col span={19}>
            <div>{dayjs(open?.StartTime).format("HH:ss")} - {dayjs(open?.EndTime).format("HH:ss")}</div>
          </Col>
          <Col span={5}>
            <div>{!buttonShow?.isAttendance ? "Giáo viên:" : "Học sinh:"}</div>
          </Col>
          <Col span={19}>
            <div
              onClick={() => {
                if (!buttonShow?.isAttendance) {
                  navigate(`${Router.GIAO_VIEN}/${open?.Teacher?._id}${Router.MON_HOC}/${open?.Subject?._id}`)
                }
              }}
              className={!buttonShow?.isAttendance ? "blue-text cursor-pointer" : ""}
            >
              {open[!buttonShow?.isAttendance ? "Teacher" : "Student"]?.FullName}
            </div>
          </Col>
          <Col span={5}>
            <div>Môn học:</div>
          </Col>
          <Col span={19}>
            <div>{open?.Subject?.SubjectName}</div>
          </Col>
          <Col span={5}>
            <div>Hình thức học:</div>
          </Col>
          <Col span={19}>
            <div>
              {
                getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                  ?.find(i => i?.ParentID === open?.LearnType)?.ParentName
              }
            </div>
          </Col>
          {
            !!open?.Document &&
            <>
              <Col span={5}>
                <div>Tài liệu:</div>
              </Col>
              <Col span={19}>
                <div
                  className="blue-text cursor-pointer"
                  onClick={() => {
                    saveAs(open?.Document?.DocPath, open?.Document?.DocName)
                  }}
                >
                  {open?.Document?.DocName}
                </div>
              </Col>
            </>
          }
        </Row>
      </div>

      {
        !!modalReportMentor &&
        <ModalReportMentor
          open={modalReportMentor}
          onCancel={() => setModalReportMentor(false)}
        />
      }

      {
        !!openModalChangeTimetable &&
        <ModalChangeTimetable
          open={openModalChangeTimetable}
          onCancel={() => setOpenModalChangeTimetable(false)}
          onCancelModalDetail={() => onCancel()}
          getTimeTable={getTimeTable}
        />
      }

    </ModalCustom >

  )
}

export default ModalDetailSchedule