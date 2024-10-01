import ModalCustom from "src/components/ModalCustom"
import { PatentChildBorder, TabStyled } from "../styled"
import ProfilePhoto from "../components/ProfilePhoto"
import Quotes from "../components/Quotes"
import TimeTable from "../components/TimeTable"
import Description from "../components/Description"
import IntroVideo from "../components/IntroVideo"
import { Tabs } from "antd"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ExperiencesOrEducations from "../components/ExperiencesOrEducations"
import Certificates from "../components/Certificates"

const ViewProfileTeacher = ({ open, onCancel }) => {

  const listSubjectItem = open?.SubjectSettings?.map(i => ({
    key: i?._id,
    label: `Môn học ${i?.Subject?.SubjectName}`,
    children: (
      <PatentChildBorder>
        <Quotes user={open?.SubjectSettings} />
      </PatentChildBorder>
    )
  }))

  const items = [
    {
      key: 1,
      label: "Ảnh đại diện",
      children: (
        <PatentChildBorder>
          <ProfilePhoto user={open} />
        </PatentChildBorder>
      )
    },
    ...listSubjectItem
  ]

  return (
    <ModalCustom
      open={open}
      width="80vw"
      title="Thông tin chi tiết"
      onCancel={onCancel}
      footer={
        <div className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
        </div>
      }
    >
      <TabStyled>
        <Tabs
          type="card"
          items={items}
          animated={{
            // inkBar: true,
            tabPane: true,
          }}
        />
      </TabStyled>
    </ModalCustom>
  )
}

export default ViewProfileTeacher