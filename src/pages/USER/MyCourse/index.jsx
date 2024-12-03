import { Col, Row, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ListIcons from "src/components/ListIcons"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import CourseService from "src/services/CourseService"
import InsertUpdateCourse from "./components/InsertUpdateCourse"

const MyCourse = () => {

  const [courses, setCourses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TextSearch: ""
  })
  const [openModalUpdateCourse, setOpenModalUpdateCourse] = useState(false)
  const { listSystemKey } = useSelector(globalSelector)

  const getListCourse = async () => {
    try {
      setLoading(true)
      const res = await CourseService.getListCourseByTeacher(pagination)
      if (!!res?.isError) return
      setCourses(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (CourseID) => {
    try {
      setLoading(true)
      const res = await CourseService.deleteCourse(CourseID)
      if (!!res?.isError) return
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListCourse()
  }, [pagination])

  const listBtn = record => [
    {
      title: "Chỉnh sửa",
      icon: ListIcons?.ICON_EDIT,
      onClick: () => setOpenModalUpdateCourse(record)
    },
    {
      title: !!record?.IsDeleted ? "Hiển thị khóa học" : "Ẩn khóa học",
      icon: !!record?.IsDeleted ? ListIcons.ICON_UNBLOCK : ListIcons.ICON_BLOCK,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn muốn ${!!record?.IsDeleted ? "hiển thị khóa học" : "ẩn khóa học"} khóa học này không?`,
          okText: "Đồng ý",
          cancelText: "Đóng",
          onOk: async close => {
            handleDeleteCourse(record?._id)
            getListCourse()
            close()
          },
        })
      }
    },
  ]

  const columns = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_, record, index) => (
        <div className="text-center">{pagination?.PageSize * (pagination?.CurrentPage - 1) + index + 1}</div>
      ),
    },
    {
      title: "Tiêu đề khóa học",
      width: 100,
      align: "center",
      dataIndex: "Title",
      key: "Title",
    },
    {
      title: "Tên môn học",
      width: 100,
      align: "center",
      dataIndex: "SubjectName",
      key: "SubjectName",
      render: (_, record) => (
        <div>{record?.Subject?.SubjectName}</div>
      )
    },
    {
      title: "Số lượng slot",
      width: 50,
      align: "center",
      dataIndex: "QuantitySlot",
      key: "QuantitySlot",
    },
    {
      title: "Giá",
      width: 80,
      align: "center",
      dataIndex: "Price",
      key: "Price",
      render: (value) => (
        <div>{formatMoney(value * 1000)} VNĐ</div>
      )
    },
    {
      title: "Trình độ",
      width: 80,
      align: "center",
      dataIndex: "Level",
      key: "Level",
      render: (value) => (
        <div>
          {
            getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)
              ?.find(i => i?.ParentID === value)?.ParentName
          }
        </div>
      )
    },
    {
      title: "Số học sinh đăng ký",
      width: 50,
      align: "center",
      dataIndex: "QuantityLearner",
      key: "QuantityLearner",
    },
    {
      title: "Trạng thái",
      width: 80,
      align: "center",
      dataIndex: "IsDeleted",
      key: "IsDeleted",
      render: (value) => (
        <Tag color={!value ? "success" : "error"}>
          {!value ? "Đang sử dụng" : "Không sử dụng"}
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
      <Row gutter={[16, 16]}>
        <Col span={24} className="mb-5">
          <div className="title-type-1">
            Khóa học của bạn
          </div>
        </Col>
        <Col span={24} className="mt-16">
          <TableCustom
            isPrimary
            bordered={true}
            noMrb
            showPagination
            dataSource={courses}
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
      </Row>

      {
        !!openModalUpdateCourse &&
        <InsertUpdateCourse
          open={openModalUpdateCourse}
          onCancel={() => setOpenModalUpdateCourse(false)}
          onOk={getListCourse}
        />
      }

    </SpinCustom>
  )
}

export default MyCourse