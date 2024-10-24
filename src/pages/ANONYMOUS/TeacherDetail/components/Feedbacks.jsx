import { Col, Empty, Rate, Row } from "antd"
import moment from "moment"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { globalSelector } from "src/redux/selector"
import styled from "styled-components"
import ModalSendFeedback from "../modal/ModalSendFeedback"

const FeedbackItemStyled = styled.div`
  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
`


const Feedbacks = ({ feedbacks, teacher }) => {

  const [openModalSendFeedback, setOpenModalSendFeedback] = useState(false)
  const { user } = useSelector(globalSelector)

  return (
    <>
      <div className="mb-30 d-flex-sb">
        <div className="fs-20 fw-600">Đánh giá</div>
        <div
          className="primary-text cursor-pointer"
          onClick={() => {
            if (!!user?._id) {
              setOpenModalSendFeedback(teacher)
            } else {
              return toast.warning("Hãy đăng nhập để đánh giá giáo viên")
            }
          }}
        >
          Viết đánh giá
        </div>
      </div>
      <div>
        {
          !!feedbacks?.length ?
            feedbacks?.map((i, idx) =>
              <FeedbackItemStyled key={idx}>
                <Row>
                  <Col span={4}>
                    {i?.User?.FullName}
                  </Col>
                  <Col span={20}>
                    <Rate
                      className="mb-12"
                      value={i?.Rate}
                      disabled
                    />
                    <div className="mb-12">{i?.Content}</div>
                    <div>{moment(i.createdAt).calendar()}</div>
                  </Col>
                </Row>
              </FeedbackItemStyled>
            )
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Giáo viên chưa có đánh giá nào" />
        }
      </div>
    </>
  )
}

export default Feedbacks