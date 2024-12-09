import { Col, Form, Row, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import SpinCustom from "src/components/SpinCustom"
import UserService from "src/services/UserService"
import dayjs from "dayjs"
import ModalSubject from "./modal/ModalSubject"
import { SYSTEM_KEY } from "src/lib/constant"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { getListComboKey } from "src/lib/commonFunction"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import TableCustom from "src/components/TableCustom"
import ModalUpdateSubjectSetting from "./modal/ModalUpdateSubjectSetting"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"

const SubjectSetting = () => {

  const [loading, setLoading] = useState(false)
  const [openModalSubject, setOpenModalSubject] = useState(false)
  const [subjectSettings, setSubjectSettings] = useState([])
  const [form] = Form.useForm()
  const { listSystemKey } = useSelector(globalSelector)
  const [openModalUpdateSubjectSetting, setModalUpdateSubjectSetting] = useState(false)

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

  const listBtn = record => [
    {
      title: "Chỉnh sửa",
      isDisabled: record?.IsUpdate,
      icon: ListIcons?.ICON_EDIT,
      onClick: () => setModalUpdateSubjectSetting(record)
    },
    {
      title: !!record?.IsDisabled ? "Hiển thị môn học" : "Ẩn môn học",
      isDisabled: !!record?.IsDisabledBtn,
      icon: !!record?.IsDisabled ? ListIcons.ICON_UNBLOCK : ListIcons.ICON_BLOCK,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn ${!!record?.IsDisabled ? "hiển thị môn học" : "ẩn môn học"} không?`,
          onOk: async close => {
            disabledOrEnabledSubjectSetting(record, !record?.IsDisabled)
            close()
          }
        })
      }
    },
  ]

  const column = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: "Tên môn học",
      width: 100,
      dataIndex: "SubjectName",
      align: "center",
      key: "SubjectName",
      render: (_, record) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Trạng thái đăng ký",
      width: 80,
      dataIndex: "RegisterStatus",
      align: "center",
      key: "RegisterStatus",
      render: (val) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: "Trạng thái sử dụng",
      width: 60,
      dataIndex: "IsDisabled",
      align: "center",
      key: "IsDisabled",
      render: (val) => (
        <Tag color={!val ? "success" : "error"} className="p-5 fs-16">
          {
            !val ? "Đang sử dụng" : "Đã ẩn"
          }
        </Tag>
      )
    },
    {
      title: "Ngày cập nhật",
      width: 60,
      dataIndex: "updatedAt",
      align: "center",
      key: "updatedAt",
      render: (val) => (
        <div>{dayjs(val).format("DD/MM/YYYY")}</div>
      )
    },
    {
      title: "Chức năng",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          {
            listBtn(record)?.map((i, idx) =>
              <ButtonCircle
                key={idx}
                title={i?.title}
                icon={i?.icon}
                disabled={i?.isDisabled}
                onClick={i?.onClick}
              />
            )
          }
        </Space>
      ),
    }
  ]


  return (
    <SpinCustom spinning={loading}>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24} className="d-flex-sb mb-10">
            <div className="title-type-1">Danh sách môn học</div>
            <Space>
              <ButtonCustom
                className="third-type-2"
                onClick={() => setOpenModalSubject(true)}
              >
                Thêm môn học
              </ButtonCustom>
            </Space>
          </Col>
          <Col span={24} className="mb-20">
            <TableCustom
              isPrimary
              bordered
              noMrb
              showPagination
              dataSource={subjectSettings}
              columns={column}
              editableCell
              sticky={{ offsetHeader: -12 }}
              textEmpty="Không có dữ liệu"
              rowKey="key"
              pagination={false}
            />
          </Col>
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
        !!openModalUpdateSubjectSetting &&
        <ModalUpdateSubjectSetting
          open={openModalUpdateSubjectSetting}
          onCancel={() => setModalUpdateSubjectSetting(false)}
          onOk={getListSubjectSetting}
        />
      }

    </SpinCustom >
  )
}

export default SubjectSetting