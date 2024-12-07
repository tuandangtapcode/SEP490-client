import ListIcons from "src/components/ListIcons"
import { ModalStyled } from "./styled"
import { Button } from "antd"

const ConfirmModal = ({
  width = 600,
  title,
  icon = "ICON_WARNING_MODAL",
  description,
  okText = "Đồng ý",
  cancelText = "Hủy",
  onOk = e => e(),
  isViewOkBtn = true,
  isViewCancelBtn = true,
  ...props
}) => {
  ModalStyled.confirm({
    icon: null,
    centered: true,
    title: (
      <div className="fs-25 fw-700">{title}</div>
    ),
    okText,
    cancelText,
    width,
    onOk,
    okButtonProps: {
      style: {
        padding: "12px, 12px, 12px, 12px",
        borderRadius: 8,
        height: 32,
        background: `var(--color-primary)`,
      },
    },
    cancelButtonProps: {
      style: {
        borderRadius: 4,
        padding: "12px, 12px, 12px, 12px",
        height: 32,
        color: `#000`,
        border: "1px solid #F1F3F5",
        background: `#F1F3F5`,
      },
    },
    footer: (_, { OkBtn, CancelBtn }) => (
      <>
        {
          !!isViewCancelBtn && <CancelBtn />
        }
        {
          !!isViewOkBtn && <OkBtn />
        }
      </>
    ),
    wrapClassName: "cb1",
    ...props,
    content: (
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="d-flex-center">
          <span
            style={{ fontSize: '80px' }}
          >
            {ListIcons[icon]}
          </span>
        </div>
        {
          !!description &&
          <div className="fw-600 fs-16">
            <div className="textTitle" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        }
      </div>
    ),
  })
}

export default ConfirmModal