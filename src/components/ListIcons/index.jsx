import {
  BsCheck,
  BsFacebook,
  BsFileMusicFill,
  BsFillTrash3Fill,
  BsInstagram,
  BsTrash2,
  BsTwitterX,
  BsChatDots,
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsSend,
  BsTelephone,
  BsFillPlayFill,
  BsCake2,
  BsBarChartFill
} from "react-icons/bs"

import {
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import {
  AiFillBell,
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillEdit,
  AiFillEye,
  AiOutlineArrowRight,
  AiOutlineBarChart,
  AiOutlineCamera,
  AiOutlineCheckCircle,
  AiOutlineUnorderedList,
  AiOutlineWarning,
  AiFillMessage,
  AiFillStar,
  AiFillPayCircle,
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineQuestionCircle,
  AiFillPlusCircle
} from "react-icons/ai"

import {
  BiErrorAlt,
  BiLogIn,
  BiUserPin,
  BiMessageAltDots
} from "react-icons/bi"

import {
  TbLock,
  TbLockOpen,
} from "react-icons/tb"

import {
  FaChalkboardTeacher,
  FaHome,
  FaLanguage,
  FaMoneyCheckAlt,
  FaRegFile,
  FaUserCog,
  FaUserGraduate,
  FaPercent
} from "react-icons/fa"

import {
  MdReportProblem,
  MdClass
} from "react-icons/md"

import { ImBooks } from "react-icons/im"

import {
  CloudUploadOutlined,
  EllipsisOutlined
} from '@ant-design/icons'

import { CgArrowUpR } from "react-icons/cg"

import { HiLocationMarker } from "react-icons/hi"

const ListIcons = {
  ICON_SEARCH: <SearchOutlined className="primary-text fs-20" />,
  ICON_LOADING: <LoadingOutlined
    style={{
      color: "#0078d4"
    }}
    spin
  />,
  ICON_MENUFOLD: <MenuFoldOutlined />,
  ICON_MENUUNFOLD: <MenuUnfoldOutlined />,
  ICON_LOGOUT: <BiLogIn className="fs-20" />,
  ICON_BLOCK: <TbLock className="fs-18" />,
  ICON_UNBLOCK: <TbLockOpen className="fs-18" />,
  ICON_CHECK: <BsCheck className="fw-800" />,
  ICON_STATISTIC: <AiOutlineBarChart className="fs-18" />,
  ICON_MUSIC: <BsFileMusicFill className="fs-18" />,
  ICON_LANGUAGE: <FaLanguage className="fs-18" />,
  ICON_PAYMENT: <FaMoneyCheckAlt className="fs-18" />,
  ICON_PAYMENT_BOOKING: <FaMoneyCheckAlt className="fs-18 green-text" />,
  ICON_TEACHER: <FaChalkboardTeacher className="fs-18" />,
  ICON_STAFF: <FaUserCog className="fs-18" />,
  ICON_STUDENT: <FaUserGraduate className="fs-18" />,
  ICON_REPORT: <MdReportProblem className="fs-18" />,
  ICON_SUBJECT_CATE: <ImBooks className="fs-18" />,
  ICON_SUBJECT_CATE_PRIMARY_COLOR: <ImBooks className="fs-18 primary-text" />,
  ICON_CAMERA: <AiOutlineCamera className="fs-18" />,
  ICON_DELETE: <BsFillTrash3Fill className="red-text fs-18" />,
  ICON_WARNING: <AiOutlineWarning className="burlywood-text fs-20" />,
  ICON_WARNING_MODAL: <AiOutlineWarning className="burlywood-text" />,
  ICON_SUSCESS_MODAL: <AiOutlineCheckCircle className="green-text" />,
  ICON_TRASH:
    <BsTrash2
      style={{
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        height: "80px",
        width: "80px",
        color: '#ed5151'
      }}
    />,
  ICON_FILE_DELETE: <FaRegFile className="fs-18" />,
  ICON_ERROR: <BiErrorAlt className="fs-18" />,
  ICON_SUSCESS: <AiOutlineCheckCircle className="fs-18" />,
  ICON_LIST: <AiOutlineUnorderedList className="fs-18" />,
  ICON_NEXT: <AiOutlineArrowRight className="fs-18" />,
  ICON_EDIT: <AiFillEdit className="green-text fs-18" />,
  ICON_VIEW: <AiFillEye className="primary-text fs-18" />,
  ICON_CONFIRM: <AiFillCheckCircle className="fs-18 green-text" />,
  ICON_CLOSE: <AiFillCloseCircle className="fs-18 red-text" />,
  ICON_BELL: <AiFillBell className="fs-20" style={{ color: "#404040" }} />,
  ICON_PINNOTE: <BiUserPin className="fs-45" />,
  ICON_FACEBOOK: <BsFacebook className="white-text fs-18" />,
  ICON_INSTAGRAM: <BsInstagram className="white-text fs-18" />,
  ICON_TWITTER: <BsTwitterX className="white-text fs-18" />,
  ICON_HOME: <FaHome className="fs-18" />,
  ICON_CHAT_DOT: <BsChatDots className="white-text" />,
  ICON_MESSAGE: <AiFillMessage className="fs-18" />,
  ICON_CLOUD_UPLOAD: <CloudUploadOutlined className="cursor-pointer" />,
  ICON_MIC: <BsMic className="white-text fs-17" />,
  ICON_MIC_MUTE: <BsMicMute className="white-text fs-17" />,
  ICON_CAMERA_VIDEO: <BsCameraVideo className="white-text fs-17" />,
  ICON_CAMERA_VIDEO_OFF: <BsCameraVideoOff className="white-text fs-17" />,
  ICON_MESSAGE_DOT: <BiMessageAltDots className="white-text fs-17" />,
  ICON_SEND: <BsSend className="white-text fs-17" />,
  ICON_TELEPHONE: <BsTelephone className="white-text fs-17" />,
  ICON_RATE: <AiFillStar className="fs-18 burlywood-text" />,
  ICON_PAYMENT_MENTOR: <AiFillPayCircle className="fs-18" />,
  ICON_DOWN: <AiFillCaretDown className="fs-18" />,
  ICON_UP: <AiFillCaretUp className="fs-18" />,
  ICON_ELLIP: <EllipsisOutlined className="fs-18" />,
  ICON_SHARE_SCREEN: <CgArrowUpR className="white-text fs-17" />,
  ICON_MIC_BLACK: <BsMic className="black-text fs-18" />,
  ICON_MIC_MUTE_BLACK: <BsMicMute className="black-text fs-18" />,
  ICON_PLAY_FS_30: <BsFillPlayFill className='fs-23 ml-2' />,
  ICON_LOCATION: <HiLocationMarker />,
  ICON_DATE_OF_BIRTH: <BsCake2 />,
  ICON_PERCENT: <FaPercent className="fs-18" />,
  ICON_LEVEL: <BsBarChartFill className="fs-18" />,
  ICON_LEARN_TYPE: <MdClass className="fs-18" />,
  ICON_QUESTION: <AiOutlineQuestionCircle />,
  ICON_PLUS: <AiFillPlusCircle className="fs-18" />
}

export default ListIcons
