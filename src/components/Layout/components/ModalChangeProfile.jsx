import { Form, Space } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ModalCustom from "src/components/ModalCustom"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import UpdateProfile from "src/pages/USER/UserProfile/components/UpdateProfile"
import globalSlice from "src/redux/globalSlice"
import Router from "src/routers"
import FileService from "src/services/FileService"
import UserService from "src/services/UserService"

const ModalChangeProfile = ({ open, onCancel, isFromProfilePage }) => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const changeProfile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const { image, ...remainValues } = values
      let resFile
      if (!!image?.file) {
        resFile = await FileService.uploadFileSingle({
          FileSingle: image?.file
        })
        if (resFile?.isError) return
      }
      const res = await UserService.changeProfile({
        ...remainValues,
        Avatar: !!resFile ? resFile?.data : open?.AvatarPath
      })
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      onCancel()
      dispatch(globalSlice.actions.setUser(res?.data))
      navigate(Router.PROFILE)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalCustom
      open={open}
      onCancel={!!isFromProfilePage ? onCancel : null}
      closable={!!isFromProfilePage ? true : false}
      title="Hoàn thiện thông tin cá nhân"
      width="50vw"
      footer={
        <Space className="d-flex-end">
          {
            !!isFromProfilePage &&
            <ButtonCustom
              className="third"
              onClick={() => onCancel()}
            >
              Đóng
            </ButtonCustom>
          }
          <ButtonCustom
            loading={loading}
            className="primary"
            onClick={() => changeProfile()}
          >
            Cập nhật
          </ButtonCustom>
        </Space>
      }
    >
      <p className="center-text fs-20 fw-600 mb-16">Hãy hoàn thiện thông tin cá nhân để sử dụng hệ thống</p>
      <UpdateProfile form={form} />
    </ModalCustom >
  )
}

export default ModalChangeProfile