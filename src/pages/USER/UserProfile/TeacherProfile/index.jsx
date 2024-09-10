import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { Col, Collapse, Progress, Row } from "antd"
import ProfilePhoto from "./components/ProfilePhoto"
import Description from "./components/Description"
import IntroVideo from "./components/IntroVideo"
import { useEffect, useState } from "react"
import Quotes from "./components/Quotes"
import { MainProfileStyled } from "../styled"
import TimeTable from "./components/TimeTable"
import UserService from "src/services/UserService"
import globalSlice from "src/redux/globalSlice"
import { ADMIN_ID } from "src/lib/constant"
import Notice from "src/components/Notice"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import Experiences from "./components/Experiences"
import Educations from "./components/Educations"
import { toast } from "react-toastify"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"
import { getRealFee, getTotalVote } from "src/lib/commonFunction"
import dayjs from "dayjs"

const TeacherProfile = () => {

  const dispatch = useDispatch()
  const { user } = useSelector(globalSelector)
  const [progressProfile, setProgressProfile] = useState(0)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChangeProgressProfile = (user) => {
    let total = 0
    if (!!user?.AvatarPath?.includes("res")) {
      total += Math.ceil(100 / 6)
    }
    if (!!user?.Quotes?.length) {
      total += Math.ceil(100 / 6)
    }
    if (!!user?.Experiences?.length) {
      total += Math.ceil(100 / 6)
    }
    if (!!user?.Educations?.length) {
      total += Math.ceil(100 / 6)
    }
    if (!!user?.Description) {
      total += Math.ceil(100 / 6)
    }
    if (!!user?.Price && !!user?.LearnTypes?.length) {
      total += Math.ceil(100 / 6)
    }
    if (total > 100) {
      setProgressProfile(100)
    } else {
      setProgressProfile(total)
    }
  }

  useEffect(() => {
    handleChangeProgressProfile(user)
  }, [])

  const changeProfile = async (form, setLoading) => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (!!schedules?.length) {
        const checkTime = schedules?.every(i => dayjs(i?.end).diff(dayjs(i.start), 'minute') >= 90)
        if (!checkTime) {
          return Notice({
            isSuccess: false,
            msg: "Thời gian dạy tối thiểu 1 buổi học là 90 phút"
          })
        }
      }
      const body = {
        Avatar: values?.image?.file,
        Quotes: values?.quotes,
        Description: values?.Description,
        Address: values?.Address,
        Experiences: values?.experiences?.map(i => (
          {
            Title: i?.Title,
            Content: i?.Content,
            StartDate: i?.StartDate,
            EndDate: i?.EndDate
          }
        )),
        IntroductVideos: values?.introductVideos,
        Educations: values?.educations?.map(i => (
          {
            Title: i?.Title,
            Content: i?.Content,
            StartDate: i?.StartDate,
            EndDate: i?.EndDate
          }
        )),
        Price: values?.Price,
        LearnTypes: values?.LearnTypes,
        Schedules: !!schedules?.length
          ? schedules?.map(i => ({
            DateAt: dayjs(i?.start).format("dddd"),
            StartTime: dayjs(i?.start),
            EndTime: dayjs(i?.end),
          }))
          : undefined
      }
      const res = await UserService.changeProfile(body)
      if (res?.isError) return
      handleChangeProgressProfile(res?.data)
      dispatch(globalSlice.actions.setUser(res?.data))
      toast.success(res?.msg)
    } finally {
      setLoading(false)
    }
  }

  const sendRequestConfirmRegister = async () => {
    try {
      setLoading(true)
      const res = await UserService.requestConfirmRegister()
      if (res?.isError) return
      toast.success(res?.msg)
      handleSendNotificaction()
      dispatch(globalSlice.actions.setUser(res?.data))
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotificaction = async () => {
    const body = {
      Content: `${user?.FullName} đã gửi yêu cầu kiểm duyệt profile`,
      Type: "teacher",
      Receiver: ADMIN_ID
    }
    const res = await NotificationService.createNotification(body)
    if (res?.isError) return
    socket.emit('send-notification',
      {
        Content: res?.data?.Content,
        IsSeen: res?.IsSeen,
        _id: res?.data?._id,
        Type: res?.data?.Type,
        IsNew: res?.data?.IsNew,
        Receiver: ADMIN_ID,
        createdAt: res?.data?.createdAt
      })
  }

  const items = [
    {
      key: "1",
      label: (
        <div>
          Tải lên ảnh đại diện <span className="red-text">*</span>
        </div>
      ),
      children: (
        <ProfilePhoto changeProfile={changeProfile} />
      )
    },
    {
      key: "2",
      label: (
        <div>
          Cài đặt môn học<span className="red-text">*</span>
        </div>
      ),
      children: (
        <Quotes changeProfile={changeProfile} />
      )
    },
    {
      key: "3",
      label: (
        <div>
          Cài đặt lịch dạy và giá<span className="red-text">*</span>
        </div>
      ),
      children: (
        <TimeTable
          changeProfile={changeProfile}
          schedules={schedules}
          setSchedules={setSchedules}
        />
      )
    },
    {
      key: "4",
      label: (
        <div>
          Kinh nghiệm giảng dạy <span className="red-text">*</span>
        </div>
      ),
      children: (
        <Experiences
          changeProfile={changeProfile}
          isExperiences={true}
        />
      )
    },
    {
      key: "5",
      label: (
        <div>
          Học vấn <span className="red-text">*</span>
        </div>
      ),
      children: (
        <Educations
          changeProfile={changeProfile}
          isExperiences={false}
        />
      )
    },
    {
      key: "6",
      label: (
        <div>
          Mô tả bản thân <span className="red-text">*</span>
        </div>
      ),
      children: (
        <Description changeProfile={changeProfile} />
      )
    },
    {
      key: "7",
      label: (
        <div>
          Video giới thiệu
        </div>
      ),
      children: (
        <IntroVideo
          loading={loading}
          changeProfile={changeProfile}
        />
      )
    },
  ]

  return (
    <div>
      <div className="d-flex-sb mb-16">
        <div className="mb-12">
          <div className="fs-20 fw-600">Xin chào {user?.FullName}!</div>
          <div className="fs-14">
            Để có thể nhận học viên bạn phải hoàn thành các bước dưới đây. Đây là hồ sơ của bạn sẽ xuất hiện:
          </div>
          <div>
            <span className="red-text">*</span>
            <span className="mr-4">Lưu ý:</span>
            <span className="fs-14">Những thông tin có dấu <span className="red-text">*</span> là quan trọng. Bạn cần điền đầy đủ những trường này</span>
          </div>
        </div>
        <div>
          <Progress
            size="small"
            type="circle"
            percent={progressProfile}
          />
        </div>
      </div>
      <MainProfileStyled>
        <Row style={{ width: "100%" }} className="justify-content-space-around">
          <Col xxl={5} xl={5} lg={5} md={24} className="d-flex-center">
            <img
              src={user?.AvatarPath}
              alt=""
              style={{
                minWidth: "150px",
                height: "150px",
                borderRadius: "50%",
              }}
            />
          </Col>
          <Col span={16}>
            <div className="fs-25 fw-700 mb-50">{user?.FullName}!</div>
            <div className="d-flex-sb">
              <div className="price">
                <div className="blue-text fs-15 fw-600">Giá</div>
                <div>
                  <span className="fw-600">{!!user?.Price ? `${getRealFee(user?.Price)}.000` : "XXX"} VNĐ</span>
                  <span>/buổi</span>
                </div>
              </div>
              <div className="rating">
                <div className="blue-text fs-15 fw-600">Xếp hạng</div>
                <div>
                  <span className="fw-600">{getTotalVote(user?.Votes)} sao/{user?.Votes?.length} đánh giá</span>
                </div>
              </div>
              {/* <div className="locations">
                <div className="blue-text fs-15 fw-600">Địa điểm giảng dạy</div>
                <div>Địa điểm của bạn</div>
              </div> */}
            </div>
          </Col>
        </Row>
      </MainProfileStyled>
      <Collapse items={items} />
      {
        (progressProfile === 100 && user?.RegisterStatus !== 3) &&
        <ButtonCustom
          className="mt-12 primary medium-size"
          loading={loading}
          onClick={() => sendRequestConfirmRegister()}
        >
          {
            user?.RegisterStatus === 1
              ? "Gửi"
              : "Đã gửi"
          }
        </ButtonCustom>
      }
    </div >
  )
}

export default TeacherProfile