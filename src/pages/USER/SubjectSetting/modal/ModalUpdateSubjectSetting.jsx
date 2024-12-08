import { Form, Space } from "antd"
import { useEffect, useState } from "react"
import ModalCustom from "src/components/ModalCustom"
import dayjs from "dayjs"
import { getRealFee } from "src/lib/stringUtils"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import BasicInformation from "../components/BasicInformation"
import Experiences from "../components/Experiences"
import Educations from "../components/Educations"
import Certificates from "../components/Certificates"
import IntroVideo from "../components/IntroVideo"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import FileService from "src/services/FileService"
import UserService from "src/services/UserService"
import { toast } from "react-toastify"
import NotificationService from "src/services/NotificationService"
import { STAFF_ID } from "src/lib/constant"
import socket from "src/utils/socket"

const ModalUpdateSubjectSetting = ({ open, onCancel, onOk }) => {

  const [form] = Form.useForm()
  const { user, profitPercent, listSystemKey } = useSelector(globalSelector)
  const [filesCertificate, setFilesCertificate] = useState([])
  const [filesIntroVideo, setFilesIntroVideo] = useState([])
  const [totalFee, setTotalFee] = useState(0)
  const [loading, setLoading] = useState(false)

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
      const rawCertificates = filesCertificate?.map(i => i.url)
      const rawIntroVideos = filesIntroVideo?.map(i => i.url)
      const resSubjectSetting = await UserService.updateSubjectSetting({
        SubjectSettingID: open?._id,
        SubjectID: open?.Subject?._id,
        Quote: {
          Title: values?.TitleQuote,
          Content: values?.ContentQuote
        },
        Certificates: !!dataCertificate?.length
          ? [...rawCertificates, ...dataCertificate]
          : rawCertificates,
        IntroVideos: !!dataIntroVideo?.length
          ? [...rawIntroVideos, ...dataIntroVideo]
          : rawIntroVideos,
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
        Price: values?.Price * 1000,
        ExpensePrice: getRealFee(values?.Price * 1000, profitPercent),
        LearnTypes: values?.LearnTypes
      })
      if (!!resSubjectSetting?.isError) return toast.error(resSubjectSetting?.msg)
      const resNotification = await NotificationService.createNotification({
        Content: `${user?.FullName} đã gửi yêu cầu duyệt môn học cho bạn`,
        Type: "teacher",
        Receiver: STAFF_ID
      })
      if (!!resNotification?.isError) return
      socket.emit('send-notification',
        {
          Content: resNotification?.data?.Content,
          IsSeen: resNotification?.IsSeen,
          _id: resNotification?.data?._id,
          Type: resNotification?.data?.Type,
          IsNew: resNotification?.data?.IsNew,
          Receiver: STAFF_ID,
          createdAt: resNotification?.data?.createdAt
        })
      toast.success("Yêu cầu kiểm duyệt đã được gửi")
      onOk()
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const data = {
      TitleQuote: open?.Quote?.Title,
      ContentQuote: open?.Quote?.Content,
      LearnTypes: open?.LearnTypes,
      Price: open?.Price / 1000,
      Levels: open?.Levels,
      experiences: !!open?.Experiences?.length
        ? open?.Experiences?.map(i => ({
          ...i,
          Date: [dayjs(i?.StartDate), dayjs(i?.EndDate)]
        }))
        : [{}],
      educations: !!open?.Educations?.length
        ? open?.Educations?.map(i => ({
          ...i,
          Date: [dayjs(i?.StartDate), dayjs(i?.EndDate)]
        }))
        : [{}],
      Certificates: open?.Certificates?.map((i, idx) => ({
        url: i,
        id: idx + 1
      })),
      IntroVideos: open?.IntroVideos?.map((i, idx) => ({
        url: i,
        id: idx + 1
      }))
    }
    form.setFieldsValue(data)
    setTotalFee(getRealFee(open?.Price, profitPercent))
    setFilesCertificate(data.Certificates)
    setFilesIntroVideo(data.IntroVideos)
  }, [open])


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chỉnh sửa môn học"
      width="80vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            loading={loading}
            onClick={() => {
              handleSubmit()
            }}
          >
            Gửi yêu cầu kiểm duyệt
          </ButtonCustom>
        </Space>
      }
    >
      <Form form={form}>
        <BasicInformation
          totalFee={totalFee}
          setTotalFee={setTotalFee}
          subjectSetting={open}
        />
        <Experiences subjectSetting={open} />
        <Educations subjectSetting={open} />
        <Certificates
          form={form}
          setFilesCertificate={setFilesCertificate}
          filesCertificate={filesCertificate}
          subjectSetting={open}
        />
        <IntroVideo
          form={form}
          setFilesIntroVideo={setFilesIntroVideo}
          filesIntroVideo={filesIntroVideo}
          subjectSetting={open}
        />
      </Form>
    </ModalCustom>
  )
}

export default ModalUpdateSubjectSetting