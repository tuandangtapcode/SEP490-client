import { Col, Image, Row, Space } from "antd"
import { useSelector } from "react-redux"
import ModalCustom from "src/components/ModalCustom"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { formatMoney } from "src/lib/stringUtils"
import { globalSelector } from "src/redux/selector"
import dayjs from "dayjs"
import VideoItem from "src/pages/ANONYMOUS/TeacherDetail/components/VideoItem"
import { useState } from "react"
import PreviewVideo from "src/pages/USER/SubjectSetting/modal/PreviewVideo"
import ButtonCustom from "src/components/MyButton/ButtonCustom"
import ModalReasonReject from "./ModalReasonReject"

const ModalViewSubjectSetting = ({
  open,
  onCancel,
  handleConfirmSubjectSetting,
  onOk
}) => {

  const { listSystemKey } = useSelector(globalSelector)
  const [openPreviewVideo, setOpenPreviewVideo] = useState()
  const [loading, setLoading] = useState(false)
  const [openModalReasonReject, setOpenModalReasonReject] = useState(false)

  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Chi tiết môn học"
      width="70vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="third"
            onClick={() => onCancel()}
          >
            Đóng
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            disabled={open?.IsConfirm}
            loading={loading}
            onClick={() => handleConfirmSubjectSetting({ ...open, isModalDetail: true }, setLoading, onCancel)}
          >
            Duyệt
          </ButtonCustom>
          <ButtonCustom
            className="primary"
            disabled={open?.IsReject}
            onClick={() => setOpenModalReasonReject({ ...open, isModalDetail: true })}
          >
            Không duyệt
          </ButtonCustom>
        </Space>
      }
    >
      <div className="p-12">
        <Row>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-12">Thông tin cơ bản môn học</div>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Tiêu đề môn học:</span>
            <span>
              {
                !!open?.Quote?.Title
                  ? open?.Quote?.Title
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Giới thiệu môn học:</span>
            <span>
              {
                !!open?.Quote?.Content
                  ? open?.Quote?.Content
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Hình thức giảng dạy:</span>
            {
              !!open?.LearnTypes?.length
                ? getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)?.map((i, idx) => {
                  if (open?.LearnTypes?.includes(i?.ParentID))
                    return <span key={idx} className='mr-8'>{i?.ParentName}</span>
                })
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <span className="fw-500 mr-4">Giá tiền cho mỗi buổi học:</span>
            <span>
              {
                !!open?.Price
                  ? `${formatMoney(open?.Price)} VNĐ`
                  : "Chưa bổ sung"
              }
            </span>
          </Col>
          <Col span={24} className="mb-16">
            <span className="fw-500 mr-4">Cấp độ giảng dạy:</span>
            {
              !!open?.Levels?.length
                ? getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)?.map((i, idx) => {
                  if (open?.Levels?.includes(i?.ParentID))
                    return <span key={idx} className='mr-8'>{i?.ParentName}</span>
                })
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-12">Kinh nghiệm giảng dạy</div>
          </Col>
          <Col span={24} className="mb-16">
            {
              !!open?.Experiences?.length
                ? open?.Experiences?.map((i, idx) =>
                  <div key={idx}>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Mô tả:</div>
                      <div>{i?.Content}</div>
                    </div>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Thời gian bắt đầu - Thời gian kết thúc:</div>
                      <div>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</div>
                    </div>
                  </div>
                )
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-12">Trình độ học vấn</div>
          </Col>
          <Col span={24} className="mb-16">
            {
              !!open?.Educations?.length
                ? open?.Educations?.map((i, idx) =>
                  <div key={idx}>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Mô tả học vấn của bạn:</div>
                      <div>{i?.Content}</div>
                    </div>
                    <div className="d-flex">
                      <div className="fw-500 mr-4">Thời gian bắt đầu - Thời gian kết thúc:</div>
                      <div>{dayjs(i?.StartDate).format("DD/MM/YYYY")} - {dayjs(i?.EndDate).format("DD/MM/YYYY")}</div>
                    </div>
                  </div>
                )
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-12">Tài liệu bằng cấp:</div>
          </Col>
          <Col span={24} className="mb-16">
            {
              !!open?.Certificates?.length
                ? open?.Certificates?.map((i, idx) =>
                  <Image style={{ width: "150px", height: "150px", marginRight: "12px" }} key={idx} src={i} />
                )
                : "Chưa bổ sung"
            }
          </Col>
          <Col span={24}>
            <div className="fs-18 fw-600 mb-12">Video giới thiệu:</div>
          </Col>
          <Col span={24}>
            <Row>
              {
                !!open?.IntroVideos?.length ?
                  open?.IntroVideos?.map((i, idx) =>
                    <Col
                      key={idx} span={8}
                      onClick={() => setOpenPreviewVideo(i)}
                    >
                      <VideoItem
                        videoUrl={i}
                      />
                    </Col>
                  )
                  : "Chưa bổ sung"
              }
            </Row>
          </Col>
        </Row>

        {
          !!openPreviewVideo &&
          <PreviewVideo
            open={openPreviewVideo}
            onCancel={() => setOpenPreviewVideo(false)}
          />
        }

        {
          !!openModalReasonReject &&
          <ModalReasonReject
            open={openModalReasonReject}
            onCancel={() => setOpenModalReasonReject(false)}
            cancelModalDetail={onCancel}
            onOk={onOk}
          />
        }

      </div>
    </ModalCustom>
  )
}

export default ModalViewSubjectSetting