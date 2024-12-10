import ModalCustom from "src/components/ModalCustom"
import { PatentChildBorder, TabStyled } from "../styled"
import { Space, Tabs } from "antd"
import Information from "../components/Information"
import BankInfor from "../components/BankInfor"
import Schedules from "../components/Schedules"
import LearnHistories from "../components/LearnHistories"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { useState } from "react"
import ModalReasonReject from "./ModalReasonReject"


const ViewProfileTeacher = ({
  open,
  onCancel,
  handleConfirmRegister,
  onOk
}) => {

  const [loading, setLoading] = useState(false)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)

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
      label: "Lịch sử giảng dạy",
      children: (
        <PatentChildBorder>
          <LearnHistories user={open} />
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
            disabled={open?.IsConfirm}
            loading={loading}
            onClick={() => handleConfirmRegister({ ...open, isModalDetail: true }, setLoading, onCancel)}
          >
            Duyệt
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            disabled={open?.IsReject}
            onClick={() => setOpenModalReasonReject({ ...open, isModalDetail: true })}
          >
            Không duyệt
          </ButtonCustom>
        </Space>
      }
    >
      <TabStyled>
        <Tabs
          type="card"
          items={items}
          animated={{
            tabPane: true,
          }}
        />
      </TabStyled>

      {
        !!openModalReasonReject &&
        <ModalReasonReject
          open={openModalReasonReject}
          onCancel={() => setOpenModalReasonReject(false)}
          cancelModalDetail={onCancel}
          onOk={onOk}
        />
      }

    </ModalCustom>
  )
}

export default ViewProfileTeacher