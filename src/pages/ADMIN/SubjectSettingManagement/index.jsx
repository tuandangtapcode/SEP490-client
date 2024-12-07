import { Col, Row, Select, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import UserService from "src/services/UserService"
import InputCustom from "src/components/InputCustom"
import socket from "src/utils/socket"
import SpinCustom from "src/components/SpinCustom"
import { toast } from "react-toastify"
import SubjectService from "src/services/SubjectService"
import { formatMoney } from "src/lib/stringUtils"
import ModalViewSubjectSetting from "./components/ModalViewSubjectSetting"
import ModalReasonReject from "./components/ModalReasonReject"

const { Option } = Select

const SubjectSettingManagement = () => {

  const [loading, setLoading] = useState(false)
  const [subjectSettings, setSubjectSettings] = useState([])
  const [total, setTotal] = useState(0)
  const [openViewSubjectSetting, setOpenViewSubjectSetting] = useState(false)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
    SubjectID: "",
    Level: [],
    LearnType: 0,
  })
  const { listSystemKey } = useSelector(globalSelector)
  const [subjects, setSubjects] = useState([])

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  const getListSubjectSetting = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListSubjectSetting(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjectSettings(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  useEffect(() => {
    getListSubjectSetting()
  }, [pagination])

  const handleConfirmSubjectSetting = async (record) => {
    try {
      setLoading(true)
      const res = await UserService.responseConfirmSubjectSetting({
        SubjectSettingID: record?._id,
        FullName: record?.Teacher?.FullName,
        RegisterStatus: 3,
        Email: record?.Teacher?.Email
      })
      if (!!res?.isError) return toast.error(res?.msg)
      getListSubjectSetting()
    } finally {
      setLoading(false)
    }
  }


  const listBtn = record => [
    {
      title: "Xem chi tiết",
      isDisabled: false,
      icon: ListIcons?.ICON_VIEW,
      onClick: () => setOpenViewSubjectSetting(record)
    },
    {
      title: "Duyệt",
      icon: ListIcons?.ICON_CONFIRM,
      isDisabled: record?.IsConfirm,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn duyệt môn học của giáo viên ${record?.Teacher?.FullName} không?`,
          onOk: async close => {
            handleConfirmSubjectSetting(record)
            close()
          }
        })
      }
    },
    {
      title: "Không duyệt",
      icon: ListIcons?.ICON_CLOSE,
      isDisabled: record?.IsReject,
      onClick: () => setOpenModalReasonReject(record)
    },
  ]

  const column = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: "Tên giáo viên",
      width: 100,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
      render: (_, record, index) => (
        <div className="text-center">{record?.Teacher?.FullName}</div>
      ),
    },
    {
      title: "Môn học",
      width: 80,
      align: "center",
      key: "SubjectName",
      dataIndex: "SubjectName",
      render: (_, record, index) => (
        <div className="text-center">{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Giá",
      width: 80,
      align: "center",
      key: "Price",
      dataIndex: "Price",
      render: (_, record, index) => (
        <div className="text-center">
          {
            !!record?.Price
              ? `${formatMoney(record?.Price)} VNĐ`
              : ""
          }
        </div>
      ),
    },
    {
      title: "Trạng thái đăng ký",
      width: 80,
      dataIndex: "RegisterStatus",
      align: "center",
      key: "RegisterStatus",
      render: (val, record) => (
        <Tag color={["processing", "warning", "success", "error"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)
              ?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
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
                disabled={i?.isDisabled}
                title={i?.title}
                icon={i?.icon}
                onClick={i?.onClick}
              />
            )
          }
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 16]}>
        <Col span={24} className="mb-16">
          <div className="title-type-1"> QUẢN LÝ TÀI KHOẢN GIÁO VIÊN</div>
        </Col>
        <Col span={12}>
          <InputCustom
            type="isSearch"
            placeholder="Nhập vào tên giáo viên"
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Chọn môn học"
            allowClear
            showSearch
            onChange={e => setPagination(pre => ({ ...pre, SubjectID: e }))}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              subjects?.map(i =>
                <Option
                  key={i?._id}
                  value={i?._id}
                >
                  {i?.SubjectName}
                </Option>
              )
            }
          </Select>
        </Col>
        <Col span={4}>
          <Select
            mode="multiple"
            allowClear
            showSearch={false}
            placeholder="Chọn level"
            onChange={e => setPagination(pre => ({ ...pre, Level: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map(i =>
                <Option
                  key={i?.ParentID}
                  value={i?.ParentID}
                >
                  {i?.ParentName}
                </Option>
              )
            }
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Tình trạng đăng ký"
            allowClear
            onChange={e => setPagination(pre => ({ ...pre, RegisterStatus: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.REGISTER_STATUS, listSystemKey)?.map(i =>
                <Option
                  key={i?.ParentID}
                  value={i?.ParentID}
                >
                  {i?.ParentName}
                </Option>
              )
            }
          </Select>
        </Col>
        <Col span={24}>
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
            pagination={
              !!pagination?.PageSize
                ? {
                  hideOnSinglePage: total <= 10,
                  current: pagination?.CurrentPage,
                  pageSize: pagination?.PageSize,
                  responsive: true,
                  total,
                  showSizeChanger: total > 10,
                  locale: { items_per_page: "" },
                  onChange: (CurrentPage, PageSize) =>
                    setPagination({
                      ...pagination,
                      CurrentPage,
                      PageSize,
                    }),
                }
                : false
            }
          />
        </Col>

        {
          !!openViewSubjectSetting &&
          <ModalViewSubjectSetting
            open={openViewSubjectSetting}
            onCancel={() => setOpenViewSubjectSetting(false)}
          />
        }

        {
          !!openModalReasonReject &&
          <ModalReasonReject
            open={openModalReasonReject}
            onCancel={() => setOpenModalReasonReject(false)}
            onOk={getListSubjectSetting}
          />
        }

      </Row>

    </SpinCustom>
  )
}

export default SubjectSettingManagement