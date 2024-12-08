import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { MainProfileWrapper } from "src/pages/ANONYMOUS/TeacherDetail/styled"
import { useEffect, useState } from "react"
import { Col, Image, message, Row } from "antd"
import dayjs from "dayjs"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { STAFF_ID, Roles } from "src/lib/constant"
import ModalChangeProfile from "src/components/Layout/components/ModalChangeProfile"
import ModalChangeCareerInfor from "./components/ModalChangeCareerInfor"
import ModalTimeTable from "./components/ModalTimeTable"
import ModalBankInfor from "./components/ModalBankInfor"
import UserService from "src/services/UserService"
import NotificationService from "src/services/NotificationService"
import socket from "src/utils/socket"
import { toast } from "react-toastify"
import globalSlice from "src/redux/globalSlice"
import BankingService from "src/services/BankingService"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"

const UserProfile = () => {

  const { user } = useSelector(globalSelector)
  const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false)
  const [openModalUpdateCareerInfor, setOpenModalUpdateCareerInfor] = useState(false)
  const [openModalTimeTable, setOpenModalTimeTable] = useState(false)
  const [openModalBankInfor, setOpenModalBankInfor] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [bankInfor, setBankInfor] = useState()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const getInforMissing = () => {
    let message = ""
    if (!user?.Experiences?.length) {
      message = "Bạn chưa bổ sung kinh nghiệm giảng dạy"
    } else if (!user?.Educations?.length) {
      message = "Bạn chưa bổ sung trình độ học vấn"
    } else if (!user?.SubjectSettings?.length) {
      message = "Bạn chưa bổ sung môn học đăng ký"
    } else if (!user?.Certificates?.length) {
      message = "Bạn chưa bổ sung chứng nhận"
    } else if (!user?.Description) {
      message = "Bạn chưa bổ sung giới thiệu bản thân"
    }
    return message
  }

  const sendRequestCofirmRegister = async () => {
    try {
      setLoading(true)
      const messageCheck = getInforMissing()
      if (!!messageCheck) {
        return message.error(messageCheck)
      }
      const resChangeRegisterStatus = UserService.requestConfirmRegister()
      const resNotification = NotificationService.createNotification({
        Content: `${user?.FullName} đã gửi yêu cầu duyệt profile`,
        Type: "teacher",
        Receiver: STAFF_ID
      })
      const result = await Promise.all([resChangeRegisterStatus, resNotification])
      if (!!result[0]?.isError || !!result[1]?.isError) return
      socket.emit('send-notification',
        {
          Content: result[1]?.data?.Content,
          IsSeen: result[1]?.IsSeen,
          _id: result[1]?.data?._id,
          Type: result[1]?.data?.Type,
          IsNew: result[1]?.data?.IsNew,
          Receiver: STAFF_ID,
          createdAt: result[1]?.data?.createdAt
        })
      toast.success(result[0]?.msg)
      dispatch(globalSlice.actions.setUser({ ...result[0]?.data, Email: user?.Email }))
    } finally {
      setLoading(false)
    }
  }

  const getDetailBankingInfor = async () => {
    try {
      const res = await BankingService.getDetailBankingInfor()
      if (!!res?.isError) return
      setBankInfor(res?.data)
    } finally {
      console.log()
    }
  }

  useEffect(() => {
    getDetailBankingInfor()
  }, [])

  return (
    <MainProfileWrapper className="p-20">
      <div className="mb-30">
        <div className="d-flex-sb mb-30">
          <div className="fs-20 fw-600">Thông tin cá nhân</div>
          <ButtonCustom
            className="third-type-2"
            onClick={() => setOpenModalUpdateProfile(true)}
          >
            Chỉnh sửa
          </ButtonCustom>
        </div>
        <div className="avatar mb-20">
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%"
            }}
            src={user?.AvatarPath}
            alt=""
          />
        </div>
        <Row gutter={[0, 16]}>
          <Col span={4}>
            <div className="fw-600 fs-16">Họ và tên</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.FullName}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Ngày sinh</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{dayjs(user?.DateOfBirth).format("DD/MM/YYYY")}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Số điện thoại</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.Phone}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Địa chỉ</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.Address}</div>
          </Col>
          <Col span={4}>
            <div className="fw-600 fs-16">Email</div>
          </Col>
          <Col span={20}>
            <div className="fs-16">{user?.Email}</div>
          </Col>
        </Row>
      </div>
      {
        user?.RoleID === Roles.ROLE_TEACHER &&
        <div>
          <div className="d-flex-sb mb-30">
            <div className="fs-20 fw-600">Thông tin nghề nghiệp</div>
            {
              user?.RegisterStatus !== 2 &&
              <ButtonCustom
                className="third-type-2"
                onClick={() => setOpenModalUpdateCareerInfor(true)}
              >
                Chỉnh sửa
              </ButtonCustom>
            }
          </div>
          <Row gutter={[0, 12]} className="d-flex align-items-center">
            <Col span={5}>
              <div className="fw-600 fs-16">Kinh nghiệm giảng dạy</div>
            </Col>
            <Col span={!!user?.Experiences?.length ? 24 : 19}>
              <div className="fs-16">
                {
                  !!user?.Experiences?.length
                    ? user?.Experiences?.map((i, idx) =>
                      <p key={idx}>{i}</p>
                    )
                    : "Chưa bổ sung kinh nghiệm giảng dạy"
                }
              </div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Trình độ học vấn</div>
            </Col>
            <Col span={!!user?.Educations?.length ? 24 : 19}>
              <div className="fs-16">
                {
                  !!user?.Educations?.length
                    ? user?.Educations?.map((i, idx) =>
                      <p key={idx}>{i}</p>
                    )
                    : "Chưa bổ sung trình độ học vấn"
                }
              </div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Môn học đăng ký</div>
            </Col>
            <Col span={!!user?.SubjectSettings?.length ? 24 : 19}>
              <div className="fs-16">
                {
                  !!user?.SubjectSettings?.length
                    ? user?.SubjectSettings?.map((i, idx) =>
                      <p key={idx}>{i?.Subject?.SubjectName}</p>
                    )
                    : "Chưa bổ sung môn học đăng ký"
                }
              </div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Chứng nhận</div>
            </Col>
            <Col span={!!user?.Certificates?.length ? 24 : 19}>
              <div className="fs-16">
                {
                  !!user?.Certificates?.length
                    ? user?.Certificates?.map((i, idx) =>
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
                    : "Chưa bổ sung chứng nhận"
                }
              </div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Thiết lập lịch trình giảng dạy</div>
            </Col>
            <Col span={19}>
              <ButtonCustom
                className="third-type-2"
                onClick={() => setOpenModalTimeTable(true)}
              >
                Cài đặt
              </ButtonCustom>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Thiết lập thông tin thanh toán</div>
            </Col>
            <Col span={19}>
              <ButtonCustom
                className="third-type-2"
                onClick={() => setOpenModalBankInfor(true)}
              >
                Cài đặt
              </ButtonCustom>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Giới thiệu bản thân</div>
            </Col>
            <Col span={19}>
              <div className="fs-16">
                {
                  !!user?.Description
                    ? user?.Description
                    : "Chưa bổ sung giới thiệu bản thân"
                }
              </div>
            </Col>
            {
              user?.RegisterStatus === 1 &&
              <Col span={19}>
                <ButtonCustom
                  className="primary medium-size"
                  loading={loading}
                  onClick={() => {
                    ConfirmModal({
                      description: `Bạn có chắc chắn gửi yêu cầu kiểm duyệt không?`,
                      onOk: async close => {
                        sendRequestCofirmRegister()
                        close()
                      }
                    })
                  }}
                >
                  Gửi yêu cầu duyệt
                </ButtonCustom>
              </Col>
            }
          </Row>
        </div>
      }

      {
        !!openModalUpdateProfile &&
        <ModalChangeProfile
          open={openModalUpdateProfile}
          onCancel={() => setOpenModalUpdateProfile(false)}
          isFromProfilePage={true}
        />
      }

      {
        !!openModalUpdateCareerInfor &&
        <ModalChangeCareerInfor
          open={openModalUpdateCareerInfor}
          onCancel={() => setOpenModalUpdateCareerInfor(false)}
        />
      }

      {
        !!openModalTimeTable &&
        <ModalTimeTable
          open={openModalTimeTable}
          onCancel={() => setOpenModalTimeTable(false)}
          schedules={schedules}
          setSchedules={setSchedules}
        />
      }

      {
        !!openModalBankInfor &&
        <ModalBankInfor
          open={openModalBankInfor}
          onCancel={() => setOpenModalBankInfor(false)}
          setBankInfor={setBankInfor}
        />
      }

    </MainProfileWrapper>
  )
}

export default UserProfile