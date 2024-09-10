import { Checkbox, Collapse, Form, Select } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import ModalSubject from "../modal/ModalSubject"
import UserService from "src/services/UserService"
import globalSlice from "src/redux/globalSlice"
import { toast } from "react-toastify"
import ConfirmModal from "src/components/ModalCustom/ConfirmModal"

const { Option } = Select

const Quotes = ({ changeProfile }) => {

  const { user, listSystemKey } = useSelector(globalSelector)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [openModalSubject, setOpenModalSubject] = useState(false)

  useEffect(() => {
    const Quotes = user?.Quotes
    form.setFieldsValue({
      quotes: !!Quotes?.length
        ? Quotes?.length === user?.Subjects?.length
          ? Quotes
          : [...Quotes, { SubjectID: user?.Subjects?.find(i => !Quotes?.map(item => item?.SubjectID)?.includes(i?._id))?._id }]
        : user?.Subjects?.map(i => ({
          SubjectID: i?._id
        })),
    })
  }, [user])

  const handlePullSubject = async (SubjectID) => {
    try {
      setLoading(true)
      const res = await UserService.pushOrPullSubjectForTeacher(SubjectID)
      if (res?.isError) return
      dispatch(globalSlice.actions.setUser(res?.data))
      toast.success(res?.msg)
    } finally {
      setLoading(false)
    }
  }

  const genExtra = (subject) => (
    <ButtonCustom
      loading={loading}
      onClick={(event) => {
        event.stopPropagation()
        ConfirmModal({
          description: `Bạn có chắc chắn muốn xóa môn ${subject?.SubjectName} khỏi profile không?`,
          onOk: async close => {
            handlePullSubject(subject?._id)
            close()
          }
        })
      }}
    >
      Ẩn môn học
    </ButtonCustom>
  )


  const items = (fields) => {
    return fields.map(({ key, name, ...restField }, idx) => (
      {
        key: idx,
        label: (
          <div>
            Mô tả bài học của bạn: <span className="fw-600">{user?.Subjects[idx]?.SubjectName}</span>
          </div>
        ),
        extra: genExtra(user?.Subjects[idx]),
        children: (
          <div>
            {
              <div key={key}>
                <div className="fw-600 mb-8">Đặt tiêu đề chủ đề</div>
                <div className="mb-8">Tiêu đề theo chủ đề cụ thể giúp bạn thu hút sự chú ý của học sinh trong từng kỹ năng riêng biệt mà bạn dạy. Đảm bảo bao gồm những gì học sinh có thể mong đợi học, cũng như những gì khiến bạn trở nên khác biệt, từ kinh nghiệm đến cấp độ, chứng chỉ, chức danh công việc hoặc nền tảng chuyên môn.</div>
                <Form.Item
                  style={{ width: "100%", marginRight: "8px" }}
                  {...restField}
                  name={[name, "Title"]}
                  rules={[
                    { required: true, message: "Thông tin không được để trống" },
                  ]}
                >
                  <InputCustom
                    placeholder="Tiêu đề"
                    disabled={user?.RegisterStatus !== 3 && !!user?.Quotes?.length ? true : false}
                  />
                </Form.Item>
                <div className="fw-600 mb-8">Điều gì khiến buổi học {user?.Subjects[idx]?.SubjectName} với bạn trở nên độc đáo?</div>
                <div className="mb-8">Đây là điều đầu tiên một học sinh tiềm năng đọc khi họ xem hồ sơ của bạn.</div>
                <Form.Item
                  {...restField}
                  style={{ width: "100%", marginRight: "8px" }}
                  name={[name, "Content"]}
                  rules={[
                    { required: true, message: "Thông tin không được để trống" },
                  ]}
                >
                  <InputCustom
                    disabled={user?.RegisterStatus !== 3 && !!user?.Quotes?.length ? true : false}
                    type="isTextArea"
                    placeholder="Mô tả"
                    style={{ height: "100px" }}
                  />
                </Form.Item>
                <div className="fw-600 mb-8">Bạn dạy ở cấp độ kinh nghiệm nào?</div>
                <Form.Item
                  name={[name, "Levels"]}
                  rules={[
                    { required: true, message: "Thông tin không được để trống" },
                  ]}
                >
                  <Checkbox.Group
                    disabled={user?.RegisterStatus !== 3 && !!user?.Quotes?.length ? true : false}
                  >
                    {
                      getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map(i =>
                        <Checkbox
                          key={i?.ParentID}
                          value={i?.ParentID}
                        >
                          {i?.ParentName}
                        </Checkbox>
                      )
                    }
                  </Checkbox.Group>
                </Form.Item>
              </div>
            }
            <ButtonCustom
              className="medium-size primary fw-700"
              loading={loading}
              onClick={() => {
                if (user?.RegisterStatus === 3 || !user?.Quotes?.length) {
                  changeProfile(form, setLoading)
                }
              }}
            >
              {
                user?.RegisterStatus !== 3
                  ? !!user?.Quotes?.find(item => item?.SubjectID === user?.Subjects[idx]?._id)
                    ? "Hoàn thành"
                    : "Lưu"
                  : "Cập nhật"
              }
            </ButtonCustom>
          </div>
        )
      }
    ))
  }

  return (
    <Form form={form} className="p-12" >
      {
        user?.RegisterStatus === 3 &&
        <ButtonCustom
          className="mb-12"
          onClick={() => setOpenModalSubject(true)}
        >
          Thêm môn học
        </ButtonCustom>
      }
      <Form.List name="quotes">
        {(fields, { add, remove }) => (
          <Collapse
            items={items(fields)}
          />
        )}
      </Form.List>

      {
        !!openModalSubject &&
        <ModalSubject
          open={openModalSubject}
          onCancel={() => setOpenModalSubject(false)}
        />
      }

    </Form >
  )
}

export default Quotes