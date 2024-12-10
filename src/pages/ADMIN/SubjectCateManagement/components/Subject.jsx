import { Col, Row, Space } from "antd"
import { useEffect, useState } from "react"
import ListIcons from "src/components/ListIcons"
import CB1 from "src/components/Modal/CB1"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import SpinCustom from "src/components/SpinCustom"
import TableCustom from "src/components/TableCustom"
import SubjectService from "src/services/SubjectService"
import InsertUpdateSubject from "./modal/InsertUpdateSubject"
import { toast } from "react-toastify"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ModalCustom from "src/components/ModalCustom"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"


const ModalSubject = ({ open, onCancel }) => {

  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [openModalAddAndEditSubject, setOpenModalAddAndEditSubject] = useState(false)
  const [pagination, setPagination] = useState({
    TextSearch: "",
    SubjectCateID: open?.SubjectCateID,
    CurrentPage: 1,
    PageSize: 10,
  })

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubjectByAdmin(pagination)
      if (!!res?.isError) return toast.error(res?.msg)
      setListData(res?.data?.List)
      setTotal(res?.data?.Total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pagination.PageSize) getListSubject()
  }, [pagination])

  const onDelete = async (body) => {
    try {
      setLoading(true)
      const res = await SubjectService.deleteSubject(body)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      getListSubject()
    } finally {
      setLoading(false)
    }
  }

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
      title: "Tên môn học",
      width: 100,
      dataIndex: "SubjectName",
      key: "SubjectName",
      align: "center",
    },
    {
      title: "Ảnh minh hoạ",
      width: 400,
      align: "center",
      render: (_, record, index) => (
        <img src={record?.AvatarPath} style={{ width: '100px', height: '100px' }} />
      ),
    },
    {
      title: "Chức năng",
      width: 70,
      key: "Function",
      align: "center",
      render: (_, record) => (
        <Space direction="horizontal">
          <ButtonCircle
            title="Chỉnh sửa"
            icon={ListIcons?.ICON_EDIT}
            onClick={() => setOpenModalAddAndEditSubject({ ...record, open })}
          />
          <ButtonCircle
            title={!!record?.IsDeleted ? "Hiển thị môn học" : "Ẩn môn học"}
            icon={!!record?.IsDeleted ? ListIcons.ICON_UNBLOCK : ListIcons.ICON_BLOCK}
            onClick={() => {
              ConfirmModal({
                description: `Bạn có chắc chắn muốn ${!!record?.IsDeleted ? "hiển thị môn học" : "ẩn môn học"} "${record?.SubjectName}" không?`,
                onOk: async close => {
                  onDelete({ SubjectID: record?._id, IsDeleted: !record?.IsDeleted })
                  close()
                }
              })
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <ModalCustom
      title="Danh sách môn học"
      width={1300}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <SpinCustom spinning={loading}>
        <Row>
          <Col span={24} className="d-flex-sb">
            <div className="title-type-1">
              QUẢN LÝ MÔN HỌC THUỘC DANH MỤC {open?.SubjectCateName.toUpperCase()}
            </div>
            <ButtonCustom
              className="third-type-2"
              onClick={() => setOpenModalAddAndEditSubject(open)}
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
            !!openModalAddAndEditSubject && (
              <InsertUpdateSubject
                open={openModalAddAndEditSubject}
                onCancel={() => setOpenModalAddAndEditSubject(false)}
                onOk={() => getListSubject()}
              />
            )
          }

        </Row>
      </SpinCustom>
    </ModalCustom>
  )
}

export default ModalSubject
