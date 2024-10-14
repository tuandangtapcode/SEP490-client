import { Col, Form, message, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { SubjectItemStyled } from "./styled"
import BasicInformation from "./components/BasicInformation"
import Experiences from "./components/Experiences"
import Educations from "./components/Educations"
import Certificates from "./components/Certificates"
import IntroVideo from "./components/IntroVideo"
import dayjs from "dayjs"
import ModalSubject from "./modal/ModalSubject"
import FileService from "src/services/FileService"
import NotificationService from "src/services/NotificationService"
import { ADMIN_ID } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import socket from "src/utils/socket"
import ModalTimeTable from "./modal/ModalTimeTable"

const SubjectSetting = () => {

  const [loading, setLoading] = useState(false)
  const [openModalSubject, setOpenModalSubject] = useState(false)
  const [subjectSettings, setSubjectSettings] = useState([])
  const [subjectSetting, setSubjectSetting] = useState()
  const [form] = Form.useForm()
  const [filesCertificate, setFilesCertificate] = useState([])
  const [filesIntroVideo, setFilesIntroVideo] = useState([])
  const { user } = useSelector(globalSelector)
  const [openModalTimeTable, setOpenModalTimeTable] = useState(false)
  const [schedules, setSchedules] = useState([])

  const getListSubjectSetting = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListSubjectSettingByTeacher()
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjectSettings(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (!schedules.length)
        return message.error("Bạn chưa cài đặt lịch dạy")
      const resCertificate = FileService.uploadFileList({
        FileList: values?.Certificates?.map(i => i?.originFileObj)
      })
      const resIntroVideo = FileService.uploadFileList({
        FileList: values?.IntroVideos?.map(i => i?.originFileObj)
      })
      const resultFile = await Promise.all([resCertificate, resIntroVideo])
      if (!!resultFile[0]?.isError || !!resultFile[1]?.isError) return
      const resSubjectSetting = await UserService.updateSubjectSetting({
        SubjectSettingID: subjectSetting?._id,
        SubjectID: subjectSetting?.Subject?._id,
        Quote: {
          Title: values?.TitleQuote,
          Content: values?.ContentQuote
        },
        Certificates: resultFile[0]?.data,
        IntroVideos: resultFile[1]?.data,
        Levels: values?.Levels,
        Experiences: !!values?.experiences
          ? values?.experiences?.map(i => ({
            Content: i?.Content,
            StartDate: i?.Date[0],
            EndDate: i?.Date[1]
          }))
          : undefined,
        Educations: !!values?.educations
          ? values?.educations?.map(i => ({
            Content: i?.Content,
            StartDate: i?.Date[0],
            EndDate: i?.Date[1]
          }))
          : undefined,
        Price: values?.Price,
        LearnTypes: values?.LearnTypes
      })
      if (!!resSubjectSetting?.isError) return toast.error(resSubjectSetting?.msg)
      let resChangeRegisterStatus
      if (user?.RegisterStatus === 1) {
        resChangeRegisterStatus = UserService.requestConfirmRegister()
      }
      const resNotification = NotificationService.createNotification({
        Content: `${user?.FullName} đã gửi yêu cầu duyệt profile cho bạn`,
        Type: "teacher",
        Receiver: ADMIN_ID
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
          Receiver: ADMIN_ID,
          createdAt: result[1]?.data?.createdAt
        })
      toast.success("Yêu cầu kiểm duyệt đã được gửi")
      setSubjectSetting(resSubjectSetting?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubjectSetting()
  }, [])

  useEffect(() => {
    if (!!subjectSetting) {
      form.setFieldsValue({
        TitleQuote: subjectSetting?.Quote?.Title,
        ContentQuote: subjectSetting?.Quote?.Content,
        LearnTypes: subjectSetting?.LearnTypes,
        Price: subjectSetting?.Price,
        Levels: subjectSetting?.Levels,
        experiences: !!subjectSetting?.Experiences?.length
          ? subjectSetting?.Experiences?.map(i => ({
            ...i,
            Date: [dayjs(i?.StartDate), dayjs(i?.EndDate)]
          }))
          : [{}],
        educations: !!subjectSetting?.Educations?.length
          ? subjectSetting?.Educations?.map(i => ({
            ...i,
            Date: [dayjs(i?.StartDate), dayjs(i?.EndDate)]
          }))
          : [{}],
        Certificates: subjectSetting?.Certificates?.map((i, idx) => ({
          url: i,
          id: idx
        })),
        IntroVideos: subjectSetting?.IntroVideos?.map((i, idx) => ({
          url: i.replace("mp4", "jpg"),
          id: idx
        }))
      })
    }
  }, [subjectSetting?.Subject?._id])

  useEffect(() => {
    if (!!user?.Schedules?.length) {
      const getDayFormSchedule = user?.Schedules?.find(i => i?.DateAt === dayjs().format("dddd"))
      setSchedules(
        user?.Schedules?.map(i => {
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
  }, [user?.Schedules])

  return (
    <SpinCustom spinning={loading}>
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24} className="d-flex-sb mb-10">
            <div className="fs-18 fw-600">Danh sách môn học</div>
            <Space>
              <ButtonCustom
                className="primary"
                onClick={() => setOpenModalSubject(true)}
              >
                Thêm Môn học
              </ButtonCustom>
              <ButtonCustom
                className="primary"
                onClick={() => setOpenModalTimeTable(true)}
              >
                Cài đặt lịch dạy
              </ButtonCustom>
            </Space>
          </Col>
          <Col span={24} className="mb-20">
            {
              subjectSettings?.map((i, idx) =>
                <SubjectItemStyled
                  className={subjectSetting?.Subject?._id === i?.Subject?._id ? "active" : ""}
                  key={idx}
                  onClick={() => {
                    if (i?.Subject?._id !== subjectSetting?.Subject?._id) {
                      setSubjectSetting(i)
                    } else {
                      setSubjectSetting()
                    }
                  }}
                >
                  {i?.Subject?.SubjectName}
                </SubjectItemStyled>
              )
            }
          </Col>
          {
            !!subjectSetting &&
            <>
              <BasicInformation />
              <Experiences />
              <Educations />
              <Certificates
                form={form}
                setFilesCertificate={setFilesCertificate}
                filesCertificate={filesCertificate}
              />
              <IntroVideo
                form={form}
                setFilesIntroVideo={setFilesIntroVideo}
                filesIntroVideo={filesIntroVideo}
              />
              <Col span={24}>
                <ButtonCustom
                  className="big-size primary fw-700"
                  onClick={() => {
                    if (!subjectSetting?.IsActive) {
                      handleSubmit()
                    }
                  }}
                >
                  {/* {
                user?.RegisterStatus !== 3
                  ? !!user?.IntroVideos?.length
                    ? "Hoàn thành"
                    : "Lưu"
                  : "Cập nhật"
              } */}
                  Gửi yêu cầu kiểm duyệt
                </ButtonCustom>
              </Col>
            </>
          }
        </Row>
      </Form>

      {
        !!openModalSubject &&
        <ModalSubject
          open={openModalSubject}
          onCancel={() => setOpenModalSubject(false)}
          subjectSettings={subjectSettings}
          onOk={getListSubjectSetting}
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
    </SpinCustom >
  )
}

export default SubjectSetting