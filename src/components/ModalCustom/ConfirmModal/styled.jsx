import { Modal } from "antd"
import styled from "styled-components"

export const ModalStyled = styled(Modal)`
    .ant-modal-content {
      border-radius: 8px;
      padding: 20px;
      background: #fff;
    }
    .ant-modal-header {
      border-bottom: none;
      padding-bottom: 0;
      background: linear-gradient(to right, #553c9a, #ee4b2b);
      color: #fff;
    }
    .ant-modal-title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
    }
`