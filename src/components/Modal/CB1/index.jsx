import { ModalStyled, ModalWrapper, FileIcon, TrashCanIcon } from "./styled"
import ListIcons from "src/components/ListIcons"
import "./style.scss"

export default function CB1({
  width = 600,
  title,
  okText = "Đồng ý",
  cancelText = "Đóng",
  onOk = (e) => e(),
  ...props
}) {
  ModalStyled.confirm({
    icon: null,
    okText,
    cancelText,
    width,
    onOk,
    maskClosable: true,
    okButtonProps: {
      style: {
        fontWeight: 700,
        padding: "8px 16px",
        borderRadius: 4,
        height: 40,
        background: `#01638D`,
        color: "#fff",
        transition: "background 0.3s ease, transform 0.3s ease",
      },
      className: "ok-button",
    },
    cancelButtonProps: {
      style: {
        fontWeight: 700,
        borderRadius: 4,
        padding: "8px 16px",
        height: 40,
        color: `#000`,
        border: "1px solid #F1F3F5",
        background: `#F1F3F5`,
        transition: "background 0.3s ease, transform 0.3s ease",
      },
      className: "cancel-button",
    },
    wrapClassName: "cb1",
    ...props,
    content: (
      <ModalWrapper className="d-flex justify-content-center align-items-center flex-column">
        <div className="trashCanWrapper">
          <FileIcon className="fileIcon">{ListIcons?.ICON_FILE_DELETE}</FileIcon>
          <TrashCanIcon className="trashIcon">{ListIcons?.ICON_TRASH}</TrashCanIcon>
        </div>
        {!!title && (
          <div className="textTitle" dangerouslySetInnerHTML={{ __html: title }} />
        )}
      </ModalWrapper>
    ),
  })
}
