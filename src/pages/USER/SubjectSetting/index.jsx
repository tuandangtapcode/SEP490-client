import { Col, Form, List, message, Row, Space } from "antd"
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
import { getRealFee } from "src/lib/stringUtils"

const SubjectSetting = () => {

  const [loading, setLoading] = useState(false)
  const [openModalSubject, setOpenModalSubject] = useState(false)
  const [subjectSettings, setSubjectSettings] = useState([])
  const [subjectSetting, setSubjectSetting] = useState()
  const [form] = Form.useForm()
  const [filesCertificate, setFilesCertificate] = useState([])
  const [filesIntroVideo, setFilesIntroVideo] = useState([])
  const { user, profitPercent } = useSelector(globalSelector)
  const [totalFee, setTotalFee] = useState(0)

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
      let resCertificate, resIntroVideo
      if (!!values?.Certificates?.some(i => !!i?.originFileObj)) {
        resCertificate = FileService.uploadFileList({
          FileList: values?.Certificates?.map(i => i?.originFileObj)
        })
      }
      if (!!values?.IntroVideos?.some(i => !!i?.originFileObj)) {
        resIntroVideo = FileService.uploadFileList({
          FileList: values?.IntroVideos?.map(i => i?.originFileObj)
        })
      }
      const resultFile = await Promise.all([resCertificate, resIntroVideo])
      if (!!resultFile[0]?.isError || !!resultFile[1]?.isError) return
      const dataCertificate = resultFile[0]?.data
      const dataIntroVideo = resultFile[1]?.data
      const resSubjectSetting = await UserService.updateSubjectSetting({
        SubjectSettingID: subjectSetting?._id,
        SubjectID: subjectSetting?.Subject?._id,
        Quote: {
          Title: values?.TitleQuote,
          Content: values?.ContentQuote
        },
        Certificates: !!dataCertificate?.length
          ? [...filesCertificate, ...dataCertificate]
          : filesCertificate,
        IntroVideos: !!dataIntroVideo?.length
          ? [...filesIntroVideo, ...dataIntroVideo]
          : filesIntroVideo,
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
      const resNotification = await NotificationService.createNotification({
        Content: `${user?.FullName} đã gửi yêu cầu duyệt profile cho bạn`,
        Type: "teacher",
        Receiver: ADMIN_ID
      })
      if (!!resNotification?.isError) return
      socket.emit('send-notification',
        {
          Content: resNotification?.data?.Content,
          IsSeen: resNotification?.IsSeen,
          _id: resNotification?.data?._id,
          Type: resNotification?.data?.Type,
          IsNew: resNotification?.data?.IsNew,
          Receiver: ADMIN_ID,
          createdAt: resNotification?.data?.createdAt
        })
      toast.success("Yêu cầu kiểm duyệt đã được gửi")
      setSubjectSetting(resSubjectSetting?.data)
    } finally {
      setLoading(false)
    }
  }

  const disabledOrEnabledSubjectSetting = async (SubjectSettingID, IsDisabled) => {
    try {
      setLoading(true)
      const res = await UserService.disabledOrEnabledSubjectSetting({
        SubjectSettingID,
        IsDisabled
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getListSubjectSetting()
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
      setTotalFee(getRealFee(subjectSetting?.Price, profitPercent))
      setFilesCertificate(subjectSetting?.Certificates)
      setFilesIntroVideo(subjectSetting?.IntroVideos)
    }
  }, [subjectSetting?.Subject?._id])


  return (
    <SpinCustom spinning={loading}>
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24} className="d-flex-sb mb-10">
            <div className="fs-18 fw-600">Danh sách môn học</div>
            <Space>
              <ButtonCustom
                className="third-type-2"
                onClick={() => setOpenModalSubject(true)}
              >
                Thêm Môn học
              </ButtonCustom>
            </Space>
          </Col>
          <Col span={24} className="mb-20">
            <List
              dataSource={subjectSettings}
              renderItem={i => (
                <SubjectItemStyled
                  className={!!i?.IsDisabled ? "disabled" : ""}
                >
                  <List.Item
                    actions={[
                      <ButtonCustom
                        key={1}
                        className={`${subjectSetting?.Subject?._id === i?.Subject?._id ? "primary" : "third"} mini-size`}
                        onClick={() => {
                          if (i?.Subject?._id !== subjectSetting?.Subject?._id) {
                            setSubjectSetting(i)
                          } else {
                            setSubjectSetting()
                          }
                        }}
                      >
                        Chọn
                      </ButtonCustom>,
                      <ButtonCustom
                        key={2}
                        className={`third mini-size`}
                        onClick={() => {
                          if (!i?.IsDisabled) {
                            disabledOrEnabledSubjectSetting(i, true)
                          } else {
                            disabledOrEnabledSubjectSetting(i, false)
                          }
                        }}
                      >
                        {
                          !i?.IsDisabled
                            ? "Ẩn môn học"
                            : "Hiện môn học"
                        }
                      </ButtonCustom>
                    ]}
                  >
                    {i?.Subject?.SubjectName}
                  </List.Item>
                </SubjectItemStyled>
              )}
            />
            {/* {
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
            } */}
          </Col>
          {
            !!subjectSetting &&
            <>
              <BasicInformation
                totalFee={totalFee}
                setTotalFee={setTotalFee}
                subjectSetting={subjectSetting}
              />
              <Experiences subjectSetting={subjectSetting} />
              <Educations subjectSetting={subjectSetting} />
              <Certificates
                form={form}
                setFilesCertificate={setFilesCertificate}
                filesCertificate={filesCertificate}
                subjectSetting={subjectSetting}
              />
              <IntroVideo
                form={form}
                setFilesIntroVideo={setFilesIntroVideo}
                filesIntroVideo={filesIntroVideo}
                subjectSetting={subjectSetting}
              />
              {
                subjectSetting?.RegisterStatus !== 2 &&
                <Col span={24}>
                  <ButtonCustom
                    className="medium-size primary fw-700 mb-12"
                    onClick={() => {
                      handleSubmit()
                    }}
                  >
                    Gửi yêu cầu kiểm duyệt
                  </ButtonCustom>
                </Col>
              }
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

    </SpinCustom >
  )
}

export default SubjectSetting