import { Col, Empty, Rate, Row } from "antd"
import moment from "moment"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { globalSelector } from "src/redux/selector"
import styled from "styled-components"
import ModalSendFeedback from "../../../USER/StudiedSubject/components/ModalSendFeedback"

const FeedbackItemStyled = styled.div`
  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
`


const Feedback = ({ feedbacks }) => {

  return (
    <Row>
      <Col span={24}>
        <p className="fs-18 fw-700 mb-12">Đánh giá của học viên</p>
      </Col>
      <Col span={24}>
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
            : <Empty description="Chưa có đánh giá nào" />
        }
      </Col>
    </Row>
  )
}

export default Feedback