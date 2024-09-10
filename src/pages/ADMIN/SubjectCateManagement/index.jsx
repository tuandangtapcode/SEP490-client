import { Button, Col, Row, Space, Table } from "antd"
import { useEffect, useState } from "react"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import TableCustom from "src/components/TableCustom"
import SubjectCateService from "src/services/SubjectCateService"
import InsertUpdateSubjectCate from "./components/modal/InsertUpdateSubjectCate"
import ListIcons from "src/components/ListIcons"
import CB1 from "src/components/Modal/CB1"
import ModalSubject from "./components/Subject"
import Notice from "src/components/Notice"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"

const SubjectCateManagement = () => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [openModalSubject, setOpenModalSubject] = useState(false)
  const [openModalSubjectCate, setOpenModalSubjectCate] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    CurrentPage: 1,
    PageSize: 10,
  })

  const getListSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await SubjectCateService.getListSubjectCate(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (pagination.PageSize) getListSubjectCate()
  }, [pagination])

  const handleDeleteSubjectCate = async (id) => {
    try {
      setLoading(true)
      const res = await SubjectCateService.deleteSubjectCate(id)
      if (res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
    } finally {
      setLoading(false)
    }
  }

  const listBtn = record => [
    {
      title: "Danh sách môn học",
      icon: ListIcons?.ICON_LIST,
      onClick: () => setOpenModalSubject({ SubjectCateID: record?._id, SubjectCateName: record?.SubjectCateName })
    },
    {
      title: "Chỉnh sửa",
      icon: ListIcons?.ICON_EDIT,
      onClick: () => setOpenModalSubjectCate(record)
    },
    {
      title: "Xóa",
      icon: ListIcons?.ICON_DELETE,
      onClick: () => {
        CB1({
          title: `Bạn có chắc chắn muốn xoá danh mục "${record?.SubjectCateName}" không?`,
          // icon: "trashRed",
          okText: "Đồng ý",
          cancelText: "Đóng",
          onOk: async close => {
            handleDeleteSubjectCate(record?._id)
            getListSubjectCate()
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
      title: "Tên danh mục",
      width: 100,
      dataIndex: "SubjectCateName",
      key: "SubjectCateName",
    },
    {
      title: "Mô tả",
      width: 400,
      dataIndex: "Description",
      key: "Description",
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
      <Row>
        <Col span={24} className="d-flex-sb">
          <div className="title-type-1">
            QUẢN LÝ DANH MỤC MÔN HỌC
          </div>
          <ButtonCustom
            className="third-type-2"
            onClick={() => setOpenModalSubjectCate(true)}
          >
            Thêm mới
          </ButtonCustom>
        </Col>
        <Col span={24} className="mt-30">
          <TableCustom
            isPrimary
            bordered
            noMrb
            showPagination
            loading={loading}
            dataSource={listData}
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

        {!!openModalSubjectCate && (
          <InsertUpdateSubjectCate
            open={openModalSubjectCate}
            onCancel={() => setOpenModalSubjectCate(false)}
            onOk={() => getListSubjectCate()}
          />
        )}

        {!!openModalSubject && (
          <ModalSubject
            open={openModalSubject}
            onCancel={() => setOpenModalSubject(false)}
          />
        )}

      </Row>
    </SpinCustom>
  )
}

export default SubjectCateManagement