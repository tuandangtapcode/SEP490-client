import { Col, Row, Select, Space, Tag } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { Roles, SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import LearnHistoryService from "src/services/LearnHistoryService"
import ModalSendFeedback from "src/pages/USER/StudiedSubject/components/ModalSendFeedback"
import SpinCustom from "src/components/SpinCustom"
import ModalViewLearnHistory from "./components/ModalViewLearnHistory"
import SubjectService from "src/services/SubjectService"

const { Option } = Select

const StudiedSubject = () => {

  const [loading, setLoading] = useState(false)
  const [listSubject, setListSubject] = useState([])
  const [total, setTotal] = useState(0)
  const [openModalSendFeedback, setOpenModalSendFeedback] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: "",
    LearnedStatus: 0,
    SubjectID: ""
  })
  const [subjects, setSubjects] = useState([])
  const { listSystemKey, user } = useSelector(globalSelector)
  const LearnedStatusKey = getListComboKey(SYSTEM_KEY.LEARNED_STATUS, listSystemKey)
  const [openModalViewLearnHistory, setOpenModalViewLearnHistory] = useState(false)

  const getListLearnHistory = async () => {
    try {
      setLoading(true)
      const res = await LearnHistoryService.getListLearnHistory(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setListSubject(res?.data?.List)
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
    getListLearnHistory()
  }, [pagination])

  const commonColumns = [
    {
      title: 'STT',
      width: 35,
      align: 'center',
      dataIndex: '_id',
      key: '_id',
      render: (_, record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: 'Tên môn học',
      width: 70,
      align: 'center',
      dataIndex: 'SubjectName',
      key: 'SubjectName',
      render: (text, record) => (
        <div>{record?.Subject?.SubjectName}</div>
      ),
    },
    {
      title: 'Số lượng buổi học',
      width: 80,
      align: 'center',
      dataIndex: 'TotalLearned',
      key: 'TotalLearned',
    },
    {
      title: user?.RoleID === Roles.ROLE_STUDENT ? 'Giáo viên phụ trách' : "Tên học sinh",
      width: 80,
      align: 'center',
      dataIndex: 'Teacher',
      key: 'Teacher',
      render: (text, record) => (
        <div>{record?.[user?.RoleID === Roles.ROLE_STUDENT ? "Teacher" : "Student"]?.FullName}</div>
      ),
    },
    {
      title: "Số buổi đã học",
      width: 80,
      dataIndex: "LearnedNumber",
      align: "center",
      key: "LearnedNumber"
    },
    {
      title: 'Ngày đăng ký',
      width: 80,
      align: 'center',
      dataIndex: 'RegisterDate',
      key: 'RegisterDate',
      render: (text, record) => (
        <div>{moment(record?.RegisterDate).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: "Trạng thái",
      width: 80,
      dataIndex: "LearnedStatus",
      align: "center",
      key: "LearnedStatus",
      render: (val) => (
        <Tag color={["processing", "success"][val - 1]} className="p-5 fs-16">
          {
            LearnedStatusKey?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
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
            onClick={() => setOpenModalViewLearnHistory(record?._id)}
          />
          {
            user?.RoleID === Roles.ROLE_STUDENT &&
            <ButtonCircle
              key={record?.LearnedStatus}
              disabled={!!record?.IsFeedback ? false : true}
              title="Đánh giá giáo viên"
              icon={ListIcons?.ICON_RATE}
              onClick={() => setOpenModalSendFeedback(record)}
            />
          }
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24} className="mb-5">
          <div className="title-type-1">
            {user?.RoleID === Roles.ROLE_TEACHER ?
              "DANH SÁCH CÁC MÔN ĐÃ DẠY"
              :
              "DANH SÁCH CÁC MÔN ĐÃ THAM GIA"
            }

          </div>
        </Col>
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
            {LearnedStatusKey.map(Learn => (
              <Select.Option key={Learn._id} value={Learn.ParentID}>
                {Learn?.ParentName}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={24} className="mt-16">
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            dataSource={listSubject}
            columns={commonColumns}
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
                    setPagination(pre => ({
                      ...pre,
                      CurrentPage,
                      PageSize,
                    })),
                }
                : false
            }
          />
        </Col>

        {
          !!openModalSendFeedback &&
          <ModalSendFeedback
            open={openModalSendFeedback}
            onCancel={() => setOpenModalSendFeedback(false)}
            onOk={getListLearnHistory}
          />
        }

        {
          !!openModalViewLearnHistory &&
          <ModalViewLearnHistory
            open={openModalViewLearnHistory}
            onCancel={() => setOpenModalViewLearnHistory(false)}
          />
        }

      </Row>
    </SpinCustom>
  )
}

export default StudiedSubject
