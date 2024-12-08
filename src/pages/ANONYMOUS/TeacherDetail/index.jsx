import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { DivTimeContainer, MainProfileWrapper } from "./styled"
import { Carousel, Col, Image, Rate, Row, Select, Tabs } from "antd"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import Router from "src/routers"
import { PatentChildBorder, TabStyled } from "src/pages/ADMIN/TeacherManagement/styled"
import moment from "moment"
import { formatMoney } from "src/lib/stringUtils"
import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { toast } from "react-toastify"
import socket from "src/utils/socket"
import FeedbackService from "src/services/FeedbackService"
import 'swiper/css'
import { convertSchedules } from "src/lib/dateUtils"
import ListIcons from "src/components/ListIcons"
import VideoItem from "./components/VideoItem"
import PreviewVideo from "src/pages/USER/SubjectSetting/modal/PreviewVideo"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import dayjs from "dayjs"
import Feedback from "./components/Feedback"
import globalSlice from "src/redux/globalSlice"

const { Option } = Select

const TeacherDetail = () => {

  const { TeacherID, SubjectID } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState()
  const [subjects, setSubjects] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [totalFeedback, setTotalFeedback] = useState(0)
  const { user, profitPercent, listSystemKey } = useSelector(globalSelector)
  const [openModalPreviewVideo, setOpenModalPreviewVideo] = useState(false)


  const getDetailTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getDetailTeacher({ TeacherID, SubjectID, IsBookingPage: false })
      if (!!res?.isError) return navigate("/not-found")
      setTeacher(res?.data?.TeacherInfor)
      setSubjects(res?.data?.Subjects)
    } finally {
      setLoading(false)
    }
  }

  const getListFeedback = async () => {
    try {
      setLoading(true)
      const res = await FeedbackService.getListFeedbackOfTeacher({
        PageSize: 10,
        CurrentPage: 1,
        TeacherID
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setFeedbacks(res?.data?.List)
      setTotalFeedback(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailTeacher()
  }, [TeacherID, SubjectID])

  useEffect(() => {
    if (!!teacher?.Teacher?._id) {
      getListFeedback()
    }
  }, [teacher?.Teacher?._id])

  useEffect(() => {
    if (!!teacher) {
      socket.emit("join-room", TeacherID)
    }
  }, [teacher])

  useEffect(() => {
    socket.on("get-feedback", data => {
      setFeedbacks([...feedbacks, data])
    })
  }, [])

  const itemTab = !!teacher?.Teacher?.Schedules?.length
    ? convertSchedules(teacher?.Teacher?.Schedules)?.map(i => (
      {
        key: i?.DateAt,
        label: i?.DateAt,
        children: (
          <PatentChildBorder>
            <Row gutter={[16, 16]} className="d-flex p-12">
              {i?.Times?.map((item, index) =>
                <Col span={12} key={index}>
                  <DivTimeContainer>
                    {moment(item?.StartTime).format("HH:mm")} - {moment(item?.EndTime).format("HH:mm")}
                  </DivTimeContainer>
                </Col>
              )}
            </Row>
          </PatentChildBorder>
        )
      }
    ))
    : []


  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[20, 16]} className="pt-20">
        <Col xxl={24} xl={24} lg={24} md={24}>
          <div className="d-flex align-items-center mb-8">
            <img
              src={teacher?.Teacher?.AvatarPath}
              alt=""
              style={{
                minWidth: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "10px"
              }}
            />
            <div>
              <p className="fs-20 fw-700 mb-4">{teacher?.Teacher?.FullName}</p>
              <p className="fs-18">Giảng viên {teacher?.Subject?.SubjectName}</p>
            </div>
          </div>
          <div className="d-flex align-items-center mr-10 mb-2">
            <span className="mr-4">{ListIcons.ICON_LOCATION}</span>
            <span>{teacher?.Teacher?.Address}</span>
          </div>
          <div>
            <Rate
              allowHalf
              disabled
              value={
                !!teacher?.TotalVotes
                  ? teacher?.TotalVotes / teacher?.Votes?.length
                  : 0
              }
              style={{
                fontSize: "12px",
                marginRight: "3px"
              }}
            />
            <span>({teacher?.Votes?.length} đánh giá)</span>
          </div>
        </Col>
        <Col span={17}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <MainProfileWrapper>
                <Carousel
                  autoplay
                  arrows={!!teacher?.IntroVideos?.length > 1 ? true : false}
                >
                  {
                    teacher?.IntroVideos?.map((i, idx) =>
                      <div
                        key={idx}
                        onClick={() => setOpenModalPreviewVideo(i)}
                      >
                        <VideoItem
                          videoUrl={i}
                        />
                      </div>
                    )
                  }
                </Carousel>
                <div className="d-flex-sb">
                  <div className="d-flex align-items-center">
                    <span className="mr-6">{ListIcons.ICON_LEVEL}</span>
                    <span className="mr-6 fw-500">Trình độ</span>
                    {
                      getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
                        ?.map((item, idx) => {
                          if (teacher?.Levels?.includes(item?.ParentID))
                            return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                        })
                    }
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="mr-6">{ListIcons.ICON_LEARN_TYPE}</span>
                    <span className="mr-6 fw-500">Hình thức học</span>
                    {
                      getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                        ?.map((item, idx) => {
                          if (teacher?.LearnTypes?.includes(item?.ParentID))
                            return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                        })
                    }
                  </div>
                </div>
              </MainProfileWrapper>
            </Col>
            <Col span={24}>
              <MainProfileWrapper>
                <p className="fs-16 fw-600 mb-12">{teacher?.Quote?.Title}</p>
                <p>{teacher?.Quote?.Content}</p>
              </MainProfileWrapper>
            </Col>
            <Col span={24}>
              <MainProfileWrapper>
                <p className="fs-16 fw-600 mb-12">Kinh nghiệm</p>
                {
                  teacher?.Experiences?.map((i, idx) =>
                    <div key={idx} className="d-flex-sb mb-8">
                      <p>{i?.Content}</p>
                      <p>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</p>
                    </div>
                  )
                }
              </MainProfileWrapper>
            </Col>
            <Col span={24}>
              <MainProfileWrapper>
                <p className="fs-16 fw-600 mb-12">Học vấn</p>
                {
                  teacher?.Educations?.map((i, idx) =>
                    <div key={idx} className="d-flex-sb mb-8">
                      <p>{i?.Content}</p>
                      <p>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</p>
                    </div>
                  )
                }
              </MainProfileWrapper>
            </Col>
            <Col span={24}>
              <MainProfileWrapper>
                <p className="fs-16 fw-600 mb-12">Chứng chỉ/Giải thưởng</p>
                <div className="d-flex">
                  {
                    teacher?.Certificates?.map((i, idx) =>
                      <Image
                        src={i}
                        alt="" key={idx}
                        style={{
                          width: "200px",
                          height: "200px",
                          marginRight: "12px"
                        }}
                      />
                    )
                  }
                </div>
              </MainProfileWrapper>
            </Col>
            <Col span={24}>
              <MainProfileWrapper>
                <Feedback feedbacks={feedbacks} />
              </MainProfileWrapper>
            </Col>
          </Row>
        </Col>

        <Col span={7}>
          <MainProfileWrapper>
            <div>
              <div className="fs-20 fw-700 mb-12">Thông tin chi tiết</div>
              <div className="mb-12">
                <div className="fs-17 fw-600 mb-8">Môn học</div>
                <Select
                  defaultValue={SubjectID}
                  onChange={e => navigate(`${Router.GIAO_VIEN}/${TeacherID}${Router.MON_HOC}/${e}`)}
                >
                  {
                    subjects?.map(i =>
                      <Option
                        key={i?.Subject?._id}
                        value={i?.Subject?._id}
                      >
                        {i?.Subject?.SubjectName}
                      </Option>
                    )
                  }
                </Select>
              </div>
              <div className="mb-12">
                <div className="fs-17 fw-600 mb-8">Thời gian</div>
                <TabStyled>
                  <Tabs
                    type="card"
                    items={itemTab}
                    size="small"
                    animated={{
                      tabPane: true,
                    }}
                  />
                </TabStyled>
              </div>
              <div className="mb-12">
                <span className="gray-text mr-4">Học phí/buổi: </span>
                <span className="primary-text fw-700 fs-17">{formatMoney(teacher?.Price)} VNĐ</span>
              </div>
              {
                user?._id !== TeacherID &&
                <div>
                  <ButtonCustom
                    className="primary submit-btn"
                    onClick={() => {
                      if (!!user?._id) {
                        navigate(
                          `${Router.GIAO_VIEN}/${TeacherID}${Router.MON_HOC}/${SubjectID}/booking`,
                          { state: teacher }
                        )
                      } else {
                        dispatch(globalSlice.actions.setRouterBeforeLogin(location.pathname))
                        navigate("/dang-nhap")
                      }
                    }}
                  >
                    Đặt lịch ngay
                  </ButtonCustom>
                </div>
              }
            </div>
          </MainProfileWrapper>
        </Col>

        {
          !!openModalPreviewVideo &&
          <PreviewVideo
            open={openModalPreviewVideo}
            onCancel={() => setOpenModalPreviewVideo(false)}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default TeacherDetail