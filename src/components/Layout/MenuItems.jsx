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
    label: "Blog"
  },
  // {
  //   key: Router.TIM_KIEM_GIAO_VIEN,
  //   label: "Tìm kiếm giáo viên"
  // },
  {
    key: Router.CACH_HOAT_DONG,
    label: "Cách hoạt động"
  }
  // {
  //   key: Router.POST_BAI_TIM_GIAO_VIEN,
  //   label: "Đăng bài tìm giáo viên"
  // },
]

export const MenuUser = (user) => [
  {
    isView: true,
    key: Router.PROFILE,
    label: "Profile",
  },
  {
    isView: user?.RoleID === Roles.ROLE_TEACHER,
    key: Router.SUBJECT_SETTING,
    label: "Cài đặt môn học",
  },
  {
    isView: !user?.IsByGoogle,
    key: Router.CAI_DAT_MAT_KHAU,
    label: "Cài đặt mật khẩu"
  },
  {
    isView: true,
    key: Router.LICH_HOC,
    label: "Lịch học",
  },
  {
    isView: true,
    key: Router.LICH_SU_BOOKING,
    label: "Lịch sử booking",
  },
  {
    isview: !!(user?.RoleID === Roles.ROLE_STUDENT),
    key: Router.DANG_BAI_VIET,
    label: "Bài viết đã đăng",
  },
  {
    isView: true,
    key: Router.HOP_THU_DEN,
    label: "Hộp thư đến"
  },
  {
    isView: true,
    key: Router.LICH_SU_GIAO_DICH,
    label: "Lịch sử giao dịch"
  },
  {
    isView: true,
    key: Router.DANH_SACH_MON_DA_HOC,
    label: user?.RoleID === Roles.ROLE_TEACHER ?
      "Danh sách các môn đã dạy"
      :
      "Danh sách các môn đã tham gia"
  },
  {
    isView: true,
    key: Router.CAI_DAT_TAI_KHOAN_NH,
    label: "Cài đặt tài khoản ngân hàng"
  },
]

export const MenuAdmin = () => [
  {
    icon: ListIcons.ICON_STATISTIC,
    label: "Thống kê",
    key: Router.QUAN_LY_THONG_KE,
    RoleID: [1, 2]
  },
  // {
  //   icon: ListIcons.ICON_STAFF,
  //   label: "Quản trị hệ thống",
  //   key: Router.QUAN_LY_STAFF,
  //   RoleID: [1]
  // },
  {
    icon: ListIcons.ICON_TEACHER,
    label: "Giáo viên",
    key: Router.QUAN_LY_GIAO_VIEN,
    RoleID: [1, 2]
  },
  {
    icon: ListIcons.ICON_STUDENT,
    label: "Học sinh",
    key: Router.QUAN_LY_HOC_SINH,
    RoleID: [1, 2]
  },
  {
    icon: ListIcons.ICON_SUBJECT_CATE,
    label: "Quản lý môn học",
    key: Router.QUAN_LY_MON_HOC,
    RoleID: [1, 2],
  },
  {
    icon: ListIcons.ICON_MESSAGE,
    label: "Quản lý hộp thư đến",
    key: Router.QUAN_LY_HOP_THU_DEN,
    RoleID: [1, 2],
  },
  {
    icon: ListIcons.ICON_REPORT,
    label: "Issue",
    key: Router.QUAN_LY_REPORT,
    RoleID: [1, 2]
  },
  {
    icon: ListIcons.ICON_PAYMENT,
    label: "Quản lý lịch sử giao dịch",
    key: Router.QUAN_LY_GIAO_DICH,
    RoleID: [1]
  },
  {
    icon: ListIcons.ICON_PAYMENT_MENTOR,
    label: "Quản lý chuyển khoản",
    key: Router.QUAN_LY_CHUYEN_KHOAN,
    RoleID: [1]
  },
  {
    icon: <div style={{ marginLeft: '-5px' }}>{ListIcons.ICON_LOGOUT}</div>,
    label: "Đăng xuất",
    key: 'logout',
    RoleID: [1]
  },
]
