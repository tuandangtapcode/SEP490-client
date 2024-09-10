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