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
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import LearnHistoryService from "src/services/LearnHistoryService"
import ModalReportMentor from "../SchedulePage/components/ModalReportMentor"
import ModalSendFeedback from "src/pages/ANONYMOUS/TeacherDetail/modal/ModalSendFeedback"

const StudiedSubject = () => {
  const [loading, setLoading] = useState(false)
  const [listSubject, setListSubject] = useState([])
  const [total, setTotal] = useState(0)
  const [modalReportMentor, setModalReportMentor] = useState(false)
  const [openModalSendFeedback, setOpenModalSendFeedback] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: ""
  })

  const { user } = useSelector(globalSelector)


  const { listSystemKey } = useSelector(globalSelector)
  const LearnedStatusKey = getListComboKey(SYSTEM_KEY.LEARNED_STATUS, listSystemKey)

  const getListLearnHistory = async () => {
    try {
      setLoading(true)
      const res = await LearnHistoryService.getListLearnHistory(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListSubject(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination?.PageSize) {
      getListLearnHistory()
    }
  }, [pagination])



  const columns = [
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
      width: 50,
      align: 'center',
      dataIndex: 'TotalLearned',
      key: 'TotalLearned',
    },
    {
      title: 'Giáo viên phụ trách',
      width: 80,
      align: 'center',
      dataIndex: 'Teacher',
      key: 'Teacher',
      render: (text, record) => (
        <div>{record?.Teacher?.FullName}</div>
      ),
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
      render: (val, record) => (
        <Tag color={["processing", "success"][val - 1]} className="p-5 fs-16">
          {
            LearnedStatusKey?.find(i => i?.ParentID === val)?.ParentName
          }
        </Tag>
      )
    },
    {
      title: 'Chức năng',
      width: 40,
      align: 'center',
      dataIndex: 'function',
      key: 'function',
      render: (_, record) => (
        <>
          {record?.LearnedStatus === 1 &&
            <ButtonCircle
              key={record?.LearnedStatus}
              title="Báo cáo giáo viên"
              icon={ListIcons?.ICON_WARNING}
              onClick={() => setModalReportMentor(record)}
            />
          }
          {record?.LearnedStatus === 2 &&
            <ButtonCircle
              key={record?.LearnedStatus}
              title="Đánh giá giáo viên"
              icon={ListIcons?.ICON_RATE}
              onClick={() => setOpenModalSendFeedback(record)}
            />
          }
        </>
      ),
    },
  ]

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} className="mb-5">
        <div className="title-type-1">
          {user?.RoleID === 3 ?
            "DANH SÁCH CÁC MÔN ĐÃ DẠY"
            :
            "DANH SÁCH CÁC MÔN ĐÃ THAM GIA"
          }

        </div>
      </Col>
      <Col span={18}>
        <InputCustom
          type="isSearch"
          placeholder="Tìm kiếm môn học..."
          onSearch={e => setPagination(pre => ({ ...pre, TextSearch: e }))}
        />
      </Col>
      <Col span={6}>
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
          loading={loading}
          dataSource={listSubject}
          columns={columns}
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
        !!modalReportMentor &&
        <ModalReportMentor
          open={modalReportMentor}
          onCancel={() => setModalReportMentor(false)}
        />
      }
      {
        !!openModalSendFeedback &&
        <ModalSendFeedback
          open={openModalSendFeedback}
          onCancel={() => setOpenModalSendFeedback(false)}
        />
      }
    </Row>
  )
}

export default StudiedSubject
