import ModalCustom from "src/components/ModalCustom"
import { PatentChildBorder, TabStyled } from "../styled"
import { Tabs } from "antd"
import Information from "../components/Information"
import BankInfor from "../components/BankInfor"
import Schedules from "../components/Schedules"
import TimeTables from "../components/TimeTables"


const ViewProfileTeacher = ({ open, onCancel }) => {

  const items = [
    {
      key: 1,
      label: "Thông tin giáo viên",
      children: (
        <PatentChildBorder>
          <Information user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 2,
      label: "Lịch trình giảng dạy",
      children: (
        <PatentChildBorder>
          <Schedules user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 3,
      label: "Thông tin ngân hàng",
      children: (
        <PatentChildBorder>
          <BankInfor user={open} />
        </PatentChildBorder>
      )
    },
    {
      key: 4,
      label: "Thông tin lịch dạy",
      children: (
        <PatentChildBorder>
          <TimeTables user={open} />
        </PatentChildBorder>
      )
    },
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