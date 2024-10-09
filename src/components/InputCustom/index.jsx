import { Input, InputNumber } from 'antd'
import { InputWrapper } from './styled'

const typeInput = (props) => {
  switch (props?.type) {
    case 'isPassword':
      return <Input.Password {...props} />
    case 'isTextArea':
      return <Input.TextArea {...props} />
    case 'isSearch':
      return <Input.Search {...props} />
    case 'isNumber':
      return <InputNumber {...props} />
    default:
      return <Input {...props} />
  }
}

const InputCustom = (props) => {

  return (
    <InputWrapper>
      {
        typeInput(props)
      }
    </InputWrapper>
  )
}

export default InputCustom