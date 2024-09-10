import { Button } from "antd"
import "../style.scss"

const ButtonCustom = (props) => {

  return (
    <Button
      {...props}
    >
      {props?.children}
    </Button>
  )
}

export default ButtonCustom