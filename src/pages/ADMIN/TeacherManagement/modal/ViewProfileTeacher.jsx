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

const ViewProfileTeacher = ({ open, onCancel }) => {

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
    {
      key: 2,
      label: "Môn học",
      children: (
        <PatentChildBorder>
          <Quotes user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 3,
      label: "Lịch học và giá",
      children: (
        <PatentChildBorder>
          <TimeTable user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 4,
      label: "Kinh nghiệm",
      children: (
        <PatentChildBorder>
          <ExperiencesOrEducations user={open} isExperience={true} />
        </PatentChildBorder>
      )
    },
    {
      key: 5,
      label: "Học vấn",
      children: (
        <PatentChildBorder>
          <ExperiencesOrEducations user={open} isExperience={false} />
        </PatentChildBorder>
      )
    },
    {
      key: 6,
      label: "Mô tả thêm",
      children: (
        <PatentChildBorder>
          <Description user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 7,
      label: "Video intro",
      children: (
        <PatentChildBorder>
          <IntroVideo user={open} />
        </PatentChildBorder>
      )
    }
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