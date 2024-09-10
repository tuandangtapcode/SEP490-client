import { Spin } from "antd"
import ListIcons from "../ListIcons"

const SpinCustom = (props) => {

  return (
    <Spin
      {...props}
      indicator={ListIcons.ICON_LOADING}
    />
  )
}

export default SpinCustom