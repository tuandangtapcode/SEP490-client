import { Modal } from "antd"
import styled from "styled-components"

export const ModalCustomStyled = styled(Modal)`

.ant-modal-content {
    border-radius: 10px;
    overflow: hidden;
    padding: 0px
  }

.ant-modal-header {
  background-color: var(--color-primary);
  padding: 12px;
  text-align: center;
}

.ant-modal-title {
 color: white;
 font-size: 20px;
 font-weight: 700;
}

.ant-modal-body {
  padding: 24px 24px 0px 24px;
}

.ant-modal-footer {
  text-align: unset;
  background: transparent !important;
  padding: 24px;
}
.ant-modal-close {
  color: white !important;
  &:hover {
    background-color: none !important; 
  }
}
`