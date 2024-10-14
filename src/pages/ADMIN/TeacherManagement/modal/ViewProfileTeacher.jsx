import ModalCustom from "src/components/ModalCustom"
import { PatentChildBorder, TabStyled } from "../styled"
import AvatarAndSchedule from "../components/AvatarAndSchedule"
import { Tabs } from "antd"
import SubjectSettingItem from "../components/SubjectSettingItem"


const ViewProfileTeacher = ({ open, onCancel, getListTeacher }) => {

  const listSubjectItem = open?.SubjectSettings?.map(i => ({
    key: i?._id,
    label: `Môn học ${i?.Subject?.SubjectName}`,
    children: (
      <PatentChildBorder>
        <SubjectSettingItem
          subjectSetting={i}
          email={open.Account.Email}
          fullName={open.FullName}
          getListTeacher={getListTeacher}
          onCancel={onCancel}
        />
      </PatentChildBorder>
    )
  }))

  const items = [
    {
      key: 1,
      label: "Ảnh đại diện",
      children: (
        <PatentChildBorder>
          <AvatarAndSchedule user={open} />
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
      footer={null}
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