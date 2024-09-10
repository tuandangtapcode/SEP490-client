import styled, { keyframes } from "styled-components"
import { Modal } from "antd"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`

const flyToTrash = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(50px, -50px) scale(0.5);
    opacity: 0;
  }
`

export const ModalStyled = styled(Modal)`
  &.cb1 {
    .ant-modal-content {
      border-radius: 8px;
      padding: 20px;
      background: #fff;
      animation: ${fadeIn} 0.3s ease-out;
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
    
  }
`

export const ModalWrapper = styled.div`
  text-align: center;

  .trashCanWrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }

  .textTitle {
    font-size: 18px;
    font-weight: 600;
    margin-top: 20px;
    animation: ${fadeIn} 0.3s ease-out;
  }
`

export const FileIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 24px;
  color: #2196f3;
  animation: ${flyToTrash} 2s infinite ease-in-out;
`

export const TrashCanIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 40px;
  color: #ff4d4f;
  animation: ${bounce} 1.5s infinite;
`
