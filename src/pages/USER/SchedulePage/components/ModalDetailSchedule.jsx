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
      onCancel()
      getTimeTable()
    } finally {
      setLoading(false)
    }
  }

  console.log("buttonShow", !buttonShow?.isShowBtnAttendance);


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
            !!buttonShow?.isShowBtnAttendance &&
            <ButtonCustom
              loading={loading}
              disabled={!!open?.isAttendance ? false : true}
              className="primary"
              onClick={() => handleAttendanceTimeTable()}
            >
              Điểm danh
            </ButtonCustom>
          }
          {
            !!buttonShow?.isShowBtnUpdateTimeTable &&
            <ButtonCustom
              loading={loading}
              disabled={!!open?.isUpdateTimeTable ? false : true}
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
            {!!open?.isSubmitIssue &&
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
            <div>{!buttonShow?.isShowBtnAttendance ? "Giáo viên:" : "Học sinh:"}</div>
          </Col>
          <Col span={19}>
            <div
              onClick={() => {
                if (!buttonShow?.isShowBtnAttendance) {
                  navigate(`${Router.GIAO_VIEN}/${open?.Teacher?._id}${Router.MON_HOC}/${open?.Subject?._id}`)
                }
              }}
              className={!buttonShow?.isShowBtnAttendance ? "primary-text cursor-pointer" : ""}
            >
              {open[!buttonShow?.isShowBtnAttendance ? "Teacher" : "Student"]?.FullName}
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
              {
                open?.Documents?.map((i, idx) =>
                  <Col key={idx} span={24}>
                    <div
                      className="primary-text cursor-pointer"
                      onClick={() => {
                        saveAs(i?.DocPath, i?.DocName)
                      }}
                    >
                      {i?.DocName}
                    </div>
                  </Col>
                )
              }
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