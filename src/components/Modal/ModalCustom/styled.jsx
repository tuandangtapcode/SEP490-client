import { Modal } from 'antd'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideInFromBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

export const CustomStyledModal = styled(Modal)`
  .ant-modal-content {
    animation: ${fadeIn} 0.5s ease-out, ${slideInFromBottom} 0.5s ease-out;
    border-radius: 10px;
    overflow: hidden;
    padding: 0px
  }

 .ant-modal-header {
    background: var(--color-primary-hover);
    color: #fff;
    border-bottom: none;
    padding: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    position: relative;
    animation: ${pulse} 1.5s infinite ease-in-out;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      pointer-events: none;
      mix-blend-mode: overlay;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      animation: ${fadeIn} 2s infinite ease-in-out alternate;
    }
  }

  .ant-modal-title {
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
  }

  .ant-modal-close-x {
    color: #fff;    
  }

  .ant-modal-body {
    padding: 24px;
    background-color: #f9f9f9;
  }

    .ant-modal-footer {
    padding: 10px;
  }

`