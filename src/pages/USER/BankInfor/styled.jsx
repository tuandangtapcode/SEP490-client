import { Form } from "antd"
import styled from "styled-components"


export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 87vh;
  background-color: #f5f5f5;
`;

export const FormWrapper = styled.div`
  background: white;
  width: 600px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  .ant-form-item-required{
    font-weight: bold;
  }
`;
