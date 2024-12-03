import Router from "src/routers"
import ListIcons from "../ListIcons"
import { Roles } from "src/lib/constant"


export const MenuCommon = () => [
  {
    key: Router.TIM_KIEM_MON_HOC,
    label: "Tìm kiếm môn học",
  },
  {
    key: Router.BLOG,
    label: "Bài đăng"
  },
  {
    key: Router.CACH_HOAT_DONG,
    label: "Cách hoạt động"
  }
]

export const MenuUser = (user) => [
  {
    key: Router.PROFILE,
    label: "Profile",
    TabID: 1
  },
  {
    key: Router.CAI_DAT_MAT_KHAU,
    label: "Cài đặt mật khẩu",
    TabID: 2
  },
  {
    key: Router.SUBJECT_SETTING,
    label: "Cài đặt môn học",
    TabID: 3
  },
  {
    key: Router.LICH_HOC,
    label: user?.RoleID === Roles.ROLE_TEACHER
      ? "Lịch dạy"
      : "Lịch học",
    TabID: 4
  },
  {
    key: Router.DANH_SACH_MON_DA_HOC,
    label: user?.RoleID === Roles.ROLE_TEACHER ?
      "Danh sách các môn đã dạy"
      :
      "Danh sách các môn đã tham gia",
    TabID: 5
  },
  {
    key: Router.KHOA_HOC,
    label: "Khóa học",
    TabID: 6
  },
  {
    key: Router.LICH_SU_BOOKING,
    label: "Lịch sử booking",
    TabID: 7
  },
  {
    key: Router.BAI_DANG_DA_DANG_KY,
    label: "Bài đăng đã đăng ký",
    TabID: 8
  },
  {
    key: Router.DANG_BAI_VIET,
    label: "Đăng bài",
    TabID: 9
  },
  {
    key: Router.HOP_THU_DEN,
    label: "Hộp thư đến",
    TabID: 10
  },
  {
    key: Router.LICH_SU_GIAO_DICH,
    label: "Lịch sử giao dịch",
    TabID: 11
  },
  {
    key: Router.CAI_DAT_TAI_KHOAN_NH,
    label: "Cài đặt tài khoản ngân hàng",
    TabID: 12
  },
]

export const MenuAdmin = () => [
  {
    icon: ListIcons.ICON_STATISTIC,
    label: "Thống kê",
    key: Router.QUAN_LY_THONG_KE,
    TabID: 1
  },
  {
    icon: ListIcons.ICON_STAFF,
    label: "Quản trị hệ thống",
    key: Router.QUAN_LY_STAFF,
    TabID: 2
  },
  {
    icon: ListIcons.ICON_TEACHER,
    label: "Giáo viên",
    key: Router.QUAN_LY_GIAO_VIEN,
    TabID: 3
  },
  {
    icon: ListIcons.ICON_SUBJECT_SETTING,
    label: "Môn học của giáo viên",
    key: Router.QUAN_LY_SUBJECT_SETTING,
    TabID: 4
  },
  {
    icon: ListIcons.ICON_STUDENT,
    label: "Học sinh",
    key: Router.QUAN_LY_HOC_SINH,
    TabID: 5
  },
  {
    icon: ListIcons.ICON_BLOG,
    key: Router.QUAN_LY_BAI_DANG,
    label: "Bài đăng của học sinh",
    TabID: 6
  },
  {
    icon: ListIcons.ICON_SUBJECT_CATE,
    label: "Quản lý danh mục môn học",
    key: Router.QUAN_LY_MON_HOC,
    TabID: 7
  },
  {
    icon: ListIcons.ICON_PAYMENT,
    label: "Quản lý lịch sử giao dịch",
    key: Router.QUAN_LY_GIAO_DICH,
    TabID: 8
  },
  {
    icon: ListIcons.ICON_PAYMENT_MENTOR,
    label: "Quản lý tiền lương",
    key: Router.QUAN_LY_TIEN_LUONG,
    TabID: 9
  },
  {
    icon: ListIcons.ICON_RATE,
    label: "Nhận xét của học sinh",
    key: Router.QUAN_LY_FEEDBACK,
    TabID: 11
  },
  {
    icon: ListIcons.ICON_MESSAGE,
    label: "Quản lý hộp thư đến",
    key: Router.QUAN_LY_HOP_THU_DEN,
    TabID: 12
  },
  {
    icon: <div style={{ marginLeft: '-5px' }}>{ListIcons.ICON_LOGOUT}</div>,
    label: "Đăng xuất",
    key: 'logout',
    TabID: 13
  },
]
