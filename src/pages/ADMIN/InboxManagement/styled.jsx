import styled from "styled-components"

export const MessageItemStyled = styled.div`
  border: 1px solid var(--color-border-matte);
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
`

export const ChatBoxWrapper = styled.div`
  border-top-right-radius: 8px;
  background-color: white;
  border-top-left-radius: 8px;
  min-width: 450px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 8px 12px;
  .header {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-border-matte);
  }
  .messages {
    height: 500px;
  }
`