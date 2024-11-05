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
  &.disabled {
    border: 1px solid var(--color-border-matte);
    color: var(--color-border-matte);
    cursor: not-allowed;
  }
`

export const PaymentMethodStyled = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  cursor: pointer;
  &.active {
    border-color: var(--color-primary-hover);
  }
`