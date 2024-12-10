import { Col, Row, Space } from "antd"
import { useEffect, useState } from "react"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import TableCustom from "src/components/TableCustom"
import SubjectCateService from "src/services/SubjectCateService"
import InsertUpdateSubjectCate from "./components/modal/InsertUpdateSubjectCate"
import ListIcons from "src/components/ListIcons"
import ModalSubject from "./components/Subject"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"

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
      const res = await SubjectCateService.getListSubjectCateByAdmin(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
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
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getListSubjectCate()
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
      title: !!record?.IsDeleted ? "Hiển thị môn học" : "Ẩn môn học",
      icon: !!record?.IsDeleted ? ListIcons.ICON_UNBLOCK : ListIcons.ICON_BLOCK,
      onClick: () => {
        ConfirmModal({
          description: `Bạn có chắc chắn muốn ${!!record?.IsDeleted ? "hiển thị danh mục" : "ẩn danh mục"} môn học "${record?.SubjectCateName}" không?`,
          onOk: async close => {
            handleDeleteSubjectCate({ SubjectCateID: record?._id, IsDeleted: !record?.IsDeleted })
            getListSubjectCate()
            close()
          }
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
      align: "center",
    },
    {
      title: "Mô tả",
      width: 400,
      dataIndex: "Description",
      key: "Description",
      align: "center",
    },
    {
      title: "Chức năng",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space>
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

        {
          !!openModalSubjectCate && (
            <InsertUpdateSubjectCate
              open={openModalSubjectCate}
              onCancel={() => setOpenModalSubjectCate(false)}
              onOk={() => getListSubjectCate()}
            />
          )
        }

        {
          !!openModalSubject && (
            <ModalSubject
              open={openModalSubject}
              onCancel={() => setOpenModalSubject(false)}
            />
          )
        }

      </Row>
    </SpinCustom>
  )
}

export default SubjectCateManagement