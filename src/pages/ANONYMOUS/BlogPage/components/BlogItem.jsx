import { Col, Row } from "antd"
import { StyledListItem } from "../styled"
import { formatMoney } from "src/lib/stringUtils"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ListIcons from "src/components/ListIcons"
import dayjs from "dayjs"
import { getListComboKey } from "src/lib/commonFunction"
import { Roles, SYSTEM_KEY } from "src/lib/constant"
import { useDispatch, useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import { defaultDays } from "src/lib/dateUtils"
import { useNavigate } from "react-router-dom"
import globalSlice from "src/redux/globalSlice"
import SpinCustom from "src/components/SpinCustom"
import { useState } from "react"
import BlogService from "src/services/BlogService"
import { toast } from "react-toastify"
import NotificationService from "src/services/NotificationService"
import Router from "src/routers"

const BlogItem = ({ blog }) => {

  const { listSystemKey, user } = useSelector(globalSelector)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const sendRequestReceive = async () => {
    try {
      setLoading(true)
      const bodyNotification = {
        Content: `${user?.FullName} đăng ký lớp học của bạn`,
        Type: "bai-dang-da-dang-ky",
        Receiver: blog?.User?._id
      }
      const resNotification = NotificationService.createNotification(bodyNotification)
      if (!!resNotification?.isError) return toast.error(resNotification?.msg)
      const res = await BlogService.sendRequestReceive(blog?._id)
      if (!!res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      navigate(Router.BAI_DANG_DA_DANG_KY)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SpinCustom spinning={loading}>
      <StyledListItem>
        <Row gutter={[4, 8]} className="d-flex-sb">
          <Col span={24}>
            <div className="d-flex">
              <span className="mr-3">Môn học:</span>
              <span className="mr-3">{blog?.Subject?.SubjectName}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className="d-flex">
              <span className="mr-3">Tiêu đề:</span>
              <span className="mr-3">{blog?.Title}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className="d-flex">
              <span className="mr-3">Giá tiền/buổi:</span>
              <span className="mr-3">{formatMoney(blog?.Price)}</span>
            </div>
          </Col>
          {
            !!blog?.IsRegister &&
            <Col span={12} className="d-flex-end">
              <ButtonCustom
                className="third-type-2"
                onClick={() => sendRequestReceive()}
              >
                Đăng ký
              </ButtonCustom>
            </Col>
          }
          <Col span={24}>
            <div className="d-flex mr-4">
              <span className="mr-3">{ListIcons.ICON_CLOCK}</span>
              <span className="mr-3">Ngày tạo:</span>
              <span className="mr-3">{dayjs(blog?.createdAt).format("DD/MM/YYYY")}</span>
            </div>
            <div className="d-flex mr-4">
              <span className="mr-3">{ListIcons.ICON_GENDER}</span>
              <span className="mr-3">Yêu cầu:</span>
              <span className="mr-3">
                ({
                  getListComboKey(SYSTEM_KEY.GENDER, listSystemKey)
                    ?.map((item, idx) => {
                      if (blog?.Gender?.includes(item?.ParentID))
                        return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                    })
                })
              </span>
              <span className="mr-3">
                {
                  getListComboKey(SYSTEM_KEY.PROFESSIONAL_LEVEL, listSystemKey)
                    ?.find(i => i?.ParentID === blog?.ProfessionalLevel)?.ParentName
                }
              </span>
            </div>
          </Col>
          <Col span={24}>
            <div className="d-flex mr-4">
              <span className="mr-3">{ListIcons.ICON_LEARN_TYPE}</span>
              <span className="mr-3">Hình thức học:</span>
              <span className="mr-3">
                {
                  getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
                    ?.map((item, idx) => {
                      if (blog?.LearnType?.includes(item?.ParentID))
                        return <span key={idx} className="mr-4 m-2">{item?.ParentName}</span>
                    })
                }
              </span>
            </div>
            {
              !!blog?.Address &&
              <div className="d-flex mr-4">
                <span className="mr-3">{ListIcons.ICON_LOCATION}</span>
                <span className="mr-3">Địa chỉ:</span>
                <span className="mr-3">{blog?.Address}</span>
              </div>
            }
          </Col>
          <Col span={24}>
            <div className="d-flex mr-4">
              <span className="mr-3">{ListIcons.ICON_SCHEDULE}</span>
              <span className="mr-3">Lịch học:</span>
              {
                blog?.Schedules?.map((i, idx) =>
                  <div key={idx} className="mr-5">
                    <span className="mr-3">
                      {
                        defaultDays?.find(d => d?.value === i?.DateValue)?.VieNameSpecific
                      }:
                    </span>
                    <span>
                      {dayjs(i?.StartTime).format("HH:mm")}-
                    </span>
                    <span>
                      {dayjs(i?.EndTime).format("HH:mm")}
                    </span>
                  </div>
                )
              }
            </div>
          </Col>
        </Row>
      </StyledListItem>
    </SpinCustom>
  )
}

export default BlogItem