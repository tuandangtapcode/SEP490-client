import styled from "styled-components"

export const InputWrapper = styled.div`
  .ant-input {
  background-color: white !important;
  color: black !important;
  // padding: 8px 12px;
}


.ant-input-outlined:hover,
.ant-input-outlined:active,
.ant-input-outlined:focus {
  border: 1px solid var(--color-primary-hover) !important;
  background-color: white !important;
}

.ant-input-outlined:focus-within {
  box-shadow: none !important;
  border: 1px solid var(--color-primary-hover) !important;
  background-color: white !important;
}

.ant-input::placeholder {
  color: #6a6a6a;
  font-style: italic;
}

.ant-input-affix-wrapper {
  padding: 7px 12px !important;
}

.anticon.ant-input-password-icon {
  font-size: 20px;
  border-color: transparent !important;

  &:hover {
    color: rgba(0, 0, 0, 0.45) !important;
  }
}

.ant-input-search>.ant-input-group>.ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary):hover {
  color: var(--color-primary-hover);
}

.ant-input-search .ant-input-search-button {
  height: 31px !important;
}

.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
  border-color: var(--color-primary-hover) !important;
  background: white !important;
}
`