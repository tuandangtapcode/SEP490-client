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


const Feedback = ({ feedbacks, teacher }) => {

  const [openModalSendFeedback, setOpenModalSendFeedback] = useState(false)
  const { user } = useSelector(globalSelector)

  return (
    <Row>
      <Col span={24}>
        <p className="fs-18 fw-700">Đánh giá của học viên</p>
      </Col>
      {
        !!feedbacks?.length ?
          <div>

          </div>
          : <Empty description="Chưa có đánh giá nào" />
      }
    </Row>
  )
}

export default Feedback