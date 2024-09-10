import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { DivTimeContainer, MainProfileWrapper } from "./styled"
import { Col, Collapse, Menu, Row, Select, Tabs } from "antd"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import Description from "./components/Description"
import ExperiencesOrEducations from "./components/ExperiencesOrEducations"
import Router from "src/routers"
import { convertSchedules, getRealFee } from "src/lib/commonFunction"
import { PatentChildBorder, TabStyled } from "src/pages/ADMIN/TeacherManagement/styled"
import moment from "moment"
import { formatMoney } from "src/lib/stringUtils"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { toast } from "react-toastify"
import socket from "src/utils/socket"
import ModalSendFeedback from "./modal/ModalSendFeedback"
import CommentService from "src/services/CommentService"
import Comments from "./components/Comments"
import ModalSendMessage from "./modal/ModalSendMessage"

const { Option } = Select

const TeacherDetail = () => {

  const { TeacherID, SubjectID } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState()
  const [quote, setQuote] = useState()
  const [comments, setComments] = useState([])
  const [totalComment, setTotalComment] = useState(0)
  const { user } = useSelector(globalSelector)
  const [openModalSendFeedback, setOpenModalSendFeedback] = useState(false)
  const [openModalSendMessage, setOpenModalSendMessage] = useState(false)

  const getDetailTeacher = async () => {
    try {
      setLoading(true)
      const res = await UserService.getDetailTeacher({ TeacherID, SubjectID })
      if (res?.isError) return navigate("/not-found")
      setTeacher(res?.data)
      setQuote(
        res?.data?.Quotes?.find(i => i?.SubjectID === SubjectID)
      )
    } finally {
      setLoading(false)
    }
  }

  const getListComment = async () => {
    try {
      setLoading(true)
      const res = await CommentService.getListCommentOfTeacher({
        PageSize: 3,
        CurrentPage: 1,
        TeacherID
      })
      if (res?.isError) return
      setComments(res?.data?.List)
      setTotalComment(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailTeacher()
  }, [TeacherID, SubjectID])

  useEffect(() => {
    if (!!teacher) {
      getListComment()
    }
  }, [teacher])

  useEffect(() => {
    if (!!teacher) {
      socket.emit("join-room", TeacherID)
    }
  }, [teacher])

  useEffect(() => {
    socket.on("get-comment", data => {
      setComments([...comments, data])
    })
  }, [])

  const items = [
    {
      key: "overview",
      label: <a href="#overview">Tổng quan</a>
    },
    {
      key: "description",
      label: <a href="#description">Chi tiết</a>
    },
    {
      key: "review",
      label: <a href="#review">Đánh giá</a>
    },
    {
      key: "experiences",
      label: <a href="#experiences">Kinh nghiệm</a>
    },
    {
      key: "educations",
      label: <a href="#educations">Học vấn</a>
    },
  ]

  const itemTab = !!teacher?.Schedules?.length
    ? convertSchedules(teacher?.Schedules)?.map(i => (
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
      <Row gutter={[20]} className="pt-20">
        <Col span={17}>
          <Row>
            <Col span={24}>
              <MainProfileWrapper className="p-24 mb-16" id="overview">
                <Row style={{ width: "100%" }}>
                  <Col xxl={5} xl={5} lg={5} md={24} className="d-flex-center mr-12">
                    <img
                      src={teacher?.AvatarPath}
                      alt=""
                      style={{
                        minWidth: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  </Col>
                  <Col span={16} className="d-flex flex-column justify-content-space-around">
                    <div className="fs-25 fw-700">{teacher?.FullName}</div>
                    <div>

                    </div>
                    {
                      user?._id !== TeacherID &&
                      <div>
                        <ButtonCustom
                          className="third-type-2 mr-12"
                          onClick={() => {
                            if (!!user?._id) {
                              setOpenModalSendMessage(teacher)
                            } else {
                              return toast.warning("Hãy đăng nhập để trò chuyện với giáo viên")
                            }
                          }}
                        >
                          Gửi câu hỏi cho giáo viên
                        </ButtonCustom>
                        <ButtonCustom
                          className="third-type-2"
                          onClick={() => {
                            if (!!user?._id) {
                              setOpenModalSendFeedback(teacher)
                            } else {
                              return toast.warning("Hãy đăng nhập để đánh giá giáo viên")
                            }
                          }}
                        >
                          Gửi đánh giá giáo viên
                        </ButtonCustom>
                      </div>
                    }
                  </Col>
                  <Col span={24}>
                    <Menu
                      items={items}
                      mode="horizontal"
                    />
                  </Col>
                  <Col className="mt-16">
                    <div
                      className="fs-20 fw-600 mb-8"
                      style={{ wordWrap: "break-word", overflowWrap: 'break-word' }}
                    >
                      {quote?.Title}
                    </div>
                    <div className="spaced-text">
                      {quote?.Content}
                    </div>
                  </Col>
                </Row>
              </MainProfileWrapper>
            </Col>
            <Col span={24} className="mb-16">
              <MainProfileWrapper className="p-24" id="description">
                <Description teacher={teacher} />
              </MainProfileWrapper>
            </Col>
            <Col span={24} className="mb-16">
              <MainProfileWrapper className="p-24" id="review">
                <Comments comments={comments} teacher={teacher} />
              </MainProfileWrapper>
            </Col>
            <Col span={24} className="mb-16">
              <MainProfileWrapper id="experiences" className="p-12">
                <Collapse
                  ghost
                  size="large"
                  expandIconPosition="end"
                  items={[
                    {
                      key: "1",
                      label: (
                        <div className="fs-20 fw-600">Kinh nghiệm</div>
                      ),
                      children: (
                        <ExperiencesOrEducations teacher={teacher} isExperience={true} />
                      )
                    }
                  ]} />
              </MainProfileWrapper>
            </Col>
            <Col span={24} className="mb-16">
              <MainProfileWrapper id="educations" className="p-12">
                <Collapse
                  ghost
                  size="large"
                  expandIconPosition="end"
                  items={[
                    {
                      key: "1",
                      label: (
                        <div className="fs-20 fw-600">Học vấn</div>
                      ),
                      children: (
                        <ExperiencesOrEducations teacher={teacher} isExperience={false} />
                      )
                    }
                  ]}
                />
              </MainProfileWrapper>
            </Col>
          </Row>
        </Col>

        <Col span={7}>
          <div>
            <MainProfileWrapper className="p-24 mb-16">
              <div className="fs-20 fw-700 mb-12">Thông tin chi tiết</div>
              <div className="mb-12">
                <div className="fs-17 fw-600 mb-8">Môn học</div>
                <Select
                  defaultValue={SubjectID}
                  onChange={e => navigate(`${Router.GIAO_VIEN}/${TeacherID}${Router.MON_HOC}/${e}`)}
                >
                  {
                    teacher?.Subjects?.map(i =>
                      <Option
                        key={i?._id}
                        value={i?._id}
                      >
                        {i?.SubjectName}
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
                      // inkBar: true,
                      tabPane: true,
                    }}
                  />
                </TabStyled>
              </div>
              <div className="mb-12">
                <span className="fs-17 fw-600 mr-4">Giá: </span>
                <span>{formatMoney(getRealFee(teacher?.Price) * 1000)} VNĐ</span>
              </div>
              {
                user?._id !== TeacherID &&
                <div>
                  <ButtonCustom
                    className="primary submit-btn"
                    onClick={() => {
                      if (!!user?._id) {
                        navigate(`${Router.GIAO_VIEN}/${TeacherID}${Router.MON_HOC}/${SubjectID}/booking`)
                      } else {
                        return toast.warning("Hãy đăng nhập để tiến hành đặt lịch")
                      }
                    }}
                  >
                    Đặt lịch ngay
                  </ButtonCustom>
                </div>
              }
            </MainProfileWrapper>
          </div>
        </Col>

        {
          !!openModalSendFeedback &&
          <ModalSendFeedback
            open={openModalSendFeedback}
            onCancel={() => setOpenModalSendFeedback(false)}
          />
        }

        {
          !!openModalSendMessage &&
          <ModalSendMessage
            open={openModalSendMessage}
            onCancel={() => setOpenModalSendMessage(false)}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default TeacherDetail