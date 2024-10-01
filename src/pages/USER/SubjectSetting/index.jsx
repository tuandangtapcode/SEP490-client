import { Col, Form, Row } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import { SubjectItemStyled } from "./styled"
import BasicInformation from "./components/BasicInformation"
import TimeTable from "./components/TimeTable"
import Experiences from "./components/Experiences"
import Educations from "./components/Educations"
import Certificates from "./components/Certificates"
import IntroVideo from "./components/IntroVideo"
import dayjs from "dayjs"
import ModalSubject from "./modal/ModalSubject"

const SubjectSetting = () => {

  const [loading, setLoading] = useState(false)
  const [openModalSubject, setOpenModalSubject] = useState(false)
  const [subjectSettings, setSubjectSettings] = useState([])
  const [subjectSetting, setSubjectSetting] = useState()
  const [subjectID, setSubjectID] = useState("")
  const [form] = Form.useForm()
  const [filesCertificate, setFilesCertificate] = useState([])
  const [filesIntroVideo, setFilesIntroVideo] = useState([])
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
      console.log("values", values);

      // const resSubjectSetting = await UserService.updateSubjectSetting({
      //   ...va
      // })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubjectSetting()
  }, [])

  useEffect(() => {
    if (!!subjectID) {
      form.setFieldsValue({
        TitleQuote: subjectSetting?.Quote?.Title,
        ContentQuote: subjectSetting?.Quote?.Content,
        LearnTypes: subjectSetting?.LearnTypes,
        Price: subjectSetting?.Price,
        Levels: subjectSetting?.Levels,
        experiences: !!subjectSetting?.Experiences?.length
          ? subjectSetting?.Experiences
          : [{}],
        educations: !!subjectSetting?.Educations?.length
          ? subjectSetting?.Experiences
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
    }
  }, [subjectID])

  return (
    <SpinCustom spinning={loading}>
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24} className="d-flex-sb mb-10">
            <div className="fs-18 fw-600">Danh sách môn học</div>
            <ButtonCustom
              className="primary"
              onClick={() => setOpenModalSubject(true)}
            >
              Thêm Môn học
            </ButtonCustom>
          </Col>
          <Col span={24} className="mb-20">
            {
              subjectSettings?.map((i, idx) =>
                <SubjectItemStyled
                  className={subjectID === i?.Subject?._id ? "active" : ""}
                  key={idx}
                  onClick={() => {
                    if (!subjectID) {
                      const subjectSetting = subjectSettings?.find(i => i?.Subject?._id === subjectID)
                      setSubjectSetting(subjectSetting)
                      setSubjectID(i?.Subject?._id)
                    } else {
                      setSubjectID("")
                    }
                  }}
                >
                  {i?.Subject?.SubjectName}
                </SubjectItemStyled>
              )
            }
          </Col>
          {
            !!subjectID &&
            <>
              <BasicInformation />
              <TimeTable
                schedules={schedules}
                setSchedules={setSchedules}
              />
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
                    handleSubmit()
                    // if (user?.RegisterStatus === 3 || !user?.IntroVideos?.length) {
                    //   handleSubmit()
                    // }
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
    </SpinCustom >
  )
}

export default SubjectSetting