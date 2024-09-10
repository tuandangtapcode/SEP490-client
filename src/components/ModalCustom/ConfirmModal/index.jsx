import ListIcons from "src/components/ListIcons"
import { ModalStyled } from "./styled"

const ConfirmModal = ({
  width = 600,
  title,
  icon = "ICON_WARNING_MODAL",
  description,
  okText = "Đồng ý",
  cancelText = "Hủy",
  onOk = e => e(),
  ...props
}) => {
  ModalStyled.confirm({
    icon: null,
    title: (
      <div className="fs-25 fw-700">{title}</div>
    ),
    okText,
    cancelText,
    width,
    onOk,
    // maskClosable: true,
    okButtonProps: {
      style: {
        padding: "16px, 16px, 16px, 16px",
        borderRadius: 8,
        height: 32,
        background: `#0078d4`,
      },
    },
    cancelButtonProps: {
      style: {
        borderRadius: 4,
        padding: "16px, 16px, 16px, 16px",
        height: 32,
        color: `#000`,
        border: "1px solid #F1F3F5",
        background: `#F1F3F5`,
      },
    },
    wrapClassName: "cb1",
    ...props,
    content: (
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="d-flex-center">
          <span
            style={{ fontSize: '100px' }}
          >
            {ListIcons[icon]}
          </span>
        </div>
        {
          !!description &&
          <div className="fw-600 fs-16">
            {description}
          </div>
        }
      </div>
    ),
  })
}

export default ConfirmModal