import styled from "styled-components"

export const TimeItemStyled = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  &.active {
    background-color: var(--color-primary-hover);
    color: white
  }
`

export const PaymentMethodStyled = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  width: 100%;
  cursor: pointer;
  &.active {
    border-color: var(--color-primary-hover);
  }
`