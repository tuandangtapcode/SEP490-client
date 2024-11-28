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
import ModalIssueMentor from "./ModalIssueMentor"
import ModalChangeTimetable from "./ModalChangeTimetable"
import { saveAs } from "file-saver"

const ModalDetailSchedule = ({
  open,
  onCancel,
  buttonShow,
  getTimeTable,
  setOpenModalDetailSchedule
}) => {

  const navigate = useNavigate()
  const { listSystemKey } = useSelector(globalSelector)
  const [loading, setLoading] = useState(false)
  const [modalIssueMentor, setModalIssueMentor] = useState(false)
  const [openModalChangeTimetable, setOpenModalChangeTimetable] = useState(false)

  const handleAttendanceTimeTable = async () => {
    try {
      setLoading(true)
      const res = await TimeTableService.attendanceTimeTable(open?._id)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getTimeTable()
      onCancel()
    } finally {
      setLoading(false)
    }
  }


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết lịch học"
      width="40vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          {
            !!buttonShow?.IsShowBtnAttendance &&
            <ButtonCustom
              loading={loading}
              disabled={!!open?.IsAttendance ? false : true}
              className="primary"
              onClick={() => handleAttendanceTimeTable()}
            >
              Điểm danh
            </ButtonCustom>
          }
          {
            !!buttonShow?.IsShowBtnUpdateTimeTable &&
            <ButtonCustom
              loading={loading}
              disabled={!!open?.IsUpdateTimeTable ? false : true}
              className="third-type-2"
              onClick={() => setOpenModalChangeTimetable(open)}
            >
              Chỉnh sửa lịch học
            </ButtonCustom>
          }
        </Space>
      }
    >
      <div className="d-flex-center">
        <Row gutter={[16, 16]}>
          <Col span={5}>
            <div>Ngày học:</div>
          </Col>
          <Col span={17}>
            <div>{dayjs(open?.StartTime).startOf("day").format("dddd DD/MM/YYYY")}</div>
          </Col>
          <Col span={2} className="d-flex-end">
            {!!open?.IsSubmitIssue &&
              <ButtonCircle
                icon={ListIcons.ICON_WARNING}
                title="Báo cáo Giáo viên"
                onClick={() => setModalIssueMentor(open)}
              />
            }
          </Col>
          <Col span={5}>
            <div>Thời gian:</div>
          </Col>
          <Col span={19}>
            <div>{dayjs(open?.StartTime).format("HH:mm")} - {dayjs(open?.EndTime).format("HH:mm")}</div>
          </Col>
          <Col span={5}>
            <div>{!buttonShow?.IsShowBtnAttendance ? "Giáo viên:" : "Học sinh:"}</div>
          </Col>
          <Col span={19}>
            <div
              onClick={() => {
                if (!buttonShow?.IsShowBtnAttendance) {
                  navigate(`${Router.GIAO_VIEN}/${open?.Teacher?._id}${Router.MON_HOC}/${open?.Subject?._id}`)
                }
              }}
              className={!buttonShow?.IsShowBtnAttendance ? "primary-text cursor-pointer" : ""}
            >
              {open[!buttonShow?.IsShowBtnAttendance ? "Teacher" : "Student"]?.FullName}
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
            !!open?.Documents?.length &&
            <>
              <Col span={25}>
                <div>Tài liệu:</div>
              </Col>
              <Col span={24}>
                {
                  open?.Documents?.map((i, idx) =>
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
                }
              </Col>
            </>
          }
        </Row>
      </div>

      {
        !!modalIssueMentor &&
        <ModalIssueMentor
          open={modalIssueMentor}
          onCancel={() => setModalIssueMentor(false)}
        />
      }

      {
        !!openModalChangeTimetable &&
        <ModalChangeTimetable
          open={openModalChangeTimetable}
          dataModalDetail={open}
          onCancel={() => setOpenModalChangeTimetable(false)}
          onCancelModalDetail={() => onCancel()}
          getTimeTable={getTimeTable}
          setOpenModalDetailSchedule={setOpenModalDetailSchedule}
        />
      }

    </ModalCustom >

  )
}

export default ModalDetailSchedule