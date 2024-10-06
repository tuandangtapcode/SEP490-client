import { Col, Image, Row } from "antd"
import { useSelector } from "react-redux"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import VideoItem from "src/pages/ANONYMOUS/TeacherDetail/components/VideoItem"
import "react-big-calendar/lib/css/react-big-calendar.css"
import PreviewVideo from "src/pages/USER/SubjectSetting/modal/PreviewVideo"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import UserService from "src/services/UserService"
import { toast } from "react-toastify"

const localizer = momentLocalizer(moment)
const formats = {
  monthHeaderFormat: () => { }, // Định dạng tiêu đề tháng
  dayFormat: "ddd", // Định dạng hiển thị ngày trong ngày
  dayHeaderFormat: () => { }, // Tiêu đề nagyf
  dayRangeHeaderFormat: () => { }, // Định dạng tiêu đề ngày khi chọn khoảng thời gian
  agendaDateFormat: () => { }, //Cột trong lịch làm việc
}

const SubjectSettingItem = ({
  subjectSetting,
  email,
  fullName,
  getListTeacher,
  onCancel
}) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [schedules, setSchedules] = useState([])
  const [openPreviewVideo, setOpenPreviewVideo] = useState()
  const [loading, setLoading] = useState(false)

  const handleConfirmSubjectSetting = async () => {
    try {
      setLoading(true)
      const res = await UserService.confirmSubjectSetting({
        SubjectSettingID: subjectSetting?._id,
        FullName: fullName,
        Email: email
      })
      if (!!res?.isError) return toast.error(res?.msg)
      getListTeacher()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!!subjectSetting?.Schedules?.length) {
      const getDayFormSchedule = subjectSetting?.Schedules?.find(i => i?.DateAt === dayjs().format("dddd"))
      setSchedules(
        subjectSetting?.Schedules?.map(i => {
          const dayGap = dayjs().startOf("day").diff(dayjs(getDayFormSchedule?.StartTime).startOf("day"), "days")
          return {
            start: dayGap > 5
              ? dayjs(i?.StartTime).add(dayGap, "days")
              : dayjs(i?.StartTime),
            end: dayGap > 5
              ? dayjs(i?.EndTime).add(dayGap, "days")
              : dayjs(i?.EndTime),
            title: ""
          }
        })
      )
    }
  }, [subjectSetting])

  return (
    <div className="p-12">
      <Row>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Thông tin cơ bản môn học</div>
        </Col>
        <Col span={24}>
          <span className="fw-500 mr-4">Tiêu đề môn học:</span>
          <span>{subjectSetting?.Quote?.Title}</span>
        </Col>
        <Col span={24} className="mb-16">
          <span className="fw-500 mr-4">Giới thiệu môn học:</span>
          <span>{subjectSetting?.Quote?.Content}</span>
        </Col>
        <Col span={24}>
          <span className="fw-500 mr-4">Hình thức giảng dạy:</span>
          {
            getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) => {
              if (subjectSetting?.LearnTypes?.includes(i?.ParentID))
                return <span key={idx} className='mr-8'>{i?.ParentName}</span>
            })
          }
        </Col>
        <Col span={24}>
          <span className="fw-500 mr-4">Giá tiền cho mỗi buổi học:</span>
          <span>{formatMoney(subjectSetting?.Price * 1000)}VNĐ</span>
        </Col>
        <Col span={24} className="mb-16">
          <span className="fw-500 mr-4">Cấp độ giảng dạy:</span>
          {
            getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map((i, idx) => {
              if (subjectSetting?.Levels?.includes(i?.ParentID))
                return <span key={idx} className='mr-8'>{i?.ParentName}</span>
            })
          }
        </Col>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Lịch trình giảng dạy</div>
        </Col>
        <Col span={24} className="mb-16">
          <Calendar
            localizer={localizer}
            startAccessor={event => {
              return new Date(event.start)
            }}
            endAccessor={event => {
              return new Date(event.end)
            }}
            style={{ width: "100%", height: 700 }}
            toolbar={false}
            defaultView={Views.WEEK}
            formats={formats}
            selectable
            events={schedules}
            onShowMore={(schedules, date) =>
              this.setState({ showModal: true, schedules })
            }
          />
        </Col>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Kinh nghiệm giảng dạy</div>
        </Col>
        <Col span={24} className="mb-16">
          {
            subjectSetting?.Experiences?.map((i, idx) =>
              <div key={idx}>
                <div className="d-flex">
                  <div className="fw-500 mr-4">Mô tả:</div>
                  <div>{i?.Content}</div>
                </div>
                <div className="d-flex">
                  <div className="fw-500 mr-4">Thời gian bắt đầu - Thời gian kết thúc:</div>
                  <div>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</div>
                </div>
              </div>
            )
          }
        </Col>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Trình độ học vấn</div>
        </Col>
        <Col span={24} className="mb-16">
          {
            subjectSetting?.Experiences?.map((i, idx) =>
              <div key={idx}>
                <div className="d-flex">
                  <div className="fw-500 mr-4">Mô tả học vấn của bạn:</div>
                  <div>{i?.Content}</div>
                </div>
                <div className="d-flex">
                  <div className="fw-500 mr-4">Thời gian bắt đầu - Thời gian kết thúc:</div>
                  <div>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</div>
                </div>
              </div>
            )
          }
        </Col>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Tài liệu bằng cấp:</div>
        </Col>
        <Col span={24} className="mb-16">
          {
            subjectSetting?.Certificates?.map((i, idx) =>
              <Image style={{ width: "150px", height: "150px", marginRight: "12px" }} key={idx} src={i} />
            )
          }
        </Col>
        <Col span={24}>
          <div className="fs-18 fw-600 mb-12">Video giới thiệu:</div>
        </Col>
        <Col span={24}>
          <Row>
            {
              subjectSetting?.IntroVideos?.map((i, idx) =>
                <Col
                  key={idx} span={8}
                  onClick={() => setOpenPreviewVideo(i)}
                >
                  <VideoItem
                    videoUrl={i}
                  />
                </Col>
              )
            }
          </Row>
        </Col>
        <Col span={24} className="d-flex-end">
          <ButtonCustom
            className="primary"
            loading={loading}
            disabled={!!subjectSetting?.IsActive ? true : false}
            onClick={() => handleConfirmSubjectSetting()}
          >
            Duyệt môn học
          </ButtonCustom>
        </Col>
      </Row>

      {
        !!openPreviewVideo &&
        <PreviewVideo
          open={openPreviewVideo}
          onCancel={() => setOpenPreviewVideo(false)}
        />
      }
    </div>
  )
}

export default SubjectSettingItem