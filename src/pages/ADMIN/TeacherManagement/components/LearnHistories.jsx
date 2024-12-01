import { Col, Row, Select, Space, Tag } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import LearnHistoryService from "src/services/LearnHistoryService"
import SubjectService from "src/services/SubjectService"
import ModalViewTimeTable from "../modal/ModalViewTimetable"
import SpinCustom from "src/components/SpinCustom"

const { Option } = Select

const LearnHistories = ({ user }) => {

  const [loading, setLoading] = useState(false)
  const [learnhistories, setLearnHistories] = useState([])
  const [total, setTotal] = useState(0)
  const { listSystemKey } = useSelector(globalSelector)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    PageSize: 10,
    CurrentPage: 1,
    UserID: user?._id,
    RoleID: user?.RoleID,
    LearnedStatus: 0,
    SubjectID: ""
  })
  const [subjects, setSubjects] = useState([])
  const [openModalViewTimeTable, setOpenModalViewTimeTable] = useState(false)

  const getListLearnHistoryOfUser = async () => {
    try {
      setLoading(true)
      const res = await LearnHistoryService.getListLearnHistoryOfUser(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setLearnHistories(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const getListSubject = async () => {
    try {
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      console.log()
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  useEffect(() => {
    getListLearnHistoryOfUser()
  }, [pagination])

  const columns = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: "Tên học sinh",
      width: 100,
      dataIndex: "FullName",
      align: "center",
      key: "FullName",
      render: (text, record) => (
        <div>{record?.Student?.FullName}</div>
      ),
    },
    {
      title: "Môn học",
      width: 80,
      dataIndex: "SubjectName",
      align: "center",
      key: "SubjectName",
      render: (text, record) => (
        <div>{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: "Ngày đăng ký",
      width: 80,
      dataIndex: "RegisterDate",
      align: "center",
      key: "RegisterDate",
      render: (val) => (
        <div>{dayjs(val).format("DD/MM/YYYY HH:mm")}</div>
      ),
    },
    {
      title: "Tổng số buổi học",
      width: 80,
      dataIndex: "TotalLearned",
      align: "center",
      key: "TotalLearned"
    },
    {
      title: "Số buổi đã học",
      width: 80,
      dataIndex: "LearnedNumber",
      align: "center",
      key: "LearnedNumber"
    },
    {
      title: "Trạng thái lịch dạy",
      width: 80,
      dataIndex: "LearnedStatus",
      align: "center",
      key: "LearnedStatus",
      render: (val) => (
        <Tag color={["processing", "success"][val - 1]} className="p-5 fs-16">
          {
            getListComboKey(SYSTEM_KEY.LEARNED_STATUS, listSystemKey)?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      ),
    },
    {
      title: "Chức năng",
      width: 60,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          <ButtonCircle
            title="Chi tiết"
            icon={ListIcons?.ICON_VIEW}
            onClick={() => setOpenModalViewTimeTable(record?._id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={14}>
          <InputCustom
            type="isSearch"
            placeholder="Tìm kiếm môn học..."
            allowClear
            onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            showSearch
            allowClear
            placeholder="Chọn môn học"
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
            placeholder="Trạng thái môn học"
            onChange={e => setPagination(pre => ({ ...pre, LearnedStatus: e }))}
          >
            {
              getListComboKey(SYSTEM_KEY.LEARNED_STATUS, listSystemKey).map(Learn => (
                <Select.Option key={Learn._id} value={Learn.ParentID}>
                  {Learn?.ParentName}
                </Select.Option>
              ))
            }
          </Select>
        </Col>
        <Col span={24}>
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            dataSource={learnhistories}
            columns={columns}
            editableCell
            sticky={{ offsetHeader: -12 }}
            textEmpty="Không có dữ liệu"
            rowKey="_id"
            pagination={false}
          />
        </Col>

        {
          !!openModalViewTimeTable &&
          <ModalViewTimeTable
            open={openModalViewTimeTable}
            onCancel={() => setOpenModalViewTimeTable(false)}
            onOk={getListLearnHistoryOfUser}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default LearnHistories